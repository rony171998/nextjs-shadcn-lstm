import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-16 min-h-screen bg-card border-r flex flex-col items-center py-4 gap-6">
          <div className="w-8 h-8 bg-primary/20 rounded-lg mb-4 animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-[200px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-gradient-to-br from-card to-card/80">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-[150px]" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <div className="h-full w-full bg-muted rounded-md animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return <LoadingSkeleton />
}