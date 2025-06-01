import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Data } from "@/lib/db";
import axios from "axios";
import { TradingViewWrapper } from "@/components/ui/TradingViewWrapper";
import type { Datapredictions } from "@/app/api/predict/route";
import type { Model } from "@/app/api/models/route";
import { ArrowUp, ArrowDown, Coins, BarChart4, TrendingUp, TrendingDown, Clock, DollarSign, BarChart2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

interface PageProps {
    params: { slug: string };
    searchParams: {
        period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
        model?: string;
        chartType?: string;
        range?: string;
    };
}

export default async function Page({ params, searchParams }: PageProps) {
    const symbol = params.slug.toUpperCase();
    const period = searchParams.period ?? 'daily';
    const modelName = searchParams.model ?? 'TLS_LSTMModel';
    const range = searchParams.range ? parseInt(searchParams.range) : 30;
    const chartType = searchParams.chartType ?? 'line';

    // Construct the base URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:' + process.env.PORT);

    // Fetch klines data from the API using Axios
    let klines: Data[] = [];
    let prediction: Datapredictions[] = [];
    let models: Model[] = [];
    try {
        const response = await axios.get<Data[]>(
            `${baseUrl}/api/eur-usd`,
            {
                params: {
                    period: period,
                    limit: range,
                    tableName: symbol.replace('-', '_')
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }
        );

        klines = response.data;

        const modelsResponse = await axios.get<Model[]>(
            `${baseUrl}/api/models`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }
        );

        models = modelsResponse.data;

        const predictionResponse = await axios.get<Datapredictions[]>(
            `${baseUrl}/api/predict`,
            {
                params: {
                    ticker: symbol.replace('-', '/'),
                    model_name: modelName
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }
        );

        prediction = predictionResponse.data;

        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                const errorData = axiosError.response.data as { error?: string };
                const errorMessage = errorData?.error ||
                    `Error del servidor: ${axiosError.response.status} ${axiosError.response.statusText}`;
                throw new Error(`Error al obtener datos: ${errorMessage}`);
            } else if (axiosError.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
            } else {
                // Algo sucedió en la configuración de la solicitud
                throw new Error(`Error en la configuración de la solicitud: ${axiosError.message}`);
            }
        } else if (error instanceof Error) {
            // Error genérico
            throw new Error(`Error desconocido: ${error.message}`);
        } else {
            throw new Error('Ocurrió un error inesperado al obtener los datos');
        }
    }

    // Get the latest price data
    const latestPrice = klines.length > 0 ? klines[klines.length - 1].close : 0;
    const previousClose = klines.length > 1 ? klines[klines.length - 2].close : latestPrice;
    const priceChange = latestPrice - previousClose;
    const priceChangePercent = (priceChange / previousClose) * 100;

    // Calculate 24h high and low
    const high24h = klines.length > 0 ? Math.max(...klines.map(d => d.high)) : 0;
    const low24h = klines.length > 0 ? Math.min(...klines.map(d => d.low)) : 0;

    // Calculate volume
    const volume24h = klines.length > 0 ? klines.reduce((sum: number, d: Data) => sum + (d as any).volume || 0, 0) : 0;

    // Format the last update time
    const lastUpdateTime = klines.length > 0 ? formatDate(klines[0].date) : 'N/A';

    return (
        <div className="mx-auto p-4 space-y-8">
            {/* Header with gradient background */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-sm">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/50"></div>
                <div className="relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <BackButton />
                            <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center">
                                {symbol.replace('-', '/')}
                                <Badge variant="outline" className="ml-2 text-xs font-normal">
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </Badge>
                            </h1>
                            <div className="flex items-center gap-3">
                                <p className="text-muted-foreground">
                                    Última actualización: {lastUpdateTime}
                                </p>
                                <Link href={`/dashboard/${params.slug}/indicators`} className="">
                                    <Button
                                        variant="outline"
                                        className="h-8 justify-center gap-2"
                                        size="sm"
                                    >
                                        <BarChart2 className="h-4 w-4" />
                                        <span className="hidden sm:inline">Indicadores Técnicos</span>
                                        <span className="sm:hidden">Indicadores</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-bold">
                                {latestPrice.toFixed(5)}
                            </div>
                            <span className={`flex items-center text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {priceChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                                {priceChange.toFixed(5)} ({priceChangePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid with improved visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current Price */}
                <Card className="overflow-hidden border-t-4 border-blue-500 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                            Precio Actual
                        </CardTitle>
                        <span className={`flex items-center text-xs font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {priceChangePercent.toFixed(2)}%
                        </span>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{latestPrice.toFixed(5)}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Actualizado: {lastUpdateTime.split(',')[1]}
                        </div>
                    </CardContent>
                </Card>

                {/* 24h High */}
                <Card className="overflow-hidden border-t-4 border-green-500 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50/50 dark:bg-green-950/20">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                            Máximo (24h)
                        </CardTitle>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-500">
                            {high24h.toFixed(5)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Máximo de las últimas 24h
                        </div>
                    </CardContent>
                </Card>

                {/* 24h Low */}
                <Card className="overflow-hidden border-t-4 border-red-500 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50/50 dark:bg-red-950/20">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                            Mínimo (24h)
                        </CardTitle>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-red-500">
                            {low24h.toFixed(5)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Mínimo de las últimas 24h
                        </div>
                    </CardContent>
                </Card>

                {/* 24h Volume */}
                <Card className="overflow-hidden border-t-4 border-purple-500 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50/50 dark:bg-purple-950/20">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <BarChart4 className="h-4 w-4 mr-1 text-purple-500" />
                            Volumen (24h)
                        </CardTitle>
                        <Coins className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                            {volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Volumen total en 24h
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Card with improved styling */}
            <Card className="overflow-hidden shadow-lg border-none">
                <CardContent className="p-0">
                    <TradingViewWrapper
                        klines={klines}
                        predictionData={prediction}
                        symbol={symbol}
                        models={models}
                        height={700}
                        defaultPeriod={period}
                        defaultModel={modelName}
                        defaultChartType={chartType as 'area' | 'line' | 'candlestick' | 'bar'}
                        defaultDataRange={range}
                    />
                </CardContent>
            </Card>
        </div>
    );
}