'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

function FAQAccordion() {
  const faqs = [
    {
      question: '¿Cómo creo una cuenta y empiezo a usar la plataforma?',
      answer: 'Guía paso a paso para crear tu cuenta, verificar tu identidad y comenzar a usar las predicciones de IA en el mercado EUR/USD.'
    },
    {
      question: '¿Mi información personal y financiera está segura?',
      answer: 'Sí, utilizamos cifrado y las mejores prácticas de seguridad para proteger tus datos en todo momento.'
    },
    {
      question: '¿Qué modelos de IA están disponibles?',
      answer: 'Puedes elegir entre LSTM, GRU, modelos bidireccionales y más, todos entrenados específicamente para el mercado de divisas.'
    },
    {
      question: '¿Hay algún costo por usar la plataforma?',
      answer: 'Ofrecemos un plan gratuito y opciones premium con características avanzadas. Consulta nuestra página de precios para más detalles.'
    },
    {
      question: '¿Puedo usar la plataforma si soy nuevo en el trading?',
      answer: '¡Por supuesto! Nuestra plataforma está diseñada para ser intuitiva y fácil de usar, incluso si eres principiante.'
    },
    {
      question: '¿Cómo monitoreo tendencias y resultados?',
      answer: 'Tienes acceso a dashboards interactivos, gráficos y reportes para seguir el rendimiento de tus estrategias.'
    },
  ];
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="flex flex-col gap-4 w-full">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className={`bg-white border border-border rounded-2xl p-6 shadow-sm transition-all ${openIndex === idx ? 'ring-2 ring-primary/20' : ''}`}
        >
          <button
            className="flex w-full justify-between items-center text-left text-lg font-semibold text-primary focus:outline-none"
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            aria-expanded={openIndex === idx}
          >
            {faq.question}
            <span className="ml-4 text-2xl text-muted-foreground">{openIndex === idx ? '−' : '+'}</span>
          </button>
          {openIndex === idx && (
            <div className="mt-2 text-muted-foreground text-base animate-fade-in">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-6">
      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-2 md:px-8 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-primary">AI Analytics Forex</span>
          {/* Puedes reemplazar el texto por una imagen si tienes un logo */}
        </div>
        {/* Links */}
        <div className="hidden md:flex gap-8 text-base font-medium text-muted-foreground">
          <Link href="/">Home</Link>
          <Link href="#features">Features</Link>
          <Link href="#about">About Us</Link>
          <Link href="#blogs">Blogs</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        {/* Botones */}
        <div className="flex gap-2">
          <Link href="/signin" className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-muted transition">Sign In</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-primary transition">Get started</Link>
        </div>
      </nav>
      {/* HERO NUEVO DISEÑO */}
      <section className="w-full max-w-7xl flex flex-col items-center justify-center text-center py-20 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
          Step into tomorrow with your <br className="hidden md:block" /> gateway to the IA revolution
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Plataforma avanzada para el análisis y predicción del par EUR/USD usando inteligencia artificial y modelos de deep learning. Visualiza tendencias, selecciona modelos, y obtén predicciones precisas de manera sencilla.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:bg-primary/90 transition"
          >
            Get started
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 rounded-full border border-primary text-primary font-bold text-lg hover:bg-primary/10 transition"
          >
            Learn more
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/hero2.png"
              alt="Ilustración análisis EUR/USD"
              width={1000}
              height={450}
              className="mx-auto rounded-2xl bg-white object-cover w-full h-auto"
              priority={true}
            />
          </div>
        </div>
      </section>

      <section id="about" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-2">• About Us</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Impulsando el futuro del trading con IA</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-lg">
          Somos un equipo apasionado por la inteligencia artificial y los mercados financieros. Nuestra misión es democratizar el acceso a herramientas avanzadas de análisis y predicción para todos los traders, sin importar su experiencia. Creemos en la transparencia, la innovación y la educación financiera como motores de cambio en el mundo del trading.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">🤝</span>
            <span className="font-semibold mb-1">Transparencia</span>
            <span className="text-sm text-muted-foreground">Compartimos nuestra metodología y resultados de forma clara y abierta para que confíes en cada predicción.</span>
          </div>
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">🚀</span>
            <span className="font-semibold mb-1">Innovación</span>
            <span className="text-sm text-muted-foreground">Utilizamos lo último en IA y deep learning para ofrecerte análisis y predicciones de vanguardia.</span>
          </div>
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">📚</span>
            <span className="font-semibold mb-1">Educación</span>
            <span className="text-sm text-muted-foreground">Creemos en empoderar a los traders con recursos y formación para tomar mejores decisiones.</span>
          </div>
        </div>
      </section>

      {/* SECCIONES PRINCIPALES */}
      <section id="features" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-2 ">• Features</span>
        </div>

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
      </section>



      <section id="blogs" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 font-semibold text-sm mb-2">• Blogs</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Últimos artículos y novedades</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">Descubre análisis de mercado, tutoriales de IA, estrategias de trading y noticias relevantes del mundo financiero y tecnológico.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: '¿Qué es el análisis técnico y cómo aplicarlo en Forex?',
              desc: 'Aprende los fundamentos del análisis técnico y cómo utilizar indicadores clave para mejorar tus decisiones de trading en el mercado EUR/USD.',
              date: 'Jun 2024',
              img: '/blog1.jpg',
              link: '#'
            },
            {
              title: 'Inteligencia Artificial en el trading: ventajas y retos',
              desc: 'Exploramos cómo la IA está revolucionando el análisis de mercados financieros y qué debes tener en cuenta al usar modelos predictivos.',
              date: 'May 2024',
              img: '/blog2.jpg',
              link: '#'
            },
            {
              title: 'Guía rápida: primeros pasos en la plataforma',
              desc: 'Un tutorial paso a paso para crear tu cuenta, configurar tus preferencias y empezar a obtener predicciones con IA.',
              date: 'May 2024',
              img: '/blog3.jpg',
              link: '#'
            }
          ].map((post, idx) => (
            <div key={idx} className="bg-card rounded-xl border border-border shadow-md overflow-hidden flex flex-col">
              <div className="h-40 w-full bg-muted flex items-center justify-center overflow-hidden">
                <img src={post.img} alt={post.title} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 flex flex-col p-5">
                <span className="text-xs text-muted-foreground mb-2">{post.date}</span>
                <h3 className="font-bold text-lg mb-2 text-primary">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{post.desc}</p>
                <a href={post.link} className="mt-auto text-sm font-semibold text-green-700 hover:underline">Leer más →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Columna izquierda: título y descripción */}
          <div>
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-2">• FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to know about our platform</h2>
            <p className="text-muted-foreground text-lg">Whether you're new to forex or a seasoned investor, our FAQ section covers everything from getting started and managing your account to understanding predictions, security, and trading strategies.</p>
          </div>
          {/* Columna derecha: acordeón */}
          <FAQAccordion />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center text-xs text-muted-foreground py-6 border-t mt-8">
        &copy; {new Date().getFullYear()} EUR/USD AI Analytics &middot; <Link href="https://github.com/rony171998/nextjs-shadcn-lstm" className="underline hover:text-primary ml-1">GitHub</Link>
      </footer>
    </main>
  );
}