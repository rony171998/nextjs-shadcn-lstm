'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, LineChart, CandlestickChart, AreaChart, BarChart3, ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import axios from 'axios';
import { Data } from '@/lib/db';
import { Datapredictions } from '@/app/api/predict/route';
import { TradingViewChart } from '@/components/ui/tradingview-chart';
import { AssetBinance } from '@/app/dashboard/page';
import { getTickerPrice } from '@/lib/binance';
import { AnimatedNumber } from '@/components/ui/animated-number';

const initialMarketData: AssetBinance = {
  symbol: '',
  priceChange: '0',
  priceChangePercent: '0',
  weightedAvgPrice: '0',
  prevClosePrice: '0',
  lastPrice: '0',
  lastQty: '0',
  bidPrice: '0',
  bidQty: '0',
  askPrice: '0',
  askQty: '0',
  openPrice: '0',
  highPrice: '0',
  lowPrice: '0',
  volume: '0',
  quoteVolume: '0',
  openTime: 0,
  closeTime: 0,
  firstId: 0,
  lastId: 0,
  count: 0
};

export default function EurUsdAnalysisClient() {
  const [marketData, setMarketData] = useState<AssetBinance>(initialMarketData);
  const [chartType, setChartType] = useState('area');
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<Data[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [dataRange, setDataRange] = useState<number | null>(30); // Por defecto 30 días (1 mes), null = sin límite
  const [prediction, setPrediction] = useState<Datapredictions[]>([]);
  const [models, setModels] = useState<{ name: string; description: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('TLS_LSTMModel');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Construir URL dependiendo de si hay límite o no
      const url = dataRange === null
        ? `/api/eur-usd?period=${period}` // Sin límite
        : `/api/eur-usd?period=${period}&limit=${dataRange}`; // Con límite

      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const symbols = [
        { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
      ];

      // Obtener datos de todos los símbolos con manejo de errores mejorado
      let assetsData = {};

      for (const { symbol, name, category } of symbols) {
        try {
          const ticker = await getTickerPrice(symbol);
          if (!ticker) continue;

          const priceChangePercent = parseFloat(ticker.priceChangePercent);
          assetsData = ticker;
        } catch (error: any) {
          console.warn(`No se pudo obtener datos para ${symbol}:`, error.message);
          // Continuar con los siguientes símbolos
        }
      }

      setMarketData(assetsData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get('/api/models');
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchPredict = async () => {
    try {
      const response = await axios.get(`/api/predict?model_name=${selectedModel}&ticker=EUR/USD`);
      setPrediction(response.data);
    } catch (error) {
      setPrediction([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMarketData();
    fetchModels();
  }, [period, dataRange]);

  useEffect(() => {
    fetchPredict();
  }, [selectedModel, period]);

  const timeframes = ['daily', 'weekly', 'monthly', 'yearly'] as const;
  const dataRanges = [
    { value: 30, label: '1 mes' },
    { value: 90, label: '3 meses' },
    { value: 180, label: '6 meses' },
    { value: 365, label: '1 año' },
    { value: 1825, label: '5 años' },
    { value: null, label: 'Todos los datos' }
  ];
  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: CandlestickChart },
    { value: 'line', label: 'Line', icon: LineChart },
    { value: 'bar', label: 'Bar', icon: BarChart2 },
    { value: 'area', label: 'Area', icon: AreaChart }
  ];

  const refreshData = () => {
    setIsLoading(true);
    fetchData();
    fetchMarketData();
    fetchModels();
    fetchPredict();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
            title="Volver atrás"
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{marketData.symbol} Analysis</h1>
            <p className="text-muted-foreground">Real-time market analysis and predictions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/eur-usd/indicators" className="hidden sm:block">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <BarChart2 className="h-5 w-5" />
              Ver Indicadores Técnicos
            </Button>
          </Link>
          <Button
            onClick={refreshData}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar Datos'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <Badge variant={marketData.priceChangePercent >= 0 ? 'success' : 'default'}>
              {marketData.priceChangePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {marketData.priceChangePercent}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.lastPrice ?? 'N/A'}</div>
            <div className="text-sm text-muted-foreground">${marketData.priceChange ?? 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.highPrice ?? 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketData.lowPrice ?? 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$
              <AnimatedNumber
                value={marketData.volume ? parseFloat(marketData.volume) : 0}
                formatValue={(val) => val.toFixed(2)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={(value) => setPeriod(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf} value={tf}>
                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={dataRange === null ? 'null' : dataRange.toString()}
              onValueChange={(value) => setDataRange(value === 'null' ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rango de datos" />
              </SelectTrigger>
              <SelectContent>
                {dataRanges.map(range => (
                  <SelectItem
                    key={range.value === null ? 'null' : range.value.toString()}
                    value={range.value === null ? 'null' : range.value.toString()}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prediction Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.name} value={model.name}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <TradingViewChart
              type={chartType}
              data={data}
              prediction={prediction}
              title="EUR/USD"
              period={period}
              value={0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
