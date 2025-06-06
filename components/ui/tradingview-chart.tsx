'use client'

import { createChart, ColorType, IChartApi, Time, CandlestickSeries, LineSeries, BarSeries, AreaSeries } from "lightweight-charts"
import { Data } from "@/lib/db"
import { Datapredictions } from "@/app/api/predict/route"
import { useEffect, useRef } from "react"

interface TradingViewChartProps {
  readonly data: Data[]
  readonly period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  readonly prediction: Datapredictions[]
  readonly type: string
  readonly height?: number
}

export function TradingViewChart({ 
  data, 
  period, 
  prediction, 
  type, 
  height = 450 
}: Readonly<TradingViewChartProps>) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Función para actualizar el tamaño del gráfico
  const updateChartSize = (chart: IChartApi) => {
    if (!chartContainerRef.current) return;
    
    const width = chartContainerRef.current.clientWidth;
    const height = chartContainerRef.current.clientHeight;
    
    chart.applyOptions({ 
      width,
      height,
    });
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear el gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#888888',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          switch (period) {
            case 'daily':
              return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            case 'weekly':
              return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            case 'monthly':
              return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            case 'yearly':
              return date.getFullYear().toString();
            default:
              return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
          }
        },
      },
    });

    // Crear la serie de datos históricos según el tipo
    let historicalSeries;
    switch (type) {
      case 'candlestick':
        historicalSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
        break;
      case 'line':
        historicalSeries = chart.addSeries(LineSeries, {
          color: '#2962FF',
          lineWidth: 2,
        });
        break;
      case 'bar':
        historicalSeries = chart.addSeries(BarSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
        });
        break;
      case 'area':
        historicalSeries = chart.addSeries(AreaSeries, {
          lineColor: '#2962FF',
          topColor: '#2962FF',
          bottomColor: 'rgba(41, 98, 255, 0.28)',
        });
        break;
      default:
        historicalSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
    }

    // Crear la serie de predicciones según el tipo
    let predictionSeries;
    switch (type) {
      case 'candlestick':
        predictionSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#82ca9d',
          downColor: '#ff6b6b',
          borderVisible: false,
          wickUpColor: '#82ca9d',
          wickDownColor: '#ff6b6b',
        });
        break;
      case 'line':
        predictionSeries = chart.addSeries(LineSeries, {
          color: '#82ca9d',
          lineWidth: 2,
          lineStyle: 2, // Línea punteada
        });
        break;
      case 'bar':
        predictionSeries = chart.addSeries(BarSeries, {
          upColor: '#82ca9d',
          downColor: '#ff6b6b',
        });
        break;
      case 'area':
        predictionSeries = chart.addSeries(AreaSeries, {
          lineColor: '#82ca9d',
          topColor: '#82ca9d',
          bottomColor: 'rgba(130, 202, 157, 0.28)',
        });
        break;
      default:
        predictionSeries = chart.addSeries(LineSeries, {
          color: '#82ca9d',
          lineWidth: 2,
          lineStyle: 2,
        });
    }

    // Preparar y ordenar datos históricos
    const historicalData = data
      .map(item => {
        if (type === 'candlestick' || type === 'bar') {
          return {
            time: new Date(item.date).getTime() / 1000 as Time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          };
        } else {
          return {
            time: new Date(item.date).getTime() / 1000 as Time,
            value: item.close,
          };
        }
      })
      .sort((a, b) => (a.time as number) - (b.time as number));

    // Preparar y ordenar datos de predicción
    const predictionData = prediction
      .map(item => {
        if (type === 'candlestick' || type === 'bar') {
          return {
            time: new Date(item.fecha).getTime() / 1000 as Time,
            open: item.último,
            high: item.último,
            low: item.último,
            close: item.último,
          };
        } else {
          return {
            time: new Date(item.fecha).getTime() / 1000 as Time,
            value: item.último,
          };
        }
      })
      .sort((a, b) => (a.time as number) - (b.time as number));

    // Agregar datos al gráfico
    historicalSeries.setData(historicalData);
    predictionSeries.setData(predictionData);

    // Ajustar el rango de tiempo visible según el periodo
    chart.timeScale().fitContent();

    // Centramos la data automáticamente y hacemos zoom
    const totalBars = historicalData.length + predictionData.length;
    const containerWidth = chartContainerRef.current?.clientWidth || 600;
    // Bar spacing depende del periodo
    let barSpacing = 6;
    switch (period) {
      case 'weekly':
        barSpacing = 12;
        break;
      case 'monthly':
        barSpacing = 20;
        break;
      case 'yearly':
        barSpacing = 30;
        break;
    }
    const barsOnScreen = Math.floor(containerWidth / barSpacing);
    let from = 0;
    let to = totalBars - 1;
    if (barsOnScreen < totalBars) {
      // Centramos la data visible
      const center = Math.floor(totalBars / 2);
      from = Math.max(0, center - Math.floor(barsOnScreen / 2));
      to = from + barsOnScreen - 1;
    }
    // Aplicar opciones y rango visible solo si hay datos y el rango es válido
    chart.timeScale().applyOptions({ barSpacing, rightOffset: 0 });
    if (totalBars > 0 && from <= to) {
      chart.timeScale().setVisibleLogicalRange({ from, to });
    }

    // Guardar referencia del gráfico
    chartRef.current = chart;

    // Manejar el redimensionamiento
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    // Configurar el observador de redimensionamiento
    const resizeObserver = new ResizeObserver(() => {
      updateChartSize(chart);
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Limpieza al desmontar
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, prediction, period, type]);

  // Asegurarse de que el contenedor tenga un tamaño inicial
  useEffect(() => {
    const updateInitialSize = () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.style.height = `${height}px`;
      }
    };
    
    updateInitialSize();
    
    // Opcional: Si quieres que siga siendo responsivo
    const handleResize = () => {
      updateInitialSize();
      if (chartRef.current) {
        updateChartSize(chartRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full min-h-[300px]"
      style={{ height: '100%', width: '100%' }}
    />
  );
}