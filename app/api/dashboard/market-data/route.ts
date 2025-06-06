import { NextResponse } from 'next/server';
import { getEurUsdData } from '@/lib/db';

export interface MarketData {
  symbol: string;
  symbol_db: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdated: string;
}

export async function GET(request: Request, context: any) {
  try {
    // Get the latest 2 data points to calculate 24h change
    const data = await getEurUsdData({ limit: 2, tableName: 'eur_usd', timeFrame: 'daily' });
    const data2 = await getEurUsdData({ limit: 2, tableName: 'usd_cop', timeFrame: 'daily' });
    
    if (!data || data.length === 0) {
      throw new Error('No se encontraron datos de EUR/USD');
    }

    const latest = data[0];
    const previous = data[1] || latest; // If only one data point, use it for both
    
    // Calculate 24h change percentage
    const change24h = ((latest.close - previous.close) / previous.close) * 100;
    
    const marketData: MarketData[] = [
      {
        symbol: 'EUR/USD',
        symbol_db: 'eur-usd',
        price: latest.close,
        change24h: parseFloat(change24h.toFixed(2)),
        high24h: latest.high,
        low24h: latest.low,
        volume: 0, // Volume data not available in the database
        lastUpdated: latest.date
      },
      {
        symbol: 'USD/COP',
        symbol_db: 'usd-cop',
        price: data2[0].close,
        change24h: parseFloat(change24h.toFixed(2)),
        high24h: data2[0].high,
        low24h: data2[0].low,
        volume: 0, // Volume data not available in the database
        lastUpdated: data2[0].date
      }
    ];

    return NextResponse.json(marketData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos del mercado' },
      { status: 500 }
    );
  }
}
