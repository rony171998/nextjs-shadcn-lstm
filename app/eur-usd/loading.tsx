import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="flex">
        <div className="w-16 min-h-screen bg-card border-r flex flex-col items-center py-4 gap-6">
          <div className="w-8 h-8 bg-primary/20 rounded-lg mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg bg-muted" />
          ))}
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 w-[200px] bg-muted rounded-md"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-[200px] bg-muted rounded-md"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 w-[100px] bg-muted rounded-md"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-[120px] bg-muted rounded-md mb-2"></div>
                      <div className="h-4 w-[80px] bg-muted rounded-md"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-card">
                <CardHeader>
                  <div className="h-6 w-[200px] bg-muted rounded-md"></div>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full bg-muted rounded-md"></div>
                </CardContent>
              </Card>
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