import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuración de axios para la API de Binance
const binanceApi: AxiosInstance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globalmente
binanceApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Si el error es 429 (Too Many Requests) y no hemos reintentado aún
    if (error.response?.status === 429 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reintentar la petición
      return binanceApi(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export interface BinanceTicker {
  symbol: string;
  price: string;
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

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

export async function getTickerPrice(symbol: string, retries = 3): Promise<BinanceTicker | null> {
  try {
    const response = await binanceApi.get<BinanceTicker>(`/ticker/24hr?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error al obtener ticker para ${symbol}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
        },
      });
      
      // Si es un error de rate limit y aún tenemos reintentos disponibles
      if (error.response?.status === 429 && retries > 0) {
        console.warn(`Rate limit alcanzado para ${symbol}, reintentando... (${retries} intentos restantes)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        return getTickerPrice(symbol, retries - 1);
      }
    } else {
      console.error(`Error inesperado al obtener ticker para ${symbol}:`, error);
    }
    return null;
  }
}

export async function getKlines(
  symbol: string, 
  interval: string, 
  limit: number = 500,
  retries = 3
): Promise<BinanceKline[]> {
  try {
    const response = await binanceApi.get<any[][]>(
      `/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    return response.data.map((kline: any[]) => ({
      openTime: kline[0],
      open: kline[1],
      high: kline[2],
      low: kline[3],
      close: kline[4],
      volume: kline[5],
      closeTime: kline[6],
      quoteAssetVolume: kline[7],
      numberOfTrades: kline[8],
      takerBuyBaseAssetVolume: kline[9],
      takerBuyQuoteAssetVolume: kline[10],
      ignore: kline[11]
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429 && retries > 0) {
      console.warn(`Rate limit alcanzado para klines de ${symbol}, reintentando... (${retries} intentos restantes)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
      return getKlines(symbol, interval, limit, retries - 1);
    }
    console.error(`Error al obtener klines para ${symbol}:`, error);
    return [];
  }
}

export async function getExchangeInfo(retries = 3) {
  try {
    const response = await binanceApi.get('/exchangeInfo');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429 && retries > 0) {
      console.warn('Rate limit alcanzado para exchangeInfo, reintentando...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
      return getExchangeInfo(retries - 1);
    }
    console.error('Error al obtener la información del exchange:', error);
    throw error; // Relanzar el error para que el llamador pueda manejarlo
  }
}
