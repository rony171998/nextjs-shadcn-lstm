import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export interface Model {
  model_name: string;
}

export async function GET() {
  try {
    const result = await sql`
      SELECT DISTINCT model_name 
      FROM predictions 
      ORDER BY model_name ASC
    `;
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching models from database:', error);
    return NextResponse.json(
      { error: `Error fetching models: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}