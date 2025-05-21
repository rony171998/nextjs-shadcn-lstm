import { NextResponse } from 'next/server';
import { getExchangeInfo } from '@/lib/binance';

// Enable dynamic routes
export const dynamic = 'force-dynamic';

// Disable caching for fresh data
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Fetching exchange info from Binance...');
    const exchangeInfo = await getExchangeInfo();
    
    // Log the exchange info to the server console
    console.log('Binance Exchange Info:', JSON.stringify(exchangeInfo, null, 2));
    
    // Return the exchange info in the response
    return NextResponse.json({
      success: true,
      data: exchangeInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching exchange info:', error);
    
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
