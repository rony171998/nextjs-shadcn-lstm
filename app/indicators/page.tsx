'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';

interface IndicatorData {
  date: string;
  value: number;
}

interface Indicators {
  [key: string]: IndicatorData[];
}

// Configuración de indicadores
const INDICATORS_CONFIG = {
  rsi: {
    title: 'RSI (Relative Strength Index)',
    color: '#8884d8',
    formatValue: (value: number) => `${value.toFixed(2)}`,
    yAxisDomain: [0, 100] as [number, number],
    description: 'Mide la velocidad y magnitud de los movimientos direccionales del precio'
  },
  sma: {
    title: 'SMA (Simple Moving Average)',
    color: '#82ca9d',
    formatValue: (value: number) => `$${value.toFixed(4)}`,
    yAxisDomain: undefined,
    description: 'Media móvil simple que suaviza el precio para identificar tendencias'
  },
  ema: {
    title: 'EMA (Exponential Moving Average)',
    color: '#ffc658',
    formatValue: (value: number) => `$${value.toFixed(4)}`,
    yAxisDomain: undefined,
    description: 'Media móvil exponencial que da más peso a los precios recientes'
  },
} as const;

type IndicatorType = keyof typeof INDICATORS_CONFIG;

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicators>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('daily');
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>('rsi');

  useEffect(() => {
    async function fetchIndicators() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/eur-usd/indicators?period=${period}`);
        setIndicators(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching indicators:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();
  }, [period]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    if (period === 'yearly') {
      return d.getFullYear().toString();
    } else if (period === 'monthly') {
      return d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    } else if (period === 'weekly') {
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } else {
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  const renderIndicatorCard = (type: IndicatorType, isLarge: boolean = false) => {
    const config = INDICATORS_CONFIG[type];
    
    return (
      <Card 
        className={`bg-gradient-to-br from-card to-card/80 cursor-pointer transition-all duration-300 ${
          isLarge ? 'col-span-2' : 'hover:scale-105'
        }`}
        onClick={() => setSelectedIndicator(type)}
      >
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          {isLarge && (
            <p className="text-sm text-muted-foreground mt-2">
              {config.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className={`${isLarge ? 'h-[400px]' : 'h-[200px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicators[type]}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  reversed={true}
                />
                <YAxis domain={config.yAxisDomain} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={config.color} 
                  dot={false}
                />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value: number) => [
                    config.formatValue(value),
                    type.toUpperCase()
                  ]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const availableIndicators = Object.keys(INDICATORS_CONFIG) as IndicatorType[];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Indicadores Técnicos EUR/USD</h1>
        
        <Tabs defaultValue="daily" className="mb-8" onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="daily">Diario</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
          </TabsList>

          <div className="grid gap-4 mt-8">
            {/* Gráfico grande seleccionado */}
            {renderIndicatorCard(selectedIndicator, true)}

            {/* Gráficos pequeños */}
            <div className="grid gap-4 md:grid-cols-2">
              {availableIndicators
                .filter(type => type !== selectedIndicator)
                .map(type => renderIndicatorCard(type))}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 