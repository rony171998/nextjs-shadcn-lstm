import { NextResponse } from 'next/server';
import { getKlines } from '@/lib/binance';

// Enable dynamic routes
export const dynamic = 'force-dynamic';

// Disable caching for fresh data
export const revalidate = 0;

export async function GET(request: Request) {
  // Get URL parameters
  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol');
  const interval = url.searchParams.get('interval');
  const limit = url.searchParams.get('limit');

  // Validate required parameters
  if (!symbol) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Symbol parameter is required'
      },
      { status: 400 }
    );
  }

  if (!interval) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Interval parameter is required'
      },
      { status: 400 }
    );
  }

  // Convert limit to number if provided
  const limitNumber = limit ? parseInt(limit, 10) : undefined;

  try {
    // Call the getKlines function with the provided parameters
    const klines = await getKlines(
      symbol, 
      interval, 
      limitNumber || 500 // Default to 500 if not provided or invalid
    );

    // Return the klines data in the response
    return NextResponse.json({
      success: true,
      data: klines,
      timestamp: new Date().toISOString(),
      params: {
        symbol,
        interval,
        limit: limitNumber || 500
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch klines data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
