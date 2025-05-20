import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import axios from 'axios';

const sql = neon(process.env.DATABASE_URL!);

export type Data = {
  date: string;
  avg_price: number;
  high: number;
  low: number;
  open: number;
  close: number;
};

export type Datapredictions = {
  id: number;
  fecha: Date;
  último: number;
  apertura: number;
  máximo: number;
  mínimo: number;
  is_prediction: boolean;
  model_name: string;
  ticker: string;
  created_at: Date;
};

// Indicar que esta ruta es dinámica y no debe generarse estáticamente
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const model_name = searchParams.get('model_name');
    
    if (!ticker) {
      return NextResponse.json({ error: 'Missing ticker' }, { status: 400 });
    }
      
    if (!model_name) {
      return NextResponse.json({ error: 'Missing model_name' }, { status: 400 });
    }

    // Using the existing neon SQL client for database queries
    const result = await sql`
      SELECT * FROM predictions 
      WHERE ticker = ${ticker} 
      AND model_name = ${model_name}
      ORDER BY fecha DESC
    `;
    
    console.log('Prediction result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in prediction:', error);
    return NextResponse.json(
      { 
        error: 'Error generating prediction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}