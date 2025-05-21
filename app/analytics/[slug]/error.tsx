'use client'

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Analytics Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error en el Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Algo salió mal!</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message || 'Ocurrió un error al cargar los datos del análisis.'}
            </AlertDescription>
          </Alert>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Código de error: {error.digest || 'No disponible'}
            </p>
            <p className="text-sm text-muted-foreground">
              Puedes intentar recargar la página o volver a intentarlo más tarde.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => reset()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              Recargar página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}