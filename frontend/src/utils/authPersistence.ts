/**
 * Servicio de persistencia de autenticación
 * Responsabilidad: Manejar el almacenamiento y recuperación del estado de autenticación
 * en localStorage (Principio de Responsabilidad Única - SRP)
 */

import { STORAGE_KEYS } from '../constants/app.constants';
import type { UserType } from '../types/common.types';
import { isValidUserType } from './userTypeDetector';

/**
 * Guarda el tipo de usuario en localStorage
 */
export const saveUserType = (userType: UserType): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
    } catch (error) {
        console.error('Error al guardar el tipo de usuario:', error);
    }
};

/**
 * Obtiene el tipo de usuario guardado en localStorage
 * Retorna null si no existe o no es válido
 */
export const getSavedUserType = (): UserType | null => {
    try {
        const savedType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);

        if (!savedType) {
            return null;
        }

        // Validar que sea un tipo válido
        return isValidUserType(savedType) ? savedType : null;
    } catch (error) {
        console.error('Error al recuperar el tipo de usuario:', error);
        return null;
    }
};

/**
 * Elimina el tipo de usuario guardado
 */
export const clearSavedUserType = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
    } catch (error) {
        console.error('Error al eliminar el tipo de usuario:', error);
    }
};

/**
 * Limpia toda la información de autenticación guardada
 */
export const clearAuthData = (): void => {
    clearSavedUserType();
    // Aquí se pueden limpiar otros datos relacionados con autenticación si es necesario
};

/**
 * Verifica si hay una sesión guardada
 */
export const hasSavedSession = (): boolean => {
    return getSavedUserType() !== null;
};
