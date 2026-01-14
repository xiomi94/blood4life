/**
 * Constantes generales de la aplicación
 * Centraliza valores mágicos y configuraciones
 */

// Delays y timeouts
export const DELAYS = {
    /** Delay para permitir que las cookies se establezcan después del login */
    COOKIE_PROPAGATION_MS: 150,
    /** Timeout para toast notifications */
    TOAST_DURATION_MS: 4000,
    /** Delay antes de redirigir después de operación exitosa */
    REDIRECT_DELAY_MS: 2000,
    /** Delay para enrollment en campaña */
    CAMPAIGN_ENROLL_DELAY_MS: 1500,
    /** Delay para que screen readers detecten cambios */
    SCREEN_READER_DELAY_MS: 100,
    /** Delay por defecto para debounce */
    DEFAULT_DEBOUNCE_MS: 300,
} as const;

// Límites de validación
export const VALIDATION_LIMITS = {
    /** Longitud mínima de nombres */
    NAME_MIN_LENGTH: 2,
    /** Longitud máxima de nombres */
    NAME_MAX_LENGTH: 100,
    /** Longitud mínima de direcciones */
    ADDRESS_MIN_LENGTH: 10,
    /** Longitud máxima de direcciones */
    ADDRESS_MAX_LENGTH: 200,
    /** Longitud máxima de email */
    EMAIL_MAX_LENGTH: 100,
    /** Longitud mínima de contraseña */
    PASSWORD_MIN_LENGTH: 8,
    /** Longitud máxima de contraseña */
    PASSWORD_MAX_LENGTH: 32,
    /** Longitud exacta del código postal */
    POSTAL_CODE_LENGTH: 5,
    /** Dígitos mínimos en teléfono */
    PHONE_MIN_DIGITS: 9,
    /** Dígitos máximos en teléfono */
    PHONE_MAX_DIGITS: 15,
    /** Edad mínima permitida */
    MIN_AGE: 18,
    /** Letras mínimas en dirección */
    ADDRESS_MIN_LETTERS: 3,
} as const;

// Rangos de validación
export const VALIDATION_RANGES = {
    /** Rango válido de provincias españolas */
    POSTAL_CODE_PROVINCE_MIN: 1,
    POSTAL_CODE_PROVINCE_MAX: 52,
} as const;

// Límites de repetición de caracteres
export const REPETITION_LIMITS = {
    /** Máximo de caracteres repetidos consecutivos en nombres */
    NAME_MAX_CONSECUTIVE_CHARS: 4,
    /** Máximo de dígitos repetidos consecutivos en teléfonos */
    PHONE_MAX_CONSECUTIVE_DIGITS: 7,
    /** Máximo de caracteres repetidos consecutivos en contraseñas */
    PASSWORD_MAX_CONSECUTIVE_CHARS: 3,
} as const;

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
    BLOOD_DONOR_ME: '/bloodDonor/me',
    HOSPITAL_ME: '/hospital/me',
    ADMIN_ME: '/admin/me',
    LOGOUT: '/auth/logout',
    BLOOD_DONOR_LOGIN: '/auth/bloodDonor/login',
    HOSPITAL_LOGIN: '/auth/hospital/login',
    ADMIN_LOGIN: '/auth/admin/login',
    BLOOD_DONOR_REGISTER: '/auth/bloodDonor/register',
    HOSPITAL_REGISTER: '/auth/hospital/register',
} as const;

// Tipos de usuario
export const USER_TYPES = {
    BLOOD_DONOR: 'bloodDonor',
    HOSPITAL: 'hospital',
    ADMIN: 'admin',
} as const;

// Email patterns para detección de tipo de usuario
export const EMAIL_PATTERNS = {
    ADMIN_DOMAINS: ['@admin.es', '@admin.com'],
} as const;

// Rutas de la aplicación
export const ROUTES = {
    HOME: '/',
    INDEX: '/index',
    LOGIN: '/login',
    REGISTER: '/register',
    REGISTER_BLOOD_DONOR: '/registerbloodDonor',
    REGISTER_HOSPITAL: '/registerHospital',
    DASHBOARD: '/dashboard',
    BLOOD_DONORS: '/bloodDonors',
    HOSPITALS: '/hospitals',
    NOT_FOUND: '*',
} as const;

// Query parameters
export const QUERY_PARAMS = {
    SESSION_EXPIRED: 'expired',
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
    USER_TYPE: 'userType',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

// Configuración de multipart form data
export const HEADERS = {
    MULTIPART_FORM_DATA: {
        'Content-Type': 'multipart/form-data',
    },
} as const;

// Estados de carga y UI
export const UI_STATES = {
    LOADING_TEXT: 'Cargando...',
    PLEASE_WAIT: 'Por favor espere...',
} as const;

// Chart.js configuration
export const CHART_CONFIG = {
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false,
} as const;
