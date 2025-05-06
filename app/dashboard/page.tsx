'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, TrendingUp, Star, Clock, ArrowRight, BarChart2, Settings, Bell, Plus, Filter, ChevronDown, Newspaper, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('all');

  useEffect(() => {
    // Simulación de datos - En producción esto vendría de una API
    const mockAssets: Asset[] = [
        {
          id: '1',
          name: 'Euro / US Dollar',
          symbol: 'EUR/USD',
          category: 'Forex',
          lastPrice: 1.1329,
          change24h: 0.28,
          volume24h: 1_200_000_000,
          isFavorite: true,
          marketCap: 2_000_000_000_000,
          volatility: 0.8,
          trend: 'up',
          alerts: 2
        },
        {
          id: '2',
          name: 'British Pound / US Dollar',
          symbol: 'GBP/USD',
          category: 'Forex',
          lastPrice: 1.3282,
          change24h: -0.06,
          volume24h: 800_000_000,
          isFavorite: false,
          marketCap: 1_500_000_000_000,
          volatility: 0.6,
          trend: 'down',
          alerts: 1
        },
        {
          id: '3',
          name: 'US Dollar / Japanese Yen',
          symbol: 'USD/JPY',
          category: 'Forex',
          lastPrice: 144.92,
          change24h: -0.31,
          volume24h: 900_000_000,
          isFavorite: false,
          marketCap: 1_800_000_000_000,
          volatility: 0.7,
          trend: 'down',
          alerts: 0
        },
        {
          id: '4',
          name: 'Gold',
          symbol: 'XAU/USD',
          category: 'Commodities',
          lastPrice: 3_254.42,
          change24h: 0.64,
          volume24h: 500_000_000,
          isFavorite: true,
          marketCap: 12_000_000_000_000,
          volatility: 1.2,
          trend: 'up',
          alerts: 3
        },
        {
          id: '5',
          name: 'Bitcoin',
          symbol: 'BTC/USD',
          category: 'Crypto',
          lastPrice: 95_233.00,
          change24h: -0.016,
          volume24h: 15_850_000_000,
          isFavorite: true,
          marketCap: 1_880_000_000_000,
          volatility: 2.5,
          trend: 'down',
          alerts: 5
        }
      ];      

    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
    setIsLoading(false);
  }, []);

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

    if (showAlerts) {
      filtered = filtered.filter(asset => asset.alerts && asset.alerts > 0);
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
  }, [searchQuery, selectedCategory, assets, sortBy, showAlerts]);

  useEffect(() => {
    // Simulación de datos de noticias
    const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'EUR/USD alcanza máximo de 3 años tras especulaciones sobre recortes del BCE',
          description: 'El euro se fortaleció frente al dólar estadounidense, alcanzando su nivel más alto en tres años, impulsado por la especulación de que el Banco Central Europeo podría recortar las tasas de interés debido a las tensiones comerciales y una perspectiva económica incierta.',
          source: 'Reuters',
          date: '2025-04-20',
          category: 'Forex',
          sentiment: 'positive',
          url: 'https://www.reuters.com/markets/currencies/euro-gets-lift-german-debt-brake-reform-currencies-mired-trade-war-fallout-2025-03-05/'
        },
        {
          id: '2',
          title: 'Bitcoin supera los $97,000 impulsado por la demanda institucional',
          description: 'Bitcoin ha alcanzado un nuevo máximo de $97,000, respaldado por un aumento en la demanda institucional y la adopción de ETF de Bitcoin, consolidando su posición como una inversión principal.',
          source: 'Yahoo Finance',
          date: '2025-05-02',
          category: 'Crypto',
          sentiment: 'positive',
          url: 'https://finance.yahoo.com/news/bitcoin-tops-97k-institutional-demand-000000440.html'
        },
        {
          id: '3',
          title: 'Precios del oro se estabilizan tras alcanzar récords históricos',
          description: 'Después de alcanzar un récord de $3,500 por onza en abril, los precios del oro se han corregido a $3,250, estabilizándose mientras los inversores evalúan las condiciones macroeconómicas y las señales de sobrevaloración.',
          source: 'The Economic Times',
          date: '2025-05-04',
          category: 'Commodities',
          sentiment: 'neutral',
          url: 'https://m.economictimes.com/news/international/us/gold-rate-predictions-has-the-bull-cycle-ended-heres-what-market-indicators-hint-at-amid-shifting-global-trends/articleshow/120876068.cms'
        },
        {
          id: '4',
          title: 'USD/JPY se debilita tras revisión a la baja de las previsiones del BOJ',
          description: 'El yen japonés se debilitó frente al dólar estadounidense después de que el Banco de Japón revisara a la baja sus previsiones de crecimiento e inflación, manteniendo las tasas de interés sin cambios y generando incertidumbre en los mercados.',
          source: 'Reuters',
          date: '2025-05-01',
          category: 'Forex',
          sentiment: 'negative',
          url: 'https://www.reuters.com/business/view-yen-slides-with-jgb-yields-after-boj-cuts-growth-forecasts-2025-05-01/'
        }
      ];
      

    setNews(mockNews);
  }, []);

  const categories = ['all', 'Forex', 'Crypto', 'Commodities', 'Stocks'];

  const toggleFavorite = (id: string) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, isFavorite: !asset.isFavorite } : asset
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Market Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze your favorite assets</p>
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
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {isLoading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
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
                        className={`h-5 w-5 ${
                          asset.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">${asset.lastPrice.toFixed(2)}</p>
                        <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">24h Volume</p>
                        <p className="text-sm font-medium">${(asset.volume24h / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="text-sm font-medium">${((asset.marketCap || 0) / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volatility</p>
                        <p className="text-sm font-medium">{asset.volatility?.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Real-time</span>
                      </div>
                      <div className="flex gap-2">
                        {asset.symbol === 'EUR/USD' ? (
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
                    className={`${
                      item.sentiment === 'positive' ? 'bg-green-500 text-white' :
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