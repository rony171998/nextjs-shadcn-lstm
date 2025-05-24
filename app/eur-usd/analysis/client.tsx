'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, LineChart, CandlestickChart, AreaChart, BarChart3, ArrowLeft, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import axios, { AxiosError } from 'axios';
import { Data } from '@/lib/db';
import { Datapredictions } from '@/app/api/predict/route';
import { TradingViewChart } from '@/components/ui/tradingview-chart';
import { getTickerPrice } from '@/lib/binance';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface AssetBinance {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<Data[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [dataRange, setDataRange] = useState<number | null>(30); // Por defecto 30 días (1 mes), null = sin límite
  const [prediction, setPrediction] = useState<Datapredictions[]>([]);
  const [models, setModels] = useState<{ name: string; description: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('TLS_LSTMModel');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const url = dataRange === null
        ? `/api/eur-usd?period=${period}`
        : `/api/eur-usd?period=${period}&limit=${dataRange}`;

      const response = await axios.get<Data[]>(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      setData(response.data);
      setLastUpdated(new Date());
      return true;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : 'Error al cargar los datos';
      
      setError(errorMessage);
      toast.error('Error al cargar los datos', {
        description: errorMessage,
      });
      return false;
    }
  }, [period, dataRange]);

  const fetchMarketData = useCallback(async () => {
    try {
      const symbols = [
        { symbol: 'EURUSDT', name: 'Euro / US Dollar', category: 'Forex' },
      ];

      let assetsData = initialMarketData;
      let hasData = false;

      for (const { symbol } of symbols) {
        try {
          const ticker = await getTickerPrice(symbol);
          if (!ticker) continue;

          assetsData = { ...ticker };
          hasData = true;
          break; // Solo necesitamos un símbolo
        } catch (error: any) {
          console.warn(`No se pudo obtener datos para ${symbol}:`, error.message);
        }
      }

      setMarketData(assetsData);
      return hasData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos del mercado';
      setError(errorMessage);
      toast.error('Error de mercado', {
        description: errorMessage,
      });
      return false;
    }
  }, []);

  const fetchModels = useCallback(async () => {
    try {
      const response = await axios.get<{ name: string; description: string }[]>('/api/models');
      setModels(response.data);
      return true;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : 'Error al cargar los modelos';
      
      console.error('Error fetching models:', error);
      toast.error('Error al cargar modelos', {
        description: errorMessage,
      });
      return false;
    }
  }, []);

  const fetchPredict = useCallback(async () => {
    try {
      const response = await axios.get<Datapredictions[]>(
        `/api/predict?model_name=${selectedModel}&ticker=EUR/USD`
      );
      setPrediction(response.data);
      return true;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : 'Error al cargar las predicciones';
      
      console.error('Error fetching predictions:', error);
      toast.error('Error en predicciones', {
        description: errorMessage,
      });
      setPrediction([]);
      return false;
    }
  }, [selectedModel]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [dataResult, marketResult, modelsResult] = await Promise.all([
          fetchData(),
          fetchMarketData(),
          fetchModels(),
        ]);

        if (dataResult && marketResult && modelsResult) {
          // Solo cargar predicciones si los datos principales se cargaron correctamente
          await fetchPredict();
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchData, fetchMarketData, fetchModels, fetchPredict]);

  // Efecto para actualizar datos cuando cambia el período o rango
  useEffect(() => {
    const updateData = async () => {
      if (isLoading) return;
      setIsRefreshing(true);
      await fetchData();
      await fetchPredict();
      setIsRefreshing(false);
    };

    updateData();
  }, [period, dataRange, fetchData, fetchPredict, isLoading]);

  // Efecto para actualizar predicciones cuando cambia el modelo
  useEffect(() => {
    const updatePredictions = async () => {
      if (isLoading) return;
      setIsRefreshing(true);
      await fetchPredict();
      setIsRefreshing(false);
    };

    updatePredictions();
  }, [selectedModel, fetchPredict, isLoading]);

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

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const [dataResult, marketResult, modelsResult] = await Promise.all([
        fetchData(),
        fetchMarketData(),
        fetchModels(),
      ]);

      if (dataResult && marketResult && modelsResult) {
        await fetchPredict();
        toast.success('Datos actualizados correctamente', {
          description: `Última actualización: ${new Date().toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Componente de carga esqueleto para las tarjetas
  const CardSkeleton = () => (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );

  // Renderizar el indicador de carga
  if (isLoading && !isRefreshing) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
            title="Volver atrás"
            className="shrink-0"
            disabled={isRefreshing}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              EUR/USD Analysis
              {isRefreshing && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base">
              <Clock className="h-4 w-4" />
              {lastUpdated 
                ? `Última actualización: ${lastUpdated.toLocaleTimeString()}` 
                : 'Cargando datos...'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Link href="/eur-usd/indicators" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center gap-2"
              disabled={isRefreshing}
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Indicadores Técnicos</span>
              <span className="sm:hidden">Indicadores</span>
            </Button>
          </Link>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            className="gap-2 w-full sm:w-auto"
            variant="default"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Precio Actual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Actual</CardTitle>
            {isRefreshing ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <Badge variant={parseFloat(marketData.priceChangePercent) >= 0 ? 'default' : 'destructive'}>
                {parseFloat(marketData.priceChangePercent) >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {marketData.priceChangePercent}%
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                ${marketData.lastPrice || 'N/A'}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {isRefreshing ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                `$${marketData.priceChange || '0.00'}`
              )} (24h)
            </div>
          </CardContent>
        </Card>

        {/* Precio de Apertura */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio de Apertura</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${marketData.openPrice || 'N/A'}</div>
            )}
            <div className="text-sm text-muted-foreground">
              {isRefreshing ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                `$${(parseFloat(marketData.lastPrice) - parseFloat(marketData.openPrice)).toFixed(4)}`
              )} (vs. actual)
            </div>
          </CardContent>
        </Card>

        {/* Rango de Precios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rango 24h</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Máx:</span>
                  <span className="font-medium">${marketData.highPrice || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mín:</span>
                  <span className="font-medium">${marketData.lowPrice || 'N/A'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Volumen */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volumen 24h</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  $
                  <AnimatedNumber
                    value={marketData.volume ? parseFloat(marketData.volume) : 0}
                    formatValue={(val) => {
                      if (val >= 1000000) {
                        return `${(val / 1000000).toFixed(2)}M`;
                      }
                      if (val >= 1000) {
                        return `${(val / 1000).toFixed(2)}K`;
                      }
                      return val.toFixed(2);
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {marketData.quoteVolume && (
                    <>
                      ${(parseFloat(marketData.quoteVolume) / 1000000).toFixed(2)}M en valor
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Precio Promedio Ponderado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold">${marketData.weightedAvgPrice || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">
                  Ponderado por volumen
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Precio de Cierre Anterior */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cierre Anterior</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold">${marketData.prevClosePrice || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">
                  {marketData.prevClosePrice && (
                    <span className={parseFloat(marketData.lastPrice) >= parseFloat(marketData.prevClosePrice) ? 'text-green-500' : 'text-red-500'}>
                      {((parseFloat(marketData.lastPrice) / parseFloat(marketData.prevClosePrice) - 1) * 100).toFixed(2)}% vs actual
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas de Oferta/Demanda */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oferta/Demanda</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mejor oferta:</span>
                  <span className="font-medium">${marketData.bidPrice || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mejor demanda:</span>
                  <span className="font-medium">${marketData.askPrice || 'N/A'}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Spread: {marketData.bidPrice && marketData.askPrice ? 
                    (parseFloat(marketData.askPrice) - parseFloat(marketData.bidPrice)).toFixed(4) : 'N/A'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas de Tiempo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Operaciones:</span>{' '}
                  <span className="font-medium">{marketData.count?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Actualizado:</span>{' '}
                  <span className="font-medium">
                    {marketData.closeTime ? new Date(marketData.closeTime).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
              </div>
            )}
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
        <CardContent className="p-0 overflow-hidden">
          <div className="w-full">
            <TradingViewChart
              type={chartType}
              data={data}
              prediction={prediction}
              title={marketData.symbol}
              period={period}
              value="0"
              height={500} // Altura personalizable
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
