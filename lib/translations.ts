// Definir las traducciones directamente en el archivo para evitar problemas de importación
const enTranslations = {
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "analysis": "Analysis",
    "indicators": "Indicators"
  },
  "common": {
    "language": "Language",
    "english": "English",
    "spanish": "Spanish",
    "loading": "Loading...",
    "error": "An error occurred"
  }
};

const esTranslations = {
  "navigation": {
    "home": "Inicio",
    "dashboard": "Panel",
    "analysis": "Análisis",
    "indicators": "Indicadores"
  },
  "common": {
    "language": "Idioma",
    "english": "Inglés",
    "spanish": "Español",
    "loading": "Cargando...",
    "error": "Ocurrió un error"
  }
};

export const translations = {
  en: enTranslations,
  es: esTranslations
};

export type Language = 'en' | 'es';

export function getTranslations(language: Language) {
  return translations[language];
}

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    return key; // Fallback to key if result is not a string
  };
  
  return { t };
}
