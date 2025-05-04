import { NextResponse } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.ticker) {
      return NextResponse.json({ error: 'Missing ticker' }, { status: 400 });
    }

    if (!body.model_name) {
      return NextResponse.json({ error: 'Missing model_name' }, { status: 400 });
    }

    const response = await axios.post(NEXT_PUBLIC_BACKEND_URL + '/predict',
    {
        ticker: body.ticker,
        model_name: body.model_name
    })
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error in prediction:', error);
    return NextResponse.json(
      { error: 'Error generating prediction' },
      { status: 500 }
    );
  }
} 