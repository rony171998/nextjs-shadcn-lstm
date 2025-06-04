'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

const languageFlags: Record<Language, { code: string; name: string }> = {
  en: { code: 'us', name: 'English' },
  es: { code: 'es', name: 'Español' },
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languageFlags[language];

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-lg"
          aria-label={`Idioma actual: ${currentLang.name}. Cambiar idioma`}
        >
          <img
            loading="lazy"
            width="25"
            height="30"
            className="rounded-sm"
            src={`https://flagcdn.com/w20/${currentLang.code}.png`}
            srcSet={`https://flagcdn.com/w40/${currentLang.code}.png 2x`}
            alt=""
            aria-hidden="true"
          />
          <span className="sr-only">Cambiar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageFlags).map(([code, { code: flagCode, name }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code as Language)}
            className="text-base gap-2"
          >
            <img
              loading="lazy"
              width="25"
              height="30"
              className="rounded-sm"
              src={`https://flagcdn.com/w20/${flagCode}.png`}
              srcSet={`https://flagcdn.com/w40/${flagCode}.png 2x`}
              alt=""
              aria-hidden="true"
            />
            <span>{name}</span>
            {code === language && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
