'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, BarChart2, AreaChart, CandlestickChart } from "lucide-react";
import type { Data } from "@/lib/db";
import type { Datapredictions } from "@/app/api/predict/route";
import { TradingViewChart } from './tradingview-chart';
import type { Model } from "@/app/api/models/route";

interface TradingViewWrapperProps {
  readonly klines: Data[];
  readonly predictionData: Datapredictions[];
  readonly symbol: string;
  readonly models: Model[];
  readonly height: number;
  readonly defaultPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly defaultModel?: string;
  readonly defaultChartType?: 'area' | 'line' | 'candlestick' | 'bar';
  readonly defaultDataRange?: number;
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface DataRange {
  value: number | null;
  label: string;
}

interface ChartType {
  value: 'area' | 'line' | 'candlestick' | 'bar';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function TradingViewWrapper({
  klines,
  predictionData,
  symbol,
  models,
  height = 500,
  defaultPeriod = 'daily',
  defaultModel = 'TLS_LSTMModel',
  defaultChartType = 'area',
  defaultDataRange = 30
}: TradingViewWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [chartType, setChartType] = useState<'area' | 'line' | 'candlestick' | 'bar'>(defaultChartType);
  const [period, setPeriod] = useState<Timeframe>(defaultPeriod);
  const [dataRange, setDataRange] = useState<number | null>(defaultDataRange);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  // Actualizar los estados cuando cambien las props
  useEffect(() => {
    if (defaultPeriod) {
      setPeriod(defaultPeriod);
    }
    if (defaultModel) {
      setSelectedModel(defaultModel);
    }
  }, [defaultPeriod, defaultModel]);

  const timeframes: Timeframe[] = ['daily', 'weekly', 'monthly', 'yearly'];

  const dataRanges: DataRange[] = [
    { value: 30, label: '1 mes' },
    { value: 90, label: '3 meses' },
    { value: 180, label: '6 meses' },
    { value: 365, label: '1 año' },
    { value: 1825, label: '5 años' },
    { value: null, label: 'Todos los datos' }
  ];

  const chartTypes: ChartType[] = [
    { value: 'candlestick', label: 'Candlestick', icon: CandlestickChart },
    { value: 'line', label: 'Línea', icon: LineChart },
    { value: 'bar', label: 'Barras', icon: BarChart2 },
    { value: 'area', label: 'Área', icon: AreaChart }
  ];

  // Función para actualizar la URL con los nuevos parámetros
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleChartTypeChange = (value: string) => {
    if (['area', 'line', 'candlestick', 'bar'].includes(value)) {
      setChartType(value as 'area' | 'line' | 'candlestick' | 'bar');
      updateUrlParams({ chartType: value });
    }
  };

  const handlePeriodChange = (value: string) => {
    const periodValue = value as Timeframe;
    setPeriod(periodValue);
    updateUrlParams({ period: value });
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    updateUrlParams({ model: value });
  };

  const handleDataRangeChange = (value: string) => {
    const rangeValue = value === 'null' ? null : parseInt(value);
    setDataRange(rangeValue);
    updateUrlParams({ range: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gráfico de Precio {symbol.replace('-', '/')}</CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Gráfico" />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={dataRange === null ? 'null' : dataRange.toString()}
            onValueChange={handleDataRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rango de datos" />
            </SelectTrigger>
            <SelectContent>
              {dataRanges.map((range) => (
                <SelectItem
                  key={range.value === null ? 'null' : range.value.toString()}
                  value={range.value === null ? 'null' : range.value.toString()}
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {models.length > 0 && (
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Modelo de Predicción" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.model_name} value={model.model_name}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="w-full">
          <TradingViewChart
            type={chartType as 'area' | 'line' | 'candlestick' | 'bar'}
            data={klines}
            prediction={predictionData}
            title={symbol}
            period={period}
            value="0"
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  );
}