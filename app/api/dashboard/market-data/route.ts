import { NextResponse } from 'next/server';
import { getTickerPrice } from '@/lib/binance';

// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const revalidate = 0; // Desactiva el caché para obtener datos frescos

export async function GET() {
  try {
    // Definir los símbolos que queremos seguir
    const symbols = [
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

    // Obtener datos de todos los símbolos
    const assetsData = [];
    
    for (const { symbol, name, category } of symbols) {
      try {
        const ticker = await getTickerPrice(symbol);
        if (!ticker) continue;

        const priceChangePercent = parseFloat(ticker.priceChangePercent);
        assetsData.push({
          id: symbol,
          name,
          symbol,
          category,
          lastPrice: parseFloat(ticker.lastPrice || '0'),
          change24h: parseFloat(ticker.priceChangePercent || '0'),
          volume24h: (parseFloat(ticker.volume || '0') * parseFloat(ticker.weightedAvgPrice || '0')) || 0,
          isFavorite: false,
          marketCap: 0,
          volatility: Math.abs(parseFloat(ticker.highPrice || '0') - parseFloat(ticker.lowPrice || '0')) / (parseFloat(ticker.lowPrice || '1') || 1) * 100,
          trend: (priceChangePercent >= 0 ? 'up' : 'down') as 'up' | 'down',
          alerts: 0
        });
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Continuar con los siguientes símbolos
      }
    }

    return NextResponse.json(assetsData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos del mercado' },
      { status: 500 }
    );
  }
}
