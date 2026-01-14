/**
 * Servicio de persistencia de tema
 * Responsabilidad: Manejar el almacenamiento y recuperación del tema
 * en localStorage (Principio de Responsabilidad Única - SRP)
 */

import { STORAGE_KEYS } from '../constants/app.constants';

/**
 * Tipo de tema
 */
export type Theme = 'light' | 'dark';

/**
 * Guarda el tema en localStorage
 */
export const saveTheme = (isDarkMode: boolean): void => {
    try {
        const theme: Theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
        console.error('Error al guardar el tema:', error);
    }
};

/**
 * Obtiene el tema guardado en localStorage
 * Retorna null si no existe o no es válido
 */
export const getSavedTheme = (): Theme | null => {
    try {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

        if (!savedTheme) {
            return null;
        }

        // Validar que sea un tema válido
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        return null;
    } catch (error) {
        console.error('Error al recuperar el tema:', error);
        return null;
    }
};

/**
 * Verifica si el tema guardado es dark mode
 */
export const isDarkModeTheme = (): boolean => {
    const theme = getSavedTheme();
    return theme === 'dark';
};

/**
 * Obtiene el tema inicial basándose en preferencias guardadas o del sistema
 */
export const getInitialTheme = (): boolean => {
    const savedTheme = getSavedTheme();

    if (savedTheme) {
        return savedTheme === 'dark';
    }

    // Si no hay tema guardado, usar preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false; // Default a light mode
};
