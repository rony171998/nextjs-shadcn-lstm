import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">EUR/USD Analysis</h1>
        </div>
        <Button variant="outline" size="sm" disabled>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Refreshing...
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Precio actual */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Price</CardTitle>
                <Skeleton className="h-4 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>

            {/* 24h High */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h High loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>

            {/* 24h Low */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Low</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>

            {/* 24h Volume */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          </div>

          {/* Gráfico */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Price Chart EUR/USD</CardTitle>
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-[120px] rounded-md" />
                <Skeleton className="h-9 w-[120px] rounded-md" />
                <Skeleton className="h-9 w-[520px] rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[500px] w-full rounded-md" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}