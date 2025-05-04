'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-between p-6">
      {/* HERO */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8 mt-8 mb-16">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">EUR/USD AI Analytics</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Plataforma avanzada para el análisis y predicción del par EUR/USD usando inteligencia artificial y modelos de deep learning. Visualiza tendencias, selecciona modelos, y obtén predicciones precisas de manera sencilla.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/eur-usd"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
            <Link
              href="mailto:contacto@eurusdanalytics.com"
              className="px-8 py-3 rounded-lg border border-primary text-primary font-bold text-lg hover:bg-primary/10 transition"
            >
              Contacto
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/hero-forex.svg"
            alt="Ilustración análisis EUR/USD"
            width={400}
            height={400}
            className="w-[320px] md:w-[400px] drop-shadow-xl"
            priority={false}
          />
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="max-w-4xl w-full mx-auto grid gap-6 md:grid-cols-2 mb-16">
        <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
          <h2 className="text-xl font-semibold text-primary">Análisis de Mercado</h2>
          <p className="text-muted-foreground text-sm">Visualiza el comportamiento histórico y actual del EUR/USD con gráficos interactivos y estadísticas clave.</p>
        </div>
        <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
          <h2 className="text-xl font-semibold text-primary">Predicciones con IA</h2>
          <p className="text-muted-foreground text-sm">Obtén predicciones automáticas usando modelos avanzados de LSTM, GRU y atención, entrenados para el mercado de divisas.</p>
        </div>
        <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
          <h2 className="text-xl font-semibold text-primary">Selección de Modelos</h2>
          <p className="text-muted-foreground text-sm">Elige entre diferentes arquitecturas de modelos para personalizar tus predicciones según tu estrategia.</p>
        </div>
        <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
          <h2 className="text-xl font-semibold text-primary">Indicadores Técnicos</h2>
          <p className="text-muted-foreground text-sm">Consulta indicadores como RSI, SMA, EMA y más, para un análisis técnico completo y visual.</p>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-3xl w-full mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🧠</span>
            <span className="font-semibold">1. Selecciona el modelo</span>
            <span className="text-sm text-muted-foreground">Elige entre LSTM, GRU, Bidireccional y más.</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">📊</span>
            <span className="font-semibold">2. Visualiza el análisis</span>
            <span className="text-sm text-muted-foreground">Explora gráficos y estadísticas del EUR/USD.</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🤖</span>
            <span className="font-semibold">3. Obtén predicciones</span>
            <span className="text-sm text-muted-foreground">Recibe proyecciones automáticas y confiables.</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🚀</span>
            <span className="font-semibold">4. Toma decisiones</span>
            <span className="text-sm text-muted-foreground">Utiliza la información para tu estrategia.</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS / VENTAJAS */}
      <section className="max-w-4xl w-full mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">¿Por qué elegir EUR/USD AI Analytics?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
            <span className="text-3xl mb-2">⚡</span>
            <span className="font-semibold mb-1">Rápido y Preciso</span>
            <span className="text-sm text-muted-foreground">Predicciones en segundos con modelos de última generación.</span>
          </div>
          <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🔒</span>
            <span className="font-semibold mb-1">Seguro y Privado</span>
            <span className="text-sm text-muted-foreground">Tus datos y análisis siempre protegidos y privados.</span>
          </div>
          <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🌎</span>
            <span className="font-semibold mb-1">Accesible 24/7</span>
            <span className="text-sm text-muted-foreground">Disponible en cualquier momento y desde cualquier lugar.</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center text-xs text-muted-foreground py-6 border-t mt-8">
        &copy; {new Date().getFullYear()} EUR/USD AI Analytics &middot; <Link href="https://github.com/rony171998/nextjs-shadcn-lstm" className="underline hover:text-primary ml-1">GitHub</Link>
      </footer>
    </main>
  );
}