'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, LineChart, CandlestickChart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { Data } from '@/lib/db';
import { Datapredictions } from '@/app/api/predict/route';
import { TradingViewChart } from '@/components/ui/tradingview-chart';

interface MarketData {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  trend: 'up' | 'down' | 'neutral';
}

export default function EurUsdAnalysis() {
  const [marketData, setMarketData] = useState<MarketData>({
    price: 1.1329,
    change24h: 0.28,
    high24h: 1.1350,
    low24h: 1.1300,
    volume24h: 1_200_000_000,
    trend: 'up'
  });
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('daily');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prediction, setPrediction] = useState<Datapredictions[]>([]);
  const [models, setModels] = useState<{ name: string; description: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('TLS_LSTMModel');

  const fetchData = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await axios.get(`/api/eur-usd?period=${period}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchModels = async () => {
      const response = await axios.get('/api/models');
      setModels(response.data);
      if (response.data.length > 0) {
        setSelectedModel(response.data[0].name);
      }
  };

  const fetchPredict = async () => {
    const response = await axios.get('/api/predict', {
      params: {
        model_name: selectedModel,
        ticker: 'EUR/USD'
      }
    });
    setPrediction(response.data);
  };

  useEffect(() => {
    fetchData();
    fetchModels();
  }, [period]);

  useEffect(() => {
    fetchPredict();
  }, [selectedModel, period]);

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];
  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: CandlestickChart },
    { value: 'line', label: 'Line', icon: LineChart },
    { value: 'bar', label: 'Bar', icon: BarChart2 }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EUR/USD Analysis</h1>
          <p className="text-muted-foreground">Real-time market analysis and predictions</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <Badge variant={marketData.trend === 'up' ? 'secondary' : 'destructive'}>
              {marketData.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.price}</div>
            <p className={`text-xs ${marketData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.high24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.low24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(marketData.volume24h / 1_000_000).toFixed(1)}M</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <TradingViewChart 
              value="daily" 
              title="EUR/USD Daily Chart" 
              data={data} 
              period={period}
              prediction={prediction}
            />
        </CardContent>
      </Card>

      <Tabs defaultValue="technical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Moving Averages</h3>
                  <p className="text-sm text-muted-foreground">SMA (20): 1.1300</p>
                  <p className="text-sm text-muted-foreground">EMA (50): 1.1280</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Oscillators</h3>
                  <p className="text-sm text-muted-foreground">RSI (14): 65</p>
                  <p className="text-sm text-muted-foreground">MACD: Bullish</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fundamental">
          <Card>
            <CardHeader>
              <CardTitle>Fundamental Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Economic Indicators</h3>
                  <p className="text-sm text-muted-foreground">ECB Interest Rate: 4.25%</p>
                  <p className="text-sm text-muted-foreground">US Fed Rate: 5.50%</p>
                </div>
                <div>
                  <h3 className="font-medium">Market Sentiment</h3>
                  <p className="text-sm text-muted-foreground">Bullish: 65%</p>
                  <p className="text-sm text-muted-foreground">Bearish: 35%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Short-term (1 week)</h3>
                  <p className="text-sm text-muted-foreground">Target: 1.1400</p>
                  <p className="text-sm text-muted-foreground">Confidence: 75%</p>
                </div>
                <div>
                  <h3 className="font-medium">Medium-term (1 month)</h3>
                  <p className="text-sm text-muted-foreground">Target: 1.1500</p>
                  <p className="text-sm text-muted-foreground">Confidence: 60%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 