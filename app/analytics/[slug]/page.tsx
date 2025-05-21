import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TradingViewChart } from "@/components/ui/tradingview-chart";
import { LineChart, BarChart2, RefreshCw } from "lucide-react";
import type { Data } from "@/lib/db";
import { AlertDescription } from "@/components/ui/alert";

interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default async function Page({ params }: { params: { slug: string } }) {
  // Default symbol is EURUSD, but you can use the slug if needed
  const symbol = params.slug.toUpperCase() || 'EURUSDT';
  
  try {
    // Fetch klines data from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:'+process.env.PORT}/api/klines?symbol=${symbol}&interval=1h&limit=100`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch klines data');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch klines data');
    }
    
    const klines: KlineData[] = data.data;
    
    // Format data for TradingViewChart
    const formattedData: Data[] = klines.map(kline => ({
      date: new Date(kline.openTime).toISOString(),
      open: parseFloat(kline.open),
      high: parseFloat(kline.high),
      low: parseFloat(kline.low),
      close: parseFloat(kline.close),
      // Use close as avg_price since it's required by the Data type
      avg_price: parseFloat(kline.close)
    }));
    
    // Get the latest price data
    const latest = formattedData[0] || {
      date: new Date().toISOString(),
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      avg_price: 0
    };
    
    // Empty prediction data since we don't have predictions in the klines API
    const predictionData: any[] = [];
    
    // Calculate 24h change
    const latestPrice = latest.close;
    const previousPrice = formattedData[formattedData.length - 1]?.close || latestPrice;
    const changePercent = previousPrice !== 0 ? ((latestPrice - previousPrice) / previousPrice * 100).toFixed(2) : '0.00';
    const isPositive = parseFloat(changePercent) >= 0;
    
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{symbol} Chart</h1>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold">
              {latest?.close?.toFixed(5) || '0.00000'}
            </span>
            <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
              {isPositive ? '+' : ''}{changePercent}%
            </span>
            <span className="text-sm text-muted-foreground">
              {latest?.date ? formatDate(new Date(latest.date).getTime()) : 'N/A'}
            </span>
          </div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Price */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Actual</CardTitle>
              <Badge variant={isPositive ? 'default' : 'destructive'}>
                {isPositive ? (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    {changePercent}%
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                      <polyline points="16 17 22 17 22 11"></polyline>
                    </svg>
                    {changePercent}%
                  </span>
                )}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latest.close.toFixed(5)}
              </div>
              <div className="text-sm text-muted-foreground">
                ${(latest.close - latest.open).toFixed(5)} (24h)
              </div>
            </CardContent>
          </Card>

          {/* 24h High */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Máximo (24h)</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formattedData.length > 0 ? Math.max(...formattedData.map(d => d.high)).toFixed(5) : '0.00000'}
              </div>
              <div className="text-sm text-muted-foreground">
                Máximo de las últimas 24h
              </div>
            </CardContent>
          </Card>

          {/* 24h Low */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mínimo (24h)</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formattedData.length > 0 ? Math.min(...formattedData.map(d => d.low)).toFixed(5) : '0.00000'}
              </div>
              <div className="text-sm text-muted-foreground">
                Mínimo de las últimas 24h
              </div>
            </CardContent>
          </Card>

          {/* 24h Volume */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volumen (24h)</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formattedData.length > 0 ? formattedData.reduce((sum: number, d: Data) => sum + (d as any).volume || 0, 0).toLocaleString(undefined, {maximumFractionDigits: 2}) : '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">
                Volumen total en 24h
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gráfico de Precios</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <LineChart className="h-4 w-4 mr-2" />
                Línea
              </Button>
              <Button variant="outline" size="sm">
                <BarChart2 className="h-4 w-4 mr-2" />
                Velas
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] w-full">
                <TradingViewChart
                  data={formattedData}
                  prediction={predictionData}
                  value={symbol}
                  title={`${symbol} Price`}
                  period="daily"
                  height={450}
                  type="candlestick"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching klines data:', error);
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Failed to load chart data. Please try again later.
            </p>
            <AlertDescription>
              {error?.message}
            </AlertDescription>
          </CardContent>
        </Card>
      </div>
    );
  }
}