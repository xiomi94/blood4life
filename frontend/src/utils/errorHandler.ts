/**
 * Utilidades para manejo estandarizado de errores
 * Proporciona funciones para manejar diferentes tipos de errores de forma consistente
 */

import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/common.types';

/**
 * Verifica si un error es de tipo AxiosError
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
};

/**
 * Extrae el mensaje de error de diferentes tipos de errores
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'Ha ocurrido un error inesperado'): string => {
    if (isAxiosError(error)) {
        return getAxiosErrorMessage(error);
    }

    if (error instanceof Error) {
        return error.message || defaultMessage;
    }

    if (typeof error === 'string') {
        return error;
    }

    return defaultMessage;
};

/**
 * Extrae el mensaje de error específico de AxiosError
 */
export const getAxiosErrorMessage = (error: AxiosError): string => {
    // Si hay un mensaje en la respuesta del servidor
    if (error.response?.data) {
        const data = error.response.data as any;

        if (typeof data === 'string') {
            return data;
        }

        if (data.message) {
            return data.message;
        }

        if (data.error) {
            return data.error;
        }
    }

    // Mensajes por código de estado HTTP
    if (error.response?.status) {
        return getHttpErrorMessage(error.response.status);
    }

    // Si es un error de red
    if (error.message === 'Network Error') {
        return 'Error de conexión. Por favor, verifica tu conexión a internet.';
    }

    return error.message || 'Error en la comunicación con el servidor';
};

/**
 * Obtiene un mensaje de error basado en el código de estado HTTP
 */
export const getHttpErrorMessage = (statusCode: number): string => {
    const messages: Record<number, string> = {
        400: 'Solicitud inválida. Por favor, verifica los datos ingresados.',
        401: 'No autorizado. Por favor, inicia sesión nuevamente.',
        403: 'Acceso denegado. No tienes permisos para realizar esta acción.',
        404: 'Recurso no encontrado.',
        409: 'Conflicto. El recurso ya existe o hay datos duplicados.',
        422: 'Datos de validación incorrectos.',
        429: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
        500: 'Error interno del servidor. Por favor, intenta más tarde.',
        502: 'Error de conexión con el servidor.',
        503: 'Servicio no disponible. Por favor, intenta más tarde.',
        504: 'Tiempo de espera agotado. El servidor no responde.',
    };

    return messages[statusCode] || `Error del servidor (${statusCode})`;
};

/**
 * Crea un objeto ApiError estandarizado
 */
export const createApiError = (error: unknown): ApiError => {
    if (isAxiosError(error)) {
        return {
            message: getAxiosErrorMessage(error),
            status: error.response?.status || 0,
            code: error.code,
            details: error.response?.data,
        };
    }

    return {
        message: getErrorMessage(error),
        status: 0,
        details: error,
    };
};

/**
 * Maneja un error y ejecuta callbacks específicos según el tipo
 */
export const handleError = (
    error: unknown,
    handlers: {
        onNetworkError?: () => void;
        onAuthError?: () => void;
        onValidationError?: (details: unknown) => void;
        onServerError?: () => void;
        onUnknownError?: (error: unknown) => void;
    } = {}
): void => {
    const apiError = createApiError(error);

    // Error de autenticación
    if (apiError.status === 401 && handlers.onAuthError) {
        handlers.onAuthError();
        return;
    }

    // Error de validación
    if ((apiError.status === 400 || apiError.status === 422) && handlers.onValidationError) {
        handlers.onValidationError(apiError.details);
        return;
    }

    // Error de servidor
    if (apiError.status >= 500 && handlers.onServerError) {
        handlers.onServerError();
        return;
    }

    // Error de red
    if (apiError.status === 0 && handlers.onNetworkError) {
        handlers.onNetworkError();
        return;
    }

    // Error desconocido
    if (handlers.onUnknownError) {
        handlers.onUnknownError(error);
    }
};

/**
 * Log de errores de forma estandarizada
 */
export const logError = (
    error: unknown,
    context?: string,
    additionalInfo?: Record<string, unknown>
): void => {
    const apiError = createApiError(error);

    console.error('❌ Error:', {
        context,
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        ...additionalInfo,
    });

    // En producción, aquí podrías enviar a un servicio de monitoreo como Sentry
    if (import.meta.env.PROD) {
        // Ejemplo: Sentry.captureException(error);
    }
};

/**
 * Wrapper para operaciones asíncronas con manejo de errores
 */
export async function tryAsync<T>(
    operation: () => Promise<T>,
    errorHandler?: (error: unknown) => void
): Promise<[T | null, ApiError | null]> {
    try {
        const result = await operation();
        return [result, null];
    } catch (error) {
        const apiError = createApiError(error);

        if (errorHandler) {
            errorHandler(error);
        } else {
            logError(error, 'Async operation failed');
        }

        return [null, apiError];
    }
}
