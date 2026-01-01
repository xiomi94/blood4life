// Validation utility functions for EditProfileModal

export type PasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Regular expressions
const DNI_REGEX = /^[0-9]{8}[A-Za-z]$/;
const CIF_REGEX = /^[A-Za-z0-9]{8,10}$/;
const CIF_START_REGEX = /^[A-Za-z]/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.&()]+$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,#ºª°/:()&]+$/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
const REPEATED_CHARS_REGEX = /(.)\1{4,}/;
const REPEATED_DIGITS_REGEX = /(\d)\1{7,}/;
const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/;
const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/;
const PASSWORD_DIGIT_REGEX = /(?=.*\d)/;
const PASSWORD_WHITESPACE_REGEX = /\s/;
const PASSWORD_REPEATED_REGEX = /(.)\1{3,}/;

/**
 * Validates DNI (Spanish ID) format
 */
export const validateDNI = (value: string): string => {
    if (!value.trim()) return 'El DNI es obligatorio';
    if (!DNI_REGEX.test(value)) return 'Formato de DNI inválido (ej: 12345678A)';
    return '';
};

/**
 * Validates CIF (Spanish company ID) format
 */
export const validateCIF = (value: string): string => {
    if (!value.trim()) return 'El CIF es obligatorio';
    if (!CIF_REGEX.test(value)) return 'El CIF debe tener entre 8 y 10 caracteres alfanuméricos';
    if (!CIF_START_REGEX.test(value)) return 'El CIF debe comenzar con una letra';
    return '';
};

/**
 * Validates name fields (firstName, lastName, name)
 */
export const validateName = (value: string, fieldLabel: string): string => {
    if (!value.trim()) return `El ${fieldLabel} es obligatorio`;
    if (value.trim().length < 2) return `El ${fieldLabel} debe tener al menos 2 caracteres`;
    if (value.trim().length > 100) return `El ${fieldLabel} no puede exceder 100 caracteres`;
    if (!NAME_REGEX.test(value)) return 'Solo puede contener letras, espacios y los caracteres .-&()';
    if (/[0-9]/.test(value)) return 'No puede contener números';
    if (REPEATED_CHARS_REGEX.test(value)) return 'Demasiados caracteres repetidos';
    return '';
};

/**
 * Validates address field
 */
export const validateAddress = (value: string): string => {
    if (!value.trim()) return 'La dirección es obligatoria';
    if (value.trim().length < 10) return 'La dirección debe tener al menos 10 caracteres';
    if (value.trim().length > 200) return 'La dirección no puede exceder 200 caracteres';
    if (!ADDRESS_REGEX.test(value)) return 'La dirección contiene caracteres no válidos';
    if (!/\d/.test(value)) return 'La dirección debe incluir un número';
    return '';
};

/**
 * Validates postal code (Spanish format: 5 digits, province codes 01-52)
 */
export const validatePostalCode = (value: string): string => {
    if (!value.trim()) return 'El código postal es obligatorio';

    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length !== 5) return 'El código postal debe tener exactamente 5 dígitos';

    const provinceCode = parseInt(digitsOnly.substring(0, 2));
    if (provinceCode < 1 || provinceCode > 52) {
        return 'Código postal no válido (debe estar entre 01000 y 52999)';
    }

    if (/^(\d)\1{4}$/.test(digitsOnly)) return 'Código postal no válido';

    return '';
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (value: string): string => {
    if (!value.trim()) return ''; // Phone is optional

    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length < 9) return 'El teléfono debe tener al menos 9 dígitos';
    if (digitsOnly.length > 15) return 'El teléfono no puede tener más de 15 dígitos';
    if (!PHONE_REGEX.test(value)) return 'Formato de teléfono no válido';
    if (REPEATED_DIGITS_REGEX.test(digitsOnly)) return 'Número de teléfono no válido';

    return '';
};

/**
 * Validates current password
 */
export const validateCurrentPassword = (value: string): string => {
    if (!value.trim()) return 'La contraseña actual es obligatoria';
    return '';
};

/**
 * Validates new password with all requirements
 */
export const validateNewPassword = (value: string): string => {
    if (!value.trim()) return 'La contraseña nueva es obligatoria';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (value.length > 32) return 'La contraseña no puede exceder 32 caracteres';
    if (!PASSWORD_LOWERCASE_REGEX.test(value)) return 'Debe contener al menos una minúscula';
    if (!PASSWORD_UPPERCASE_REGEX.test(value)) return 'Debe contener al menos una mayúscula';
    if (!PASSWORD_DIGIT_REGEX.test(value)) return 'Debe contener al menos un número';
    if (PASSWORD_WHITESPACE_REGEX.test(value)) return 'No puede contener espacios';
    if (PASSWORD_REPEATED_REGEX.test(value)) return 'Demasiados caracteres repetidos';
    return '';
};

/**
 * Validates password confirmation
 */
export const validateConfirmPassword = (value: string, newPassword: string): string => {
    if (!value.trim()) return 'Confirma la contraseña nueva';
    if (value !== newPassword) return 'Las contraseñas no coinciden';
    return '';
};

/**
 * Helper function to get field label in Spanish
 */
export const getFieldLabel = (fieldName: string): string => {
    switch (fieldName) {
        case 'firstName':
            return 'nombre';
        case 'lastName':
            return 'apellido';
        case 'name':
            return 'nombre';
        default:
            return fieldName;
    }
};
