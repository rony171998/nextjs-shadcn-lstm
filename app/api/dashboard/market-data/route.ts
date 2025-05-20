import { NextResponse } from 'next/server';
import { getTickerPrice } from '@/lib/binance';
import axios from 'axios';

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

// Función para obtener datos del mercado con reintentos
async function fetchMarketDataWithRetry(symbol: string, retries = 3, delay = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const ticker = await getTickerPrice(symbol);
      if (ticker) return ticker;
    } catch (error) {
      console.warn(`Intento ${i + 1} fallado para ${symbol}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return null;
}

export async function GET() {
  // Definir los símbolos que queremos seguir
  const symbols: AssetSymbol[] = [
    // Forex
    { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
    { symbol: 'USDTCOP', name: 'Colombian Peso / US Dollar', category: 'Forex' },
    { symbol: 'GBPUSDT', name: 'British Pound / US Dollar', category: 'Forex' },
    { symbol: 'AUDUSDT', name: 'Australian Dollar / US Dollar', category: 'Forex' },
    { symbol: 'USDCUSDT', name: 'US Dollar / Canadian Dollar', category: 'Forex' },
    // Criptomonedas
    { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto' },
    { symbol: 'ETHUSDT', name: 'Ethereum', category: 'Crypto' },
    { symbol: 'BNBUSDT', name: 'BNB', category: 'Crypto' },
    { symbol: 'SOLUSDT', name: 'Solana', category: 'Crypto' },
    { symbol: 'ADAUSDT', name: 'Cardano', category: 'Crypto' },
  ];

  try {
    console.log('Iniciando obtención de datos de mercado...');
    const assetsData = [];
    
    // Usar Promise.all con un mapeo para procesar las peticiones en paralelo
    // pero con un límite de concurrencia
    const BATCH_SIZE = 3; // Procesar 3 símbolos a la vez
    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const batch = symbols.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async ({ symbol, name, category }) => {
          try {
            console.log(`Obteniendo datos para ${symbol}...`);
            const ticker = await fetchMarketDataWithRetry(symbol);
            
            if (!ticker) {
              console.warn(`No se obtuvieron datos para ${symbol}`);
              return null;
            }

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
              trend: (priceChangePercent >= 0 ? 'up' : 'down') as 'up' | 'down',
              alerts: 0
            };
          } catch (error) {
            console.error(`Error procesando ${symbol}:`, error);
            return null;
          }
        })
      );
      
      // Filtrar nulos y agregar a los resultados
      const validResults = batchResults.filter(Boolean);
      assetsData.push(...validResults);
      
      // Pequeña pausa entre lotes para evitar rate limiting
      if (i + BATCH_SIZE < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Datos obtenidos para ${assetsData.length} de ${symbols.length} símbolos`);
    
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
