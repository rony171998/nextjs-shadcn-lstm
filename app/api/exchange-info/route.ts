import { NextResponse } from 'next/server';
import { getExchangeInfo } from '@/lib/binance';

// Enable dynamic routes
export const dynamic = 'force-dynamic';

// Disable caching for fresh data
export const revalidate = 0;

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS method for CORS preflight
function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
    },
  });
}

export async function GET(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

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
    
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error) {
    console.error('[/api/exchange-info] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : undefined) 
          : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}


