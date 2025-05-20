'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, Bell, ArrowRight, Settings, BarChart2, Filter, Clock, Newspaper, ExternalLink, DollarSign, Bitcoin, BarChart, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedNumber } from '@/components/ui/animated-number';
import { getTickerPrice } from '@/lib/binance';
import { toast } from "sonner";
import axios from 'axios';

export interface AssetBinance {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
  isFavorite: boolean;
  marketCap?: number;
  volatility?: number;
  trend?: 'up' | 'down' | 'neutral';
  alerts?: number;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Forex');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    const cacheKey = 'market-data-cache';
    const cacheExpiry = 60 * 1000; // 60 segundos de caché
    const now = Date.now();
    
    try {
      // Verificar si tenemos datos en caché y si aún son válidos
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          if (now - timestamp < cacheExpiry && Array.isArray(data) && data.length > 0) {
            console.log('Usando datos de caché');
            setAssets(data);
            setFilteredAssets(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error al leer caché:', e);
          localStorage.removeItem(cacheKey);
        }
      }
      
      // Si no hay caché válida, hacer petición a la API
      console.log('Obteniendo datos del servidor...');
      const response = await axios.get<Asset[]>('/api/dashboard/market-data', {
        timeout: 8000, // 8 segundos de timeout
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const assetsData = response.data;
      
      if (!assetsData || !Array.isArray(assetsData) || assetsData.length === 0) {
        throw new Error('No se recibieron datos válidos del mercado');
      }
      
      // Actualizar estado
      setAssets(assetsData);
      setFilteredAssets(assetsData);
      
      // Guardar en caché
      localStorage.setItem(cacheKey, JSON.stringify({
        data: assetsData,
        timestamp: now
      }));
      
      console.log(`Datos cargados (${assetsData.length} activos):`, assetsData);
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      
      // Intentar usar datos en caché incluso si están vencidos
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const { data } = JSON.parse(cachedData);
          if (Array.isArray(data) && data.length > 0) {
            setAssets(data);
            setFilteredAssets(data);
            toast.warning('Datos en caché', {
              description: 'Se están mostrando datos en caché debido a un error en la conexión.',
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error al leer caché de respaldo:', e);
        }
      }
      
      // Si no hay caché o está corrupta, intentar obtener datos directamente de Binance
      try {
        console.log('Intentando obtener datos directamente de Binance...');
        const symbols = ['EURUSDT', 'BTCUSDT'];
        const fallbackData: Asset[] = [];
        
        for (const symbol of symbols) {
          try {
            const ticker = await getTickerPrice(symbol);
            if (ticker) {
              const category = symbol.includes('BTC') ? 'Crypto' : 'Forex';
              const name = symbol.includes('BTC') ? 'Bitcoin' : 'Euro / US Dollar';
              
              fallbackData.push({
                id: symbol,
                name,
                symbol,
                category,
                lastPrice: parseFloat(ticker.lastPrice),
                change24h: parseFloat(ticker.priceChangePercent),
                volume24h: parseFloat(ticker.quoteVolume),
                isFavorite: false,
                marketCap: 0,
                volatility: 0,
                trend: parseFloat(ticker.priceChangePercent) >= 0 ? 'up' : 'down',
                alerts: 0
              });
            }
          } catch (e) {
            console.warn(`Error obteniendo datos de Binance para ${symbol}:`, e);
          }
        }
        
        if (fallbackData.length > 0) {
          setAssets(fallbackData);
          setFilteredAssets(fallbackData);
          toast.warning('Modo de respaldo', {
            description: 'Usando datos directamente de Binance debido a problemas con la API.',
          });
          setIsLoading(false);
          return;
        }
      } catch (fallbackError) {
        console.error('Error en modo de respaldo:', fallbackError);
      }
      
      // Si todo falla, mostrar error
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos del mercado';
      toast.error('Error de mercado', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para la carga inicial y actualizaciones periódicas
  useEffect(() => {
    // Función para verificar la conexión
    const checkConnection = async () => {
      try {
        await axios.head('/api/health-check', { timeout: 3000 });
        return true;
      } catch (error) {
        console.warn('Error de conexión:', error);
        return false;
      }
    };

    // Función para cargar datos iniciales
    const loadInitialData = async () => {
      try {
        await fetchMarketData();
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };
    
    // Cargar datos iniciales
    loadInitialData();

    // Configurar actualización periódica (cada 60 segundos)
    const intervalId = setInterval(async () => {
      const isOnline = await checkConnection();
      if (isOnline) {
        fetchMarketData();
      }
    }, 60000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [fetchMarketData]);

  useEffect(() => {
    let filtered = assets;

    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume24h - a.volume24h;
        case 'change':
          return b.change24h - a.change24h;
        case 'price':
          return b.lastPrice - a.lastPrice;
        case 'marketCap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        default:
          return 0;
      }
    });

    setFilteredAssets(filtered);
  }, [searchQuery, selectedCategory, assets, sortBy]);

  // Función para cargar noticias
  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/news');
      
      if (!response.ok) {
        throw new Error('Error al cargar las noticias');
      }
      
      const newsData = await response.json();
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, []);

  // Cargar noticias al montar el componente
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const toggleFavorite = (id: string) => {
    setAssets(assets.map(asset =>
      asset.id === id ? { ...asset, isFavorite: !asset.isFavorite } : asset
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
              onClick={() => router.back()}
              title="Volver atrás"
            >
              ←
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Market Dashboard</h1>
              <p className="text-muted-foreground">Monitor and analyze your favorite assets</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Market Assets</h2>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="change">24h Change</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            onClick={() => setSelectedCategory('all')}
            className="capitalize flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            All
          </Button>

          <Button
            variant={selectedCategory === 'Forex' ? "default" : "outline"}
            onClick={() => setSelectedCategory('Forex')}
            className="capitalize flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Forex
          </Button>

          <Button
            variant={selectedCategory === 'Crypto' ? "default" : "outline"}
            onClick={() => setSelectedCategory('Crypto')}
            className="capitalize flex items-center gap-2"
          >
            <Bitcoin className="h-4 w-4" />
            Crypto
          </Button>

          <Button
            variant={selectedCategory === 'Commodities' ? "default" : "outline"}
            onClick={() => setSelectedCategory('Commodities')}
            className="capitalize flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Commodities
          </Button>

          <Button
            variant={selectedCategory === 'Stocks' ? "default" : "outline"}
            onClick={() => setSelectedCategory('Stocks')}
            className="capitalize flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Stocks
          </Button>
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {isLoading ? (
            // Skeleton loaders
            Array(6).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex justify-between pt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredAssets.length === 0 ? (
            <div className="col-span-full text-center py-12">No assets found</div>
          ) : (
            filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      {asset.symbol}
                      {asset.trend === 'up' && (
                        <Badge variant="secondary" className="text-xs bg-green-500 text-white">Bullish</Badge>
                      )}
                      {asset.trend === 'down' && (
                        <Badge variant="destructive" className="text-xs">Bearish</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{asset.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {asset.alerts && asset.alerts > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {asset.alerts} alerts
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(asset.id)}
                    >
                      <Star
                        className={`h-5 w-5 ${asset.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">$
                          <AnimatedNumber
                            value={asset.lastPrice ? parseFloat(asset.lastPrice.toFixed(4)) : 0}
                            formatValue={(val) => val.toFixed(4)}
                          />
                        </p>
                        <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">24h Volume</p>
                        <p className="text-sm font-medium">$
                          <AnimatedNumber
                            value={asset.volume24h ? parseFloat((asset.volume24h / 1000000).toFixed(4)) : 0}
                            formatValue={(val) => val.toFixed(4)}
                          />
                          M</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="text-sm font-medium">$
                          <AnimatedNumber
                            value={asset.marketCap ? parseFloat((asset.marketCap / 1000000).toFixed(4)) : 0}
                            formatValue={(val) => val.toFixed(4)}
                          />
                          M</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volatility</p>
                        <p className="text-sm font-medium">
                          <AnimatedNumber
                            value={asset.volatility ? parseFloat(asset.volatility.toFixed(4)) : 0}
                            formatValue={(val) => val.toFixed(4)}
                          />
                          %</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Real-time</span>
                      </div>
                      <div className="flex gap-2">
                        {asset.symbol === 'EURUSDT' ? (
                          <Link href={`/eur-usd/analysis`}>
                            <Button variant="default" size="sm" className="flex items-center gap-2">
                              Analyze
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
                            Coming Soon
                            <Clock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Market News</h2>
          <Button variant="outline" size="sm">
            View All News
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {item.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.source}</span>
                  </div>
                  <Badge
                    variant={item.sentiment === 'positive' ? 'secondary' : item.sentiment === 'negative' ? 'destructive' : 'outline'}
                    className={`${item.sentiment === 'positive' ? 'bg-green-500 text-white' :
                      item.sentiment === 'negative' ? 'bg-red-500 text-white' : ''
                      }`}
                  >
                    {item.sentiment}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    Read More
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 