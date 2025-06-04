import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ModelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Modelo de Predicción LSTM</h1>
        <p className="text-muted-foreground">
          Explicación detallada del modelo de predicción de series temporales
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="architecture">Arquitectura</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué es un modelo LSTM?</CardTitle>
              <CardDescription>
                Las Redes Neuronales Recurrentes de Memoria a Largo Plazo (LSTM) son un tipo especial de RNN diseñadas para aprender patrones en secuencias de datos a lo largo del tiempo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Características clave:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Capacidad de recordar información a largo plazo</li>
                  <li>Efectivo para predecir series temporales</li>
                  <li>Manejo de dependencias a largo plazo en los datos</li>
                  <li>Resistente al problema del gradiente que se desvanece</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Casos de uso típicos:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Predicción de mercados financieros</Badge>
                  <Badge variant="outline">Reconocimiento de voz</Badge>
                  <Badge variant="outline">Procesamiento de lenguaje natural</Badge>
                  <Badge variant="outline">Detección de anomalías</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>Arquitectura del Modelo</CardTitle>
              <CardDescription>
                Nuestro modelo utiliza una arquitectura de LSTM de dos capas con dropout para regularización.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Componentes principales:</h3>
                <ol className="list-decimal pl-5 space-y-4">
                  <li>
                    <span className="font-medium">Primera capa LSTM</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Procesa la secuencia de entrada y extrae características temporales.
                      Tamaño de entrada: 2 (features), Tamaño oculto: 512 neuronas.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Capa de Dropout (20%)</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ayuda a prevenir el sobreajuste desactivando aleatoriamente el 20% de las neuronas durante el entrenamiento.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Segunda capa LSTM</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Procesa la salida de la primera capa para aprender patrones más complejos.
                      Mismo tamaño oculto (512) para mantener la dimensionalidad.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Capa completamente conectada</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Transforma la salida de la última capa LSTM a la dimensión de salida deseada (1 para predicción de un solo valor).
                    </p>
                  </li>
                </ol>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Flujo de datos:</h4>
                <p className="text-sm">
                  Datos de entrada → LSTM 1 → Dropout → LSTM 2 → Dropout → Capa lineal → Predicción
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Implementación en PyTorch</CardTitle>
              <CardDescription>
                Código del modelo LSTM con explicaciones detalladas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>
{`class TLS_LSTMModel(nn.Module):
    def __init__(self, input_size=2, hidden_size=512, output_size=1, dropout_prob=0.2):
        super(TLS_LSTMModel, self).__init__()
        # Tamaño de la capa oculta
        self.hidden_size = hidden_size
        
        # Primera capa LSTM
        self.lstm1 = nn.LSTM(input_size, hidden_size, batch_first=True)
        # Dropout para regularización
        self.dropout1 = nn.Dropout(dropout_prob)
        
        # Segunda capa LSTM
        self.lstm2 = nn.LSTM(hidden_size, hidden_size, batch_first=True)
        # Segunda capa de dropout
        self.dropout2 = nn.Dropout(dropout_prob)
        
        # Capa completamente conectada para la salida
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
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
              
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Explicación del código:</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">__init__:</span> Inicializa las capas del modelo con los tamaños especificados.
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">forward:</span> Define el flujo de datos a través de la red:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Los datos pasan por la primera capa LSTM</li>
                    <li>Se aplica dropout para regularización</li>
                    <li>Los datos pasan por la segunda capa LSTM</li>
                    <li>Se aplica otro dropout</li>
                    <li>Se toma la última salida de la secuencia</li>
                    <li>Finalmente, pasa por una capa lineal para producir la predicción</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}