import { NextResponse } from 'next/server';
import axios from 'axios';

// Configuración para rutas dinámicas
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const response = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/api/models`, {
      headers: { 'accept': 'application/json' },
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching models from backend:', error);
    return NextResponse.json(
      { error: `Could not connect to backend: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}