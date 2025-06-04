import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function TLS_LSTMPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Modelo TLS_LSTM</h1>
        <p className="text-muted-foreground">
          Implementación detallada del modelo LSTM para predicción de series temporales
        </p>
      </div>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="architecture">Arquitectura</TabsTrigger>
          <TabsTrigger value="code">Implementación</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>Arquitectura del Modelo TLS_LSTM</CardTitle>
              <CardDescription>
                Este modelo utiliza una arquitectura de doble capa LSTM con dropout para la predicción de series temporales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Especificaciones técnicas:</h3>
                <ul className="space-y-2">
                  <li><span className="font-medium">Tipo:</span> Red Neuronal Recurrente (LSTM)</li>
                  <li><span className="font-medium">Capas LSTM:</span> 2</li>
                  <li><span className="font-medium">Tamaño de entrada:</span> 2 características</li>
                  <li><span className="font-medium">Neuronas por capa:</span> 512</li>
                  <li><span className="font-medium">Dropout:</span> 20%</li>
                  <li><span className="font-medium">Salida:</span> 1 valor</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Flujo de datos:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                      <h4 className="font-medium">Primera capa LSTM</h4>
                      <p className="text-sm text-muted-foreground">Procesa las 2 características de entrada a través de 512 neuronas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                      <h4 className="font-medium">Capa de Dropout (20%)</h4>
                      <p className="text-sm text-muted-foreground">Desactiva aleatoriamente el 20% de las neuronas para prevenir sobreajuste</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                      <h4 className="font-medium">Segunda capa LSTM</h4>
                      <p className="text-sm text-muted-foreground">Procesa las características extraídas para aprender patrones más complejos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">4</div>
                    <div>
                      <h4 className="font-medium">Capa de Salida Lineal</h4>
                      <p className="text-sm text-muted-foreground">Transforma la salida al valor de predicción final</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Implementación en PyTorch</CardTitle>
              <CardDescription>
                Código completo del modelo TLS_LSTM con explicaciones detalladas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Estructura de la clase:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
{`class TLS_LSTMModel(nn.Module):
    def __init__(self, input_size=2, hidden_size=512, output_size=1, dropout_prob=0.2):
        super(TLS_LSTMModel, self).__init__()`}
                    </code>
                  </pre>
                  <p className="text-sm text-muted-foreground">
                    La clase hereda de <code>nn.Module</code> de PyTorch y recibe los parámetros de configuración del modelo.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Inicialización de capas:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
{`        self.hidden_size = hidden_size
        
        # Primera capa LSTM
        self.lstm1 = nn.LSTM(input_size, hidden_size, batch_first=True)
        # Dropout para regularización
        self.dropout1 = nn.Dropout(dropout_prob)
        
        # Segunda capa LSTM
        self.lstm2 = nn.LSTM(hidden_size, hidden_size, batch_first=True)
        # Segunda capa de dropout
        self.dropout2 = nn.Dropout(dropout_prob)
        
        # Capa completamente conectada para la salida
        self.fc = nn.Linear(hidden_size, output_size)`}
                    </code>
                  </pre>
                  <p className="text-sm text-muted-foreground">
                    Se definen las capas del modelo con sus respectivos tamaños y parámetros de regularización.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Método forward:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
{`    def forward(self, x):
        # Primera capa LSTM
        lstm1_out, _ = self.lstm1(x)
        # Aplicar dropout
        lstm1_out = self.dropout1(lstm1_out)
        
        # Segunda capa LSTM
        lstm2_out, _ = self.lstm2(lstm1_out)
        # Aplicar dropout
        lstm2_out = self.dropout2(lstm2_out)
        
        # Tomar solo la última salida de la secuencia
        last_time_step_out = lstm2_out[:, -1, :]
        
        # Pasar por la capa completamente conectada
        out = self.fc(last_time_step_out)
        return out`}
                    </code>
                  </pre>
                  <p className="text-sm text-muted-foreground">
                    El método <code>forward</code> define cómo los datos fluyen a través de la red durante el entrenamiento y la inferencia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}