'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { Data } from '@/lib/db';
import { StatsChartTab } from '@/components/ui/stats-chart-tab';

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    async function fetchData() {
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
      }
    }

    fetchData();
  }, [period]);

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">EUR/USD Analysis</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded-md bg-background border"
            />
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
            />
          </TabsContent>

          <TabsContent value="weekly">
            <StatsChartTab 
              value="weekly" 
              title="EUR/USD Weekly Chart" 
              data={data} 
              period={period} 
            />
          </TabsContent>

          <TabsContent value="monthly">
            <StatsChartTab 
              value="monthly" 
              title="EUR/USD Monthly Chart" 
              data={data} 
              period={period} 
            />
          </TabsContent>

          <TabsContent value="yearly">
            <StatsChartTab 
              value="yearly" 
              title="EUR/USD Yearly Chart" 
              data={data} 
              period={period} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}