import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleDot, ChartLine, Coins, TrendingUp } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto p-4 space-y-8">
      {/* Header Skeleton with gradient */}
      <div className="space-y-3 relative overflow-hidden rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/50"></div>
        <Skeleton className="h-10 w-3/4 max-w-md bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800" />
        <Skeleton className="h-6 w-1/2 max-w-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900" />
      </div>

      {/* Stats Grid Skeleton with icons and pulse effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Coins className="h-5 w-5 text-blue-500" />, title: "Precio Actual" },
          { icon: <TrendingUp className="h-5 w-5 text-green-500" />, title: "Cambio 24h" },
          { icon: <ChartLine className="h-5 w-5 text-purple-500" />, title: "Volumen" },
          { icon: <CircleDot className="h-5 w-5 text-amber-500" />, title: "Rango" }
        ].map((item, i) => (
          <Card key={i} className="overflow-hidden border-t-4 border-t-primary/20 hover:border-t-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {item.icon}
                <span className="font-medium text-sm text-muted-foreground">{item.title}</span>
              </div>
              <div className="h-4 w-4 rounded-full bg-primary/20 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28 mb-1 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700" />
              <Skeleton className="h-4 w-36 bg-slate-100 dark:bg-slate-900" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton with animated elements */}
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <ChartLine className="h-3 w-3 text-primary" />
            </div>
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 opacity-75"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary/10 opacity-50"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary/70 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 rounded-full border-4 border-primary/5 opacity-30"></div>
                <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary/50 animate-spin" style={{ animationDuration: '2s' }}></div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">Cargando datos del mercado</p>
                <p className="text-sm text-muted-foreground">Preparando visualización de análisis financiero...</p>
                <div className="flex justify-center space-x-1 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" 
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}