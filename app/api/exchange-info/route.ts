import { NextResponse } from 'next/server';
import { getExchangeInfo } from '@/lib/binance';

// Enable dynamic routes
export const dynamic = 'force-dynamic';

// Disable caching for fresh data
export const revalidate = 0;

export async function GET() {
  try {
    const exchangeInfo = await getExchangeInfo();

    // Return the exchange info in the response
    return NextResponse.json({
      success: true,
      data: exchangeInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
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


