/**
 * Utilidades para detección y gestión de tipos de usuario
 * Siguiendo el principio de Responsabilidad Única (SRP)
 */

import { EMAIL_PATTERNS } from '../constants/app.constants';
import type { UserType } from '../types/common.types';

/**
 * Detecta si un email pertenece a un administrador
 * basándose en el dominio del email
 */
export const isAdminEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const normalizedEmail = email.toLowerCase().trim();

    return EMAIL_PATTERNS.ADMIN_DOMAINS.some(domain =>
        normalizedEmail.endsWith(domain.toLowerCase())
    );
};

/**
 * Detecta el tipo de usuario basándose en el email
 * Si el email termina en dominios de admin, retorna 'admin'
 * De lo contrario, retorna el tipo por defecto proporcionado
 */
export const detectUserTypeFromEmail = (
    email: string,
    defaultType: UserType = 'bloodDonor'
): UserType => {
    return isAdminEmail(email) ? 'admin' : defaultType;
};

/**
 * Obtiene el endpoint correspondiente al tipo de usuario
 */
export const getUserEndpoint = (userType: UserType): string => {
    const endpoints: Record<UserType, string> = {
        bloodDonor: '/bloodDonor/me',
        hospital: '/hospital/me',
        admin: '/admin/me',
    };

    return endpoints[userType];
};

/**
 * Obtiene el endpoint de login correspondiente al tipo de usuario
 */
export const getLoginEndpoint = (userType: UserType): string => {
    return `/auth/${userType}/login`;
};

/**
 * Valida que el tipo de usuario sea válido
 */
export const isValidUserType = (value: unknown): value is UserType => {
    return (
        value === 'bloodDonor' ||
        value === 'hospital' ||
        value === 'admin'
    );
};

/**
 * Obtiene el nombre legible del tipo de usuario
 */
export const getUserTypeLabel = (userType: UserType): string => {
    const labels: Record<UserType, string> = {
        bloodDonor: 'Donante de Sangre',
        hospital: 'Hospital',
        admin: 'Administrador',
    };

    return labels[userType];
};
