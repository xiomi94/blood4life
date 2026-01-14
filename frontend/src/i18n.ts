import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files with proper type assertion
import esTranslation from './locales/es/translation.json?raw';
import enTranslation from './locales/en/translation.json?raw';
import deTranslation from './locales/de/translation.json?raw';
import frTranslation from './locales/fr/translation.json?raw';
import jaTranslation from './locales/ja/translation.json?raw';
import zhTranslation from './locales/zh/translation.json?raw';

// Parse JSON strings
const parseTranslation = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing translation:', error);
    return {};
  }
};

// Translation resources
const resources = {
  es: { translation: parseTranslation(esTranslation) },
  en: { translation: parseTranslation(enTranslation) },
  de: { translation: parseTranslation(deTranslation) },
  fr: { translation: parseTranslation(frTranslation) },
  ja: { translation: parseTranslation(jaTranslation) },
  zh: { translation: parseTranslation(zhTranslation) },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Default language: Spanish
    debug: false, // Disable debug in production
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    react: {
      useSuspense: false, // Disable suspense to avoid rendering issues
    },
  });

// Save language preference to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
  }
});

export default i18n;
