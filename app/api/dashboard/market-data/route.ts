import { NextResponse } from 'next/server';
import { getTickerPrice } from '@/lib/binance';

// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
// Usar edge runtime para mejor rendimiento
export const runtime = 'edge';

// Deshabilitar caché para obtener datos frescos
export const revalidate = 0;

// Configuración de tiempo máximo de ejecución (10 segundos para evitar timeouts de Vercel)
const MAX_EXECUTION_TIME_MS = 10000;
const CONCURRENCY_LIMIT = 2; // Número máximo de peticiones concurrentes

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

// Agrupar símbolos por prioridad
const SYMBOL_GROUPS = {
  highPriority: PRIORITY_SYMBOLS,
  mediumPriority: ALL_SYMBOLS.filter(s => !PRIORITY_SYMBOLS.some(ps => ps.symbol === s.symbol)),
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
  timeoutMs: number
): Promise<AssetData[]> {
  const results: AssetData[] = [];
  const startTime = Date.now();
  
  // Procesar en lotes
  for (let i = 0; i < symbols.length; i += concurrencyLimit) {
    // Verificar si hemos excedido el tiempo máximo de ejecución
    if (Date.now() - startTime > timeoutMs) {
      console.warn(`Tiempo de ejecución excedido al procesar lote ${i / concurrencyLimit + 1}`);
      break;
    }
    
    const batch = symbols.slice(i, i + concurrencyLimit);
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
    
    // Pequeña pausa entre lotes para evitar rate limiting
    if (i + concurrencyLimit < symbols.length) {
      // Usar setTimeout estándar en lugar de timers/promises
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const remainingTime = MAX_EXECUTION_TIME_MS - 1000; // Dejar 1 segundo para procesamiento final
  
  try {
    // Enfoque simplificado: obtener solo datos prioritarios para evitar timeouts
    const highPriorityResults = await processBatch(
      SYMBOL_GROUPS.highPriority,
      CONCURRENCY_LIMIT,
      remainingTime * 0.8 // Usar 80% del tiempo disponible para alta prioridad
    );
    
    // Verificar si tenemos tiempo restante
    const timeAfterHighPriority = Date.now();
    const timeUsed = timeAfterHighPriority - startTime;
    const timeRemaining = remainingTime - timeUsed;
    
    // Solo intentar obtener datos de prioridad media si hay suficiente tiempo
    let mediumPriorityResults: AssetData[] = [];
    if (timeRemaining > 2000 && highPriorityResults.length > 0) {
      mediumPriorityResults = await processBatch(
        SYMBOL_GROUPS.mediumPriority,
        CONCURRENCY_LIMIT,
        timeRemaining * 0.8
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
      // Intentar obtener datos solo para EURUSDT y BTCUSDT como último recurso
      const fallbackSymbols = [
        { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
        { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto' }
      ];
      
      const fallbackPromises = fallbackSymbols.map(async ({ symbol, name, category }) => {
        try {
          const ticker = await getTickerPrice(symbol);
          if (ticker) {
            return transformTickerData(ticker, symbol, name, category);
          }
        } catch {}
        return null;
      });
      
      const fallbackResults = (await Promise.all(fallbackPromises)).filter(Boolean) as AssetData[];
      
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
