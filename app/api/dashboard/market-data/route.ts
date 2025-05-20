import { NextResponse } from 'next/server';
import { getTickerPrice } from '@/lib/binance';
// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Deshabilitar caché para obtener datos frescos
export const revalidate = 0;

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

export async function GET() {
  console.log('Iniciando obtención de datos de mercado...');
  const assetsData: AssetData[] = [];
  const startTime = Date.now();
  const maxExecutionTime = 5000; // 5 segundos de tiempo máximo
  
  try {
    // Enfoque progresivo: primero obtener datos prioritarios
    // Si queda tiempo, intentar obtener más datos
    
    // 1. Asegurar que tengamos al menos datos prioritarios
    console.log('Obteniendo datos de símbolos prioritarios...');
    for (const { symbol, name, category } of PRIORITY_SYMBOLS) {
      try {
        console.log(`Intentando obtener datos para ${symbol}`);
        const ticker = await getTickerPrice(symbol);
        
        if (ticker) {
          assetsData.push(transformTickerData(ticker, symbol, name, category));
          console.log(`Datos obtenidos para ${symbol}`);
        }
      } catch (error) {
        console.warn(`No se pudo obtener datos para ${symbol}:`, error);
        // Continuar con el siguiente símbolo prioritario
      }
    }
    
    // 2. Si tenemos tiempo restante, obtener símbolos adicionales
    if (assetsData.length > 0 && (Date.now() - startTime) < maxExecutionTime) {
      console.log('Obteniendo datos adicionales...');
      const remainingSymbols = ALL_SYMBOLS.filter(s => 
        !PRIORITY_SYMBOLS.some(ps => ps.symbol === s.symbol) ||
        !assetsData.some(a => a.symbol === s.symbol)
      );
      
      for (const { symbol, name, category } of remainingSymbols) {
        // Verificar si nos estamos acercando al límite de tiempo
        if ((Date.now() - startTime) > maxExecutionTime) {
          console.log('Tiempo límite alcanzado, terminando recopilación de datos');
          break;
        }
        
        try {
          const ticker = await getTickerPrice(symbol);
          if (ticker) {
            assetsData.push(transformTickerData(ticker, symbol, name, category));
            console.log(`Datos adicionales obtenidos para ${symbol}`);
          }
        } catch (error) {
          console.warn(`No se pudo obtener datos adicionales para ${symbol}:`, error);
          // Continuar con el siguiente símbolo
        }
      }
    }

    console.log(`Datos obtenidos para ${assetsData.length} de ${ALL_SYMBOLS.length} símbolos`);
    
    if (assetsData.length === 0) {
      console.error('No se pudo obtener datos para ningún símbolo');
      return NextResponse.json(
        { error: 'No se pudieron obtener datos de mercado', details: 'No se recibieron datos de la API' },
        { status: 503 }
      );
    }

    return NextResponse.json(assetsData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error en market data API:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Error al obtener los datos del mercado',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
