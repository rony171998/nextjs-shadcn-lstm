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

    console.log('[/api/exchange-info] Successfully fetched exchange info');
    
    // Return the exchange info in the response
    const response = {
      success: true,
      data: exchangeInfo,
      timestamp: new Date().toISOString()
    };
    
    console.log('[/api/exchange-info] Sending response with data');
    return NextResponse.json(response);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[/api/exchange-info] Error:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch exchange info',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


