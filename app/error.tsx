'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
 
export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <div className="flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">¡Ups! Algo salió mal</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  )
}