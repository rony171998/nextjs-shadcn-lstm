'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Data } from '@/lib/db';
import { StatsChartTab } from '@/components/ui/stats-chart-tab';
import { Datapredictions } from '@/app/api/predict/route';

export default function Home() {
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

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">EUR/USD Analysis</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded-md bg-background border"
            />
            <div>
              <select
                className="px-2 py-1 rounded-md border mr-2"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
              >
                {models.map(model => (
                  <option key={model.name} value={model.name}>
                    {model.description}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPredict}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar Predicciones'}
            </Button>
            <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              +
            </button>
          </div>
        </div>

        <Tabs defaultValue="daily" className="mb-8" onValueChange={setPeriod}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <div className="flex gap-4">
              <button className="text-sm text-muted-foreground">Current Period</button>
              <button className="text-sm text-muted-foreground">Previous Period</button>
            </div>
          </div>

          <TabsContent value="daily">
            <StatsChartTab 
              value="daily" 
              title="EUR/USD Daily Chart" 
              data={data} 
              period={period}
              prediction={prediction}
            />
          </TabsContent>

          <TabsContent value="weekly">
            <StatsChartTab 
              value="weekly" 
              title="EUR/USD Weekly Chart" 
              data={data} 
              period={period}
              prediction={prediction}
            />
          </TabsContent>

          <TabsContent value="monthly">
            <StatsChartTab 
              value="monthly" 
              title="EUR/USD Monthly Chart" 
              data={data} 
              period={period}
              prediction={prediction}
            />
          </TabsContent>

          <TabsContent value="yearly">
            <StatsChartTab 
              value="yearly" 
              title="EUR/USD Yearly Chart" 
              data={data} 
              period={period}
              prediction={prediction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}