/**
 * Token Storage Utility
 * Maneja el almacenamiento del JWT token en localStorage
 */

const TOKEN_KEY = 'jwtToken';

export const tokenStorage = {
    /**
     * Guarda el token JWT en localStorage
     */
    save: (token: string): void => {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Failed to save token:', error);
        }
    },

    /**
     * Obtiene el token JWT desde localStorage
     */
    get: (): string | null => {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Failed to get token:', error);
            return null;
        }
    },

    /**
     * Elimina el token JWT de localStorage
     */
    remove: (): void => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    },

    /**
     * Verifica si existe un token guardado
     */
    exists: (): boolean => {
        return tokenStorage.get() !== null;
    }
};
