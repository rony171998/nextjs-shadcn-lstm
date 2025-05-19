import { NextResponse } from 'next/server';
import { getEurUsdData, getEurUsdWeeklyData, getEurUsdMonthlyData, getEurUsdYearlyData } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;

  try {
    let data;
    if (period === 'weekly') {
      data = await getEurUsdWeeklyData(limit);
    } else if (period === 'monthly') {
      data = await getEurUsdMonthlyData(limit);
    } else if (period === 'yearly') {
      data = await getEurUsdYearlyData(limit);
    } else {
      data = await getEurUsdData(limit);
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}