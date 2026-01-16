/**
 * Servicio de persistencia de idioma
 * Responsabilidad: Manejar el almacenamiento y recuperación del idioma
 * en localStorage (Principio de Responsabilidad Única - SRP)
 */

import { STORAGE_KEYS } from '../constants/app.constants';
import type { Language } from '../types/common.types';

/**
 * Idiomas soportados
 */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'de', 'fr', 'ja', 'zh'];

/**
 * Idioma por defecto
 */
const DEFAULT_LANGUAGE: Language = 'es';

/**
 * Valida que un valor sea un idioma soportado
 */
export const isValidLanguage = (value: unknown): value is Language => {
    return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);
};

/**
 * Guarda el idioma en localStorage
 */
export const saveLanguage = (language: Language): void => {
    try {
        if (!isValidLanguage(language)) {
            console.warn(`Idioma no válido: ${language}. Usando idioma por defecto.`);
            localStorage.setItem(STORAGE_KEYS.LANGUAGE, DEFAULT_LANGUAGE);
            return;
        }
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
        console.error('Error al guardar el idioma:', error);
    }
};

/**
 * Obtiene el idioma guardado en localStorage
 * Retorna el idioma por defecto si no existe o no es válido
 */
export const getSavedLanguage = (): Language => {
    try {
        const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);

        if (!savedLanguage) {
            return DEFAULT_LANGUAGE;
        }

        // Validar que sea un idioma soportado
        return isValidLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
    } catch (error) {
        console.error('Error al recuperar el idioma:', error);
        return DEFAULT_LANGUAGE;
    }
};

/**
 * Obtiene el idioma del navegador
 */
export const getBrowserLanguage = (): Language => {
    if (typeof window === 'undefined' || !window.navigator) {
        return DEFAULT_LANGUAGE;
    }

    const browserLang = window.navigator.language.split('-')[0];
    return isValidLanguage(browserLang) ? browserLang : DEFAULT_LANGUAGE;
};

/**
 * Obtiene el idioma inicial basándose en preferencias guardadas o del navegador
 */
export const getInitialLanguage = (): Language => {
    const savedLanguage = getSavedLanguage();

    if (savedLanguage !== DEFAULT_LANGUAGE) {
        return savedLanguage;
    }

    // Si no hay idioma guardado (o es el default), intentar con el del navegador
    return getBrowserLanguage();
};
