import { NextResponse } from 'next/server';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export async function GET() {
  try {
    // Simulación de datos de noticias
    // En una aplicación real, esto vendría de una API o base de datos
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'EUR/USD alcanza máximo de 3 años tras especulaciones sobre recortes del BCE',
        description: 'El euro se fortaleció frente al dólar estadounidense, alcanzando su nivel más alto en tres años, impulsado por la especulación de que el Banco Central Europeo podría recortar las tasas de interés debido a las tensiones comerciales y una perspectiva económica incierta.',
        source: 'Reuters',
        date: '2025-04-20',
        category: 'Forex',
        sentiment: 'positive',
        url: 'https://www.reuters.com/markets/currencies/euro-gets-lift-german-debt-brake-reform-currencies-mired-trade-war-fallout-2025-03-05/'
      },
      {
        id: '2',
        title: 'Bitcoin supera los $97,000 impulsado por la demanda institucional',
        description: 'Bitcoin ha alcanzado un nuevo máximo de $97,000, respaldado por un aumento en la demanda institucional y la adopción de ETF de Bitcoin, consolidando su posición como una inversión principal.',
        source: 'Yahoo Finance',
        date: '2025-05-02',
        category: 'Crypto',
        sentiment: 'positive',
        url: 'https://finance.yahoo.com/news/bitcoin-tops-97k-institutional-demand-000000440.html'
      },
      {
        id: '3',
        title: 'Precios del oro se estabilizan tras alcanzar récords históricos',
        description: 'Después de alcanzar un récord de $3,500 por onza en abril, los precios del oro se han corregido a $3,250, estabilizándose mientras los inversores evalúan las condiciones macroeconómicas y las señales de sobrevaloración.',
        source: 'The Economic Times',
        date: '2025-05-04',
        category: 'Commodities',
        sentiment: 'neutral',
        url: 'https://m.economictimes.com/news/international/us/gold-rate-predictions-has-the-bull-cycle-ended-heres-what-market-indicators-hint-at-amid-shifting-global-trends/articleshow/120876068.cms'
      },
      {
        id: '4',
        title: 'USD/JPY se debilita tras revisión a la baja de las previsiones del BOJ',
        description: 'El yen japonés se debilitó frente al dólar estadounidense después de que el Banco de Japón revisara a la baja sus previsiones de crecimiento e inflación, manteniendo las tasas de interés sin cambios y generando incertidumbre en los mercados.',
        source: 'Reuters',
        date: '2025-04-28',
        category: 'Forex',
        sentiment: 'negative',
        url: 'https://www.reuters.com/markets/currencies/yen-slips-boj-holds-rates-cautious-outlook-2025-04-28/'
      }
    ];

    return NextResponse.json(mockNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Error al obtener las noticias' },
      { status: 500 }
    );
  }
}
