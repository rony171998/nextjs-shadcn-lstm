import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

type AxiosError = {
  response?: {
    status: number;
    statusText: string;
    data: {
      message?: string;
    };
  };
  request?: any;
  message: string;
};

function isAxiosError(error: any): error is AxiosError {
  return error && (error.response || error.request || error.message);
}

// Utility functions
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'TRADING':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Trading</Badge>;
    case 'BREAK':
      return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Break</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// This is a Server Component that fetches data on the server
// It will be automatically streamed to the client

type RateLimit = {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
};

type SymbolInfo = {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  orderTypes: string[];
  filters: any[];
};

type ExchangeInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: RateLimit[];
  symbols: SymbolInfo[];
};

async function getExchangeInfo(): Promise<ExchangeInfo> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:'+process.env.PORT;
    const response = await axios.get(`${baseUrl}/api/exchange-info`, {
      // Axios doesn't support next.revalidate directly, but we can use headers
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch exchange info');
    }
    
    return response.data.data;
  } catch (error) {
    let errorMessage = 'Failed to fetch exchange info';
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      // Handle Axios specific errors
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData?.message || 
                     `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from the server';
      } else {
        // Something happened in setting up the request
        errorMessage = axiosError.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}

export default async function ExchangeInfoPage() {
  let data: ExchangeInfo;
  
  try {
    data = await getExchangeInfo();
  } catch (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load exchange information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Binance Exchange Information</h1>
        <p className="text-muted-foreground">
          Last updated: {formatDate(data.serverTime)}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rateLimits">Rate Limits</TabsTrigger>
          <TabsTrigger value="markets">Markets ({data.symbols.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Status</CardTitle>
              <CardDescription>Current status of the Binance exchange</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Server Time</h3>
                  <p className="text-lg font-semibold">{formatDate(data.serverTime)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Timezone</h3>
                  <p className="text-lg font-semibold">{data.timezone}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Markets</h3>
                  <p className="text-lg font-semibold">{data.symbols.length}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Trading Pairs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.symbols.slice(0, 6).map((symbol) => (
                    <Card key={symbol.symbol}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{symbol.symbol}</h4>
                            <p className="text-sm text-muted-foreground">
                              {symbol.baseAsset} / {symbol.quoteAsset}
                            </p>
                          </div>
                          {getStatusBadge(symbol.status)}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rateLimits">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>Current rate limits for the Binance API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Interval</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.rateLimits.map((limit, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{limit.rateLimitType}</td>
                        <td className="px-4 py-2">
                          Every {limit.intervalNum} {limit.interval.toLowerCase()}
                        </td>
                        <td className="px-4 py-2 font-mono">{limit.limit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Markets</CardTitle>
                  <CardDescription>Available trading pairs on Binance</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(50, data.symbols.length)} of {data.symbols.length} pairs
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Base/Quote</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Spot</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.symbols.slice(0, 50).map((symbol) => (
                      <tr key={symbol.symbol} className="hover:bg-muted/50">
                        <td className="px-4 py-2 font-medium">{symbol.symbol}</td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {symbol.baseAsset} / {symbol.quoteAsset}
                        </td>
                        <td className="px-4 py-2">{getStatusBadge(symbol.status)}</td>
                        <td className="px-4 py-2">
                          {symbol.isSpotTradingAllowed ? (
                            <Badge variant="outline">Enabled</Badge>
                          ) : (
                            <Badge variant="outline" className="opacity-50">Disabled</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {symbol.isMarginTradingAllowed ? (
                            <Badge variant="outline">Enabled</Badge>
                          ) : (
                            <Badge variant="outline" className="opacity-50">Disabled</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
