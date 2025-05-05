import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, TooltipProps } from "recharts"
import { Data } from "@/lib/db"
import { Datapredictions } from "@/app/api/predict/route"

interface StatsChartTabProps {
  readonly value: string
  readonly title: string
  readonly data: Data[]
  readonly period: string
  readonly prediction: Datapredictions[]
}

export function StatsChartTab({ value, title, data, period, prediction }: Readonly<StatsChartTabProps>) {
  const calculateStats = (data: Data[], period: string) => {
    if (!data || data.length < 2) return { change: '0.00', avgPrice: 'N/A', volume: 'N/A' };

    const current = data[0];
    const previous = data[1];

    const change = ((current.close - previous.close) / previous.close * 100).toFixed(2);
    return {
      change,
      avgPrice: current.avg_price.toFixed(4),
      volume: 'N/A'
    };
  };

  const calculateDomain = (data: Data[]) => {
    if (!data || data.length === 0) return [1.00, 1.40];

    const values = data.map(d => d.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;

    return [
      Math.max(0.95, min - padding),
      Math.min(1.50, max + padding)
    ];
  };

  const stats = [
    {
      title: 'EUR/USD Change',
      value: calculateStats(data, period).change,
      change: calculateStats(data, period).change,
      previousValue: period === 'weekly' ? 'vs. previous week' : period === 'monthly' ? 'vs. previous month' : 'vs. previous day'
    },
    {
      title: 'Average Price',
      value: calculateStats(data, period).avgPrice,
      change: calculateStats(data, period).change,
      previousValue: period === 'weekly' ? 'weekly average' : period === 'monthly' ? 'monthly average' : 'current price'
    },
    {
      title: 'Trading Volume',
      value: calculateStats(data, period).volume,
      change: '0%',
      previousValue: period === 'weekly' ? 'weekly volume' : period === 'monthly' ? 'monthly volume' : 'daily volume'
    }
  ];

  const chartData = [
    ...data.map(item => ({
      date: new Date(item.date).toISOString().split('T')[0],
      value: item.close,
      type: 'historical'
    })),
    ...prediction.map(item => ({
      date: new Date(item.fecha).toISOString().split('T')[0],
      prediction: item.último,
      type: 'prediction'
    })),
  ];
  
  // Ordenar por fecha ascendente
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} role="region" aria-label={`${stat.title} statistics`} className="bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground" aria-label={`Current value: ${stat.value}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1" aria-label={`Comparison: ${stat.previousValue}`}>
                {stat.previousValue}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card role="region" aria-label={`${title} chart`} className="bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} role="figure" aria-label={`Line chart showing ${title} data`}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                  tickFormatter={(date) => {
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
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  domain={calculateDomain(data)}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  name="Histórico"
                />
                <Line
                  dataKey="prediction"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  name="Predicción"
                />
                <Legend />

                <Tooltip<number, "Predicción" | "Valor">
                  content={({ active, payload, label }: TooltipProps<number, "Predicción" | "Valor">) => {
                    if (active && payload && payload.length) {
                      const value = payload[0]?.value;
                      const formattedValue = typeof value === 'number' ? value.toFixed(4) : 'N/A';
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm" role="tooltip" aria-label={`Data point details: ${label}, Price: $${formattedValue}`}>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {period === 'weekly' ? 'Week' : period === 'monthly' ? 'Month' : 'Date'}
                              </span>
                              <span className="font-bold text-muted-foreground">{label}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Price
                              </span>
                              <span className="font-bold">
                                ${formattedValue}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number, name: "Predicción" | "Valor", props: any) => [
                    value.toFixed(4),
                    props.payload.type === 'prediction' ? 'Predicción' : 'Valor'
                  ]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 