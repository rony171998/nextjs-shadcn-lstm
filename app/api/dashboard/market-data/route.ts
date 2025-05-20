import { NextResponse } from 'next/server';
import { getTickerPrice } from '@/lib/binance';

// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
// Usar edge runtime para mejor rendimiento
export const runtime = 'edge';

// Deshabilitar caché para obtener datos frescos
export const revalidate = 0;

// Configuración de tiempo máximo de ejecución (ajustada para evitar timeouts de Vercel)
const MAX_EXECUTION_TIME_MS = process.env.VERCEL_ENV === 'production' ? 8000 : 12000;
const CONCURRENCY_LIMIT = process.env.VERCEL_ENV === 'production' ? 1 : 2; // Reducir concurrencia en producción

// Tipos de activos
interface AssetSymbol {
  symbol: string;
  name: string;
  category: string;
}

// Modelo para la respuesta de datos de mercado
interface AssetData {
  id: string;
  name: string;
  symbol: string;
  category: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
  isFavorite: boolean;
  marketCap: number;
  volatility: number;
  trend: 'up' | 'down';
  alerts: number;
}

// Lista de símbolos prioritarios
const PRIORITY_SYMBOLS: AssetSymbol[] = [
  // Forex (prioridad alta)
  { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
  { symbol: 'USDTCOP', name: 'Colombian Peso / US Dollar', category: 'Forex' },
  
  // Crypto (prioridad alta)
  { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'ETHUSDT', name: 'Ethereum', category: 'Crypto' },
];

// Lista completa de símbolos si hay tiempo de procesarlos
const ALL_SYMBOLS: AssetSymbol[] = [
  ...PRIORITY_SYMBOLS,
  { symbol: 'GBPUSDT', name: 'British Pound / US Dollar', category: 'Forex' },
  { symbol: 'AUDUSDT', name: 'Australian Dollar / US Dollar', category: 'Forex' },
  { symbol: 'USDCUSDT', name: 'US Dollar / Canadian Dollar', category: 'Forex' },
  { symbol: 'BNBUSDT', name: 'BNB', category: 'Crypto' },
  { symbol: 'SOLUSDT', name: 'Solana', category: 'Crypto' },
  { symbol: 'ADAUSDT', name: 'Cardano', category: 'Crypto' },
];

// Agrupar símbolos por prioridad y entorno
const SYMBOL_GROUPS = {
  // En producción, tenemos una estrategia más conservadora
  highPriority: process.env.VERCEL_ENV === 'production' 
    ? PRIORITY_SYMBOLS.slice(0, 2) // Solo los 2 primeros símbolos en producción
    : PRIORITY_SYMBOLS,
  mediumPriority: process.env.VERCEL_ENV === 'production'
    ? [...PRIORITY_SYMBOLS.slice(2), ...ALL_SYMBOLS.filter(s => !PRIORITY_SYMBOLS.some(ps => ps.symbol === s.symbol))]
    : ALL_SYMBOLS.filter(s => !PRIORITY_SYMBOLS.some(ps => ps.symbol === s.symbol)),
};

// Transformar datos de Binance al formato de respuesta
function transformTickerData(ticker: any, symbol: string, name: string, category: string): AssetData {
  const priceChangePercent = parseFloat(ticker.priceChangePercent || '0');
  return {
    id: symbol,
    name,
    symbol,
    category,
    lastPrice: parseFloat(ticker.lastPrice || '0'),
    change24h: priceChangePercent,
    volume24h: (parseFloat(ticker.volume || '0') * parseFloat(ticker.weightedAvgPrice || '0')) || 0,
    isFavorite: false,
    marketCap: 0,
    volatility: Math.abs(parseFloat(ticker.highPrice || '0') - parseFloat(ticker.lowPrice || '0')) / (parseFloat(ticker.lowPrice || '1') || 1) * 100,
    trend: (priceChangePercent >= 0 ? 'up' : 'down'),
    alerts: 0
  };
}

// Función para procesar lotes de símbolos con límite de concurrencia
async function processBatch(
  symbols: AssetSymbol[],
  concurrencyLimit: number,
  timeoutMs: number,
  isProduction: boolean = process.env.VERCEL_ENV === 'production'
): Promise<AssetData[]> {
  const results: AssetData[] = [];
  const startTime = Date.now();
  
  // En producción, limitar aún más el número de símbolos a procesar
  const symbolsToProcess = isProduction && symbols.length > 4 ? symbols.slice(0, 4) : symbols;
  
  // Procesar en lotes
  for (let i = 0; i < symbolsToProcess.length; i += concurrencyLimit) {
    // Verificar si hemos excedido el tiempo máximo de ejecución
    if (Date.now() - startTime > timeoutMs) {
      console.warn(`Tiempo de ejecución excedido al procesar lote ${i / concurrencyLimit + 1}`);
      break;
    }
    
    const batch = symbolsToProcess.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(async ({ symbol, name, category }) => {
      try {
        const ticker = await getTickerPrice(symbol);
        if (ticker) {
          return transformTickerData(ticker, symbol, name, category);
        }
      } catch (error) {
        console.warn(`Error procesando ${symbol}:`, error);
        return null;
      }
      return null;
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(Boolean) as AssetData[]);
    
    // Pausas entre lotes para evitar rate limiting (más en producción)
    if (i + concurrencyLimit < symbolsToProcess.length) {
      const pauseTime = isProduction ? 300 : 100; // Pausa más larga en producción
      await new Promise(resolve => setTimeout(resolve, pauseTime));
    }
  }
  
  return results;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const remainingTime = MAX_EXECUTION_TIME_MS - 1000; // Dejar 1 segundo para procesamiento final
  
  try {
    // Enfoque adaptado al entorno: más conservador en producción
    const isProduction = process.env.VERCEL_ENV === 'production';
    const highPriorityResults = await processBatch(
      SYMBOL_GROUPS.highPriority,
      CONCURRENCY_LIMIT,
      isProduction ? remainingTime * 0.9 : remainingTime * 0.8, // Dar más tiempo en producción
      isProduction
    );
    
    // Verificar si tenemos tiempo restante
    const timeAfterHighPriority = Date.now();
    const timeUsed = timeAfterHighPriority - startTime;
    const timeRemaining = remainingTime - timeUsed;
    
    // Solo intentar obtener datos de prioridad media si hay suficiente tiempo
    let mediumPriorityResults: AssetData[] = [];
    // En producción, requerimos más tiempo disponible y ser más conservadores
    const timeThreshold = isProduction ? 3000 : 2000;
    if (timeRemaining > timeThreshold && highPriorityResults.length > 0) {
      // En producción, solo intentar obtener 1-2 símbolos adicionales máximo
      const mediumPrioritySymbols = isProduction
        ? SYMBOL_GROUPS.mediumPriority.slice(0, 2)
        : SYMBOL_GROUPS.mediumPriority;
      
      mediumPriorityResults = await processBatch(
        mediumPrioritySymbols,
        isProduction ? 1 : CONCURRENCY_LIMIT, // En producción, procesar uno a la vez
        timeRemaining * (isProduction ? 0.7 : 0.8),
        isProduction
      );
    }
    
    // Combinar resultados (omitimos baja prioridad para evitar timeouts)
    const assetsData = [...highPriorityResults, ...mediumPriorityResults];
    
    console.log(`Datos obtenidos para ${assetsData.length} símbolos`);
    
    if (assetsData.length === 0) {
      console.error('No se pudo obtener datos para ningún símbolo');
      return NextResponse.json(
        { error: 'No se pudieron obtener datos de mercado', details: 'No se recibieron datos de la API' },
        { status: 503 }
      );
    }

    return NextResponse.json(assetsData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    console.error('Error en market data API:', {
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
    
    // Intentar devolver al menos un conjunto mínimo de datos
    try {
      // Intentar obtener datos solo para símbolos críticos como último recurso
      // En producción, limitar a un símbolo a la vez para maximizar éxito
      const fallbackSymbols = [
        { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
        { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto' }
      ];
      let fallbackResults: AssetData[] = [];
      
      if (process.env.VERCEL_ENV === 'production') {
        // Ejecución secuencial para producción
        for (const { symbol, name, category } of fallbackSymbols) {
          try {
            const ticker = await getTickerPrice(symbol);
            if (ticker) {
              const data = transformTickerData(ticker, symbol, name, category);
              fallbackResults.push(data);
              // En producción, si tenemos al menos un resultado, podemos salir
              // para asegurar que devolvemos algo útil
              if (fallbackResults.length > 0) {
                break;
              }
            }
          } catch {}
          // Pequeña pausa entre intentos
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        // Ejecución en paralelo para desarrollo
        const fallbackPromises = fallbackSymbols.map(async ({ symbol, name, category }) => {
          try {
            const ticker = await getTickerPrice(symbol);
            if (ticker) {
              return transformTickerData(ticker, symbol, name, category);
            }
          } catch {}
          return null;
        });
        
        fallbackResults = (await Promise.all(fallbackPromises)).filter(Boolean) as AssetData[];
      }
      
      if (fallbackResults.length > 0) {
        console.log(`Recuperación de error: devolviendo ${fallbackResults.length} símbolos de respaldo`);
        return NextResponse.json(fallbackResults, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    } catch {}
    
    // Si todo falla, devolver error
    return NextResponse.json(
      { 
        error: 'Error al obtener los datos del mercado',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
