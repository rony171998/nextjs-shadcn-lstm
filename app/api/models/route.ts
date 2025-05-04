import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/models', {
      headers: { 'accept': 'application/json' },
      cache: 'default',
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Error fetching models from backend' }, { status: 500 });
    }
    const models = await res.json();
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: 'Could not connect to backend'+ error }, { status: 500 });
  }
} 