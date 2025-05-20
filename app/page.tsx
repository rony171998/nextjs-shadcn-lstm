'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const { language } = useLanguage();

  // Textos traducidos
  const translations = {
    en: {
      // Navegación
      navItems: {
        home: "Home",
        features: "Features",
        about: "About Us",
        blogs: "Blogs",
        faq: "FAQ",
      },
      // Botones
      buttons: {
        signIn: "Sign In",
        getStarted: "Get started",
      },
      // Sección Hero
      hero: {
        title: "Step into tomorrow with your gateway to the AI revolution",
        subtitle: "Advanced platform for EUR/USD analysis and prediction using artificial intelligence and deep learning models. Visualize trends, select models, and get accurate predictions easily.",
        cta1: "Get started",
        cta2: "Learn more"
      },
      // Sección About
      aboutSection: {
        title: "Driving the future of trading with AI",
        subtitle: "We are a team passionate about artificial intelligence and financial markets. Our mission is to democratize access to advanced analysis and prediction tools for all traders, regardless of their experience. We believe in transparency, innovation, and financial education as drivers of change in the trading world.",
        values: {
          transparency: "Transparency",
          transparencyDesc: "We share our methodology and results clearly and openly so you can trust every prediction.",
          innovation: "Innovation",
          innovationDesc: "We use the latest in AI and deep learning to offer cutting-edge analysis and predictions.",
          education: "Education",
          educationDesc: "We believe in empowering traders with resources and training to make better decisions."
        }
      },
      // Sección Features
      featuresSection: {
        title: "Features",
        marketAnalysis: "Market Analysis",
        marketAnalysisDesc: "Visualize the historical and current behavior of EUR/USD with interactive charts and key statistics.",
        aiPredictions: "AI Predictions",
        aiPredictionsDesc: "Get automatic predictions using advanced LSTM, GRU, and attention models, trained for the forex market.",
        modelSelection: "Model Selection",
        modelSelectionDesc: "Choose between different model architectures to customize your predictions according to your strategy.",
        technicalIndicators: "Technical Indicators",
        technicalIndicatorsDesc: "Consult indicators such as RSI, SMA, EMA, and more, for a complete and visual technical analysis.",
        howItWorks: "How it works?",
        step1: "1. Select the model",
        step1Desc: "Choose between LSTM, GRU, Bidirectional, and more.",
        step2: "2. Visualize the analysis",
        step2Desc: "Explore EUR/USD charts and statistics.",
        step3: "3. Get predictions",
        step3Desc: "Receive automatic and reliable projections.",
        step4: "4. Make decisions",
        step4Desc: "Use the information for your strategy.",
        whyChoose: "Why choose EUR/USD AI Analytics?",
        fast: "Fast and Accurate",
        fastDesc: "Predictions in seconds with state-of-the-art models.",
        secure: "Secure and Private",
        secureDesc: "Your data and analysis always protected and private.",
        accessible: "Accessible 24/7",
        accessibleDesc: "Available anytime and from anywhere."
      },
      // Sección Blogs
      blogsSection: {
        title: "Latest articles and news",
        subtitle: "Discover market analysis, AI tutorials, trading strategies, and relevant news from the financial and technological world.",
        readMore: "Read more",
        blog1: {
          title: "What is technical analysis and how to apply it in Forex?",
          desc: "Learn the fundamentals of technical analysis and how to use key indicators to improve your trading decisions in the EUR/USD market.",
          date: "Jun 2024"
        },
        blog2: {
          title: "Artificial Intelligence in trading: advantages and challenges",
          desc: "We explore how AI is revolutionizing financial market analysis and what you should consider when using predictive models.",
          date: "May 2024"
        },
        blog3: {
          title: "Quick guide: first steps on the platform",
          desc: "A step-by-step tutorial to create your account, configure your preferences, and start getting AI predictions.",
          date: "May 2024"
        }
      },
      // Sección FAQ
      faqSection: {
        title: "Everything you need to know about our platform",
        subtitle: "Whether you're new to forex or a seasoned investor, our FAQ section covers everything from getting started and managing your account to understanding predictions, security, and trading strategies."
      },
      // Footer
      footer: {
        copyright: "All rights reserved"
      }
    },
    es: {
      // Navegación
      navItems: {
        home: "Inicio",
        features: "Características",
        about: "Nosotros",
        blogs: "Blog",
        faq: "Preguntas",
      },
      // Botones
      buttons: {
        signIn: "Iniciar Sesión",
        getStarted: "Comenzar",
      },
      // Sección Hero
      hero: {
        title: "Da un paso hacia el futuro con tu puerta de entrada a la revolución de la IA",
        subtitle: "Plataforma avanzada para el análisis y predicción del par EUR/USD usando inteligencia artificial y modelos de deep learning. Visualiza tendencias, selecciona modelos, y obtén predicciones precisas de manera sencilla.",
        cta1: "Comenzar",
        cta2: "Más información"
      },
      // Sección About
      aboutSection: {
        title: "Impulsando el futuro del trading con IA",
        subtitle: "Somos un equipo apasionado por la inteligencia artificial y los mercados financieros. Nuestra misión es democratizar el acceso a herramientas avanzadas de análisis y predicción para todos los traders, sin importar su experiencia. Creemos en la transparencia, la innovación y la educación financiera como motores de cambio en el mundo del trading.",
        values: {
          transparency: "Transparencia",
          transparencyDesc: "Compartimos nuestra metodología y resultados de forma clara y abierta para que confíes en cada predicción.",
          innovation: "Innovación",
          innovationDesc: "Utilizamos lo último en IA y deep learning para ofrecerte análisis y predicciones de vanguardia.",
          education: "Educación",
          educationDesc: "Creemos en empoderar a los traders con recursos y formación para tomar mejores decisiones."
        }
      },
      // Sección Features
      featuresSection: {
        title: "Características",
        marketAnalysis: "Análisis de Mercado",
        marketAnalysisDesc: "Visualiza el comportamiento histórico y actual del EUR/USD con gráficos interactivos y estadísticas clave.",
        aiPredictions: "Predicciones con IA",
        aiPredictionsDesc: "Obtén predicciones automáticas usando modelos avanzados de LSTM, GRU y atención, entrenados para el mercado de divisas.",
        modelSelection: "Selección de Modelos",
        modelSelectionDesc: "Elige entre diferentes arquitecturas de modelos para personalizar tus predicciones según tu estrategia.",
        technicalIndicators: "Indicadores Técnicos",
        technicalIndicatorsDesc: "Consulta indicadores como RSI, SMA, EMA y más, para un análisis técnico completo y visual.",
        howItWorks: "¿Cómo funciona?",
        step1: "1. Selecciona el modelo",
        step1Desc: "Elige entre LSTM, GRU, Bidireccional y más.",
        step2: "2. Visualiza el análisis",
        step2Desc: "Explora gráficos y estadísticas del EUR/USD.",
        step3: "3. Obtén predicciones",
        step3Desc: "Recibe proyecciones automáticas y confiables.",
        step4: "4. Toma decisiones",
        step4Desc: "Utiliza la información para tu estrategia.",
        whyChoose: "¿Por qué elegir EUR/USD AI Analytics?",
        fast: "Rápido y Preciso",
        fastDesc: "Predicciones en segundos con modelos de última generación.",
        secure: "Seguro y Privado",
        secureDesc: "Tus datos y análisis siempre protegidos y privados.",
        accessible: "Accesible 24/7",
        accessibleDesc: "Disponible en cualquier momento y desde cualquier lugar."
      },
      // Sección Blogs
      blogsSection: {
        title: "Últimos artículos y novedades",
        subtitle: "Descubre análisis de mercado, tutoriales de IA, estrategias de trading y noticias relevantes del mundo financiero y tecnológico.",
        readMore: "Leer más",
        blog1: {
          title: "¿Qué es el análisis técnico y cómo aplicarlo en Forex?",
          desc: "Aprende los fundamentos del análisis técnico y cómo utilizar indicadores clave para mejorar tus decisiones de trading en el mercado EUR/USD.",
          date: "Jun 2024"
        },
        blog2: {
          title: "Inteligencia Artificial en el trading: ventajas y retos",
          desc: "Exploramos cómo la IA está revolucionando el análisis de mercados financieros y qué debes tener en cuenta al usar modelos predictivos.",
          date: "May 2024"
        },
        blog3: {
          title: "Guía rápida: primeros pasos en la plataforma",
          desc: "Un tutorial paso a paso para crear tu cuenta, configurar tus preferencias y empezar a obtener predicciones con IA.",
          date: "May 2024"
        }
      },
      // Sección FAQ
      faqSection: {
        title: "Todo lo que necesitas saber sobre nuestra plataforma",
        subtitle: "Ya seas nuevo en forex o un inversor experimentado, nuestra sección de preguntas frecuentes cubre todo, desde cómo comenzar y administrar tu cuenta hasta entender predicciones, seguridad y estrategias de trading."
      },
      // Footer
      footer: {
        copyright: "Todos los derechos reservados"
      }
    }
  };

  // Usar el idioma actual o inglés como fallback
  const currentTranslation = translations[language as keyof typeof translations] || translations.en;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-6">
      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-2 md:px-8 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Logo />
            </div>
            <span className="text-2xl font-extrabold text-primary">Analytics Market AI</span>
          </Link>
          {/* Puedes reemplazar el texto por una imagen si tienes un logo */}
        </div>
        {/* Links */}
        <div className="hidden md:flex gap-8 text-base font-medium text-muted-foreground">
          <Link href="/">{currentTranslation.navItems.home}</Link>
          <Link href="#features">{currentTranslation.navItems.features}</Link>
          <Link href="#about">{currentTranslation.navItems.about}</Link>
          <Link href="#blogs">{currentTranslation.navItems.blogs}</Link>
          <Link href="#faq">{currentTranslation.navItems.faq}</Link>
        </div>
        {/* Botones */}
        <div className="flex gap-2 items-center">
          <LanguageSwitcher />
          <Link href="/signin" className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-muted transition">{currentTranslation.buttons.signIn}</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-primary transition">{currentTranslation.buttons.getStarted}</Link>
        </div>
      </nav>
      {/* HERO NUEVO DISEÑO */}
      <section className="w-full max-w-7xl flex flex-col items-center justify-center text-center py-20 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
          {currentTranslation.hero.title} <br className="hidden md:block" />
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          {currentTranslation.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:bg-primary/90 transition"
          >
            {currentTranslation.hero.cta1}
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 rounded-full border border-primary text-primary font-bold text-lg hover:bg-primary/10 transition"
          >
            {currentTranslation.hero.cta2}
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
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-2">• {currentTranslation.navItems.about}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{currentTranslation.aboutSection.title}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-lg">
          {currentTranslation.aboutSection.subtitle}
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">🤝</span>
            <span className="font-semibold mb-1">{currentTranslation.aboutSection.values.transparency}</span>
            <span className="text-sm text-muted-foreground">{currentTranslation.aboutSection.values.transparencyDesc}</span>
          </div>
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">🚀</span>
            <span className="font-semibold mb-1">{currentTranslation.aboutSection.values.innovation}</span>
            <span className="text-sm text-muted-foreground">{currentTranslation.aboutSection.values.innovationDesc}</span>
          </div>
          <div className="flex flex-col items-center text-center bg-card rounded-xl p-6 border border-border shadow-sm">
            <span className="text-4xl mb-2">📚</span>
            <span className="font-semibold mb-1">{currentTranslation.aboutSection.values.education}</span>
            <span className="text-sm text-muted-foreground">{currentTranslation.aboutSection.values.educationDesc}</span>
          </div>
        </div>
      </section>

      {/* SECCIONES PRINCIPALES */}
      <section id="features" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-2 ">• {currentTranslation.navItems.features}</span>
        </div>

        <section className="max-w-4xl w-full mx-auto grid gap-6 md:grid-cols-2 mb-16">
          <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
            <h2 className="text-xl font-semibold text-primary">{currentTranslation.featuresSection.marketAnalysis}</h2>
            <p className="text-muted-foreground text-sm">{currentTranslation.featuresSection.marketAnalysisDesc}</p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
            <h2 className="text-xl font-semibold text-primary">{currentTranslation.featuresSection.aiPredictions}</h2>
            <p className="text-muted-foreground text-sm">{currentTranslation.featuresSection.aiPredictionsDesc}</p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
            <h2 className="text-xl font-semibold text-primary">{currentTranslation.featuresSection.modelSelection}</h2>
            <p className="text-muted-foreground text-sm">{currentTranslation.featuresSection.modelSelectionDesc}</p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-2 border border-border">
            <h2 className="text-xl font-semibold text-primary">{currentTranslation.featuresSection.technicalIndicators}</h2>
            <p className="text-muted-foreground text-sm">{currentTranslation.featuresSection.technicalIndicatorsDesc}</p>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{currentTranslation.featuresSection.howItWorks}</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">🧠</span>
              <span className="font-semibold">{currentTranslation.featuresSection.step1}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.step1Desc}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">📊</span>
              <span className="font-semibold">{currentTranslation.featuresSection.step2}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.step2Desc}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">🤖</span>
              <span className="font-semibold">{currentTranslation.featuresSection.step3}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.step3Desc}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">🚀</span>
              <span className="font-semibold">{currentTranslation.featuresSection.step4}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.step4Desc}</span>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS / VENTAJAS */}
        <section className="max-w-4xl w-full mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{currentTranslation.featuresSection.whyChoose}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
              <span className="text-3xl mb-2">⚡</span>
              <span className="font-semibold mb-1">{currentTranslation.featuresSection.fast}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.fastDesc}</span>
            </div>
            <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
              <span className="text-3xl mb-2">🔒</span>
              <span className="font-semibold mb-1">{currentTranslation.featuresSection.secure}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.secureDesc}</span>
            </div>
            <div className="bg-card rounded-xl p-6 border flex flex-col items-center text-center">
              <span className="text-3xl mb-2">🌎</span>
              <span className="font-semibold mb-1">{currentTranslation.featuresSection.accessible}</span>
              <span className="text-sm text-muted-foreground">{currentTranslation.featuresSection.accessibleDesc}</span>
            </div>
          </div>
        </section>
      </section>

      <section id="blogs" className="w-full max-w-5xl mx-auto py-24 px-4">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 font-semibold text-sm mb-2">• {currentTranslation.navItems.blogs}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{currentTranslation.blogsSection.title}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">{currentTranslation.blogsSection.subtitle}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {
            [
              {
                title: currentTranslation.blogsSection.blog1.title,
                desc: currentTranslation.blogsSection.blog1.desc,
                date: currentTranslation.blogsSection.blog1.date,
                img: '/blog1.png',
                link: '/dashboard'
              },
              {
                title: currentTranslation.blogsSection.blog2.title,
                desc: currentTranslation.blogsSection.blog2.desc,
                date: currentTranslation.blogsSection.blog2.date,
                img: '/blog2.png',
                link: '/dashboard'
              },
              {
                title: currentTranslation.blogsSection.blog3.title,
                desc: currentTranslation.blogsSection.blog3.desc,
                date: currentTranslation.blogsSection.blog3.date,
                img: '/blog3.png',
                link: '/dashboard'
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
                  <a href={post.link} className="mt-auto text-sm font-semibold text-green-700 hover:underline">{currentTranslation.blogsSection.readMore} →</a>
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-2">• {currentTranslation.navItems.faq}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{currentTranslation.faqSection.title}</h2>
            <p className="text-muted-foreground text-lg">{currentTranslation.faqSection.subtitle}</p>
          </div>
          {/* Columna derecha: acordeón */}
          <FAQAccordion />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center text-xs text-muted-foreground py-6 border-t mt-8">
        &copy; {new Date().getFullYear()} EUR/USD AI Analytics - {currentTranslation.footer.copyright} &middot; <Link href="https://github.com/rony171998/nextjs-shadcn-lstm" className="underline hover:text-primary ml-1">GitHub</Link>
      </footer>
    </main>
  );
}

function FAQAccordion() {
  const { language } = useLanguage();

  const faqTranslations = {
    en: [
      {
        question: 'How do I create an account and start using the platform?',
        answer: 'Step-by-step guide to create your account, verify your identity, and start using AI predictions in the EUR/USD market.'
      },
      {
        question: 'Is my personal and financial information secure?',
        answer: 'Yes, we use encryption and security best practices to protect your data at all times.'
      },
      {
        question: 'What AI models are available?',
        answer: 'You can choose between LSTM, GRU, bidirectional models, and more, all specifically trained for the forex market.'
      },
      {
        question: 'Is there a cost to use the platform?',
        answer: 'We offer a free plan and premium options with advanced features. Check our pricing page for more details.'
      },
      {
        question: 'Can I use the platform if I\'m new to trading?',
        answer: 'Absolutely! Our platform is designed to be intuitive and easy to use, even if you\'re a beginner.'
      },
      {
        question: 'How do I monitor trends and results?',
        answer: 'You have access to interactive dashboards, charts, and reports to track the performance of your strategies.'
      },
    ],
    es: [
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
    ]
  };

  const faqs = faqTranslations[language as keyof typeof faqTranslations] || faqTranslations.en;
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