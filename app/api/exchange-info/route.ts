import { NextResponse } from 'next/server';
import { getExchangeInfo } from '@/lib/binance';

// Enable dynamic routes
export const dynamic = 'force-dynamic';

// Disable caching for fresh data
export const revalidate = 0;

export async function GET() {
  console.log('[/api/exchange-info] Request received');
  
  try {
    console.log('[/api/exchange-info] Fetching exchange info...');
    const exchangeInfo = await getExchangeInfo();
    
    if (!exchangeInfo) {
      console.error('[/api/exchange-info] No data returned from getExchangeInfo()');
      throw new Error('No data returned from Binance API');
    }

    // Return the exchange info in the response
    const response = {
      success: true,
      data: exchangeInfo,
      timestamp: new Date().toISOString()
    };
    
    console.log('[/api/exchange-info] Sending response with data');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[/api/exchange-info] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : undefined) 
          : undefined
      },
      { status: 500 }
    );
  }
}


