export const DNI_REGEX = /^[0-9]{8}[A-Za-z]$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/;
export const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/;
export const PASSWORD_DIGIT_REGEX = /(?=.*\d)/;
export const PASSWORD_WHITESPACE_REGEX = /\s/;
export const PASSWORD_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>/?]*$/;
export const REPEATED_PASSWORD_CHARS_REGEX = /(.)\1{3,}/;

export const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El email es obligatorio';
    if (value.length > 100) return 'El email no puede exceder 100 caracteres';
    if (/\s/.test(value)) return 'El email no puede contener espacios';
    if (!EMAIL_REGEX.test(value)) return 'El formato del email no es válido';
    const domain = value.split('@')[1];
    if (domain && domain.length < 4) return 'El dominio del email es demasiado corto';
    return '';
};

export const validateDNI = (value: string): string => {
    if (!value.trim()) return 'El DNI es obligatorio';
    if (!DNI_REGEX.test(value)) return 'Formato de DNI inválido (ej: 12345678A)';
    return '';
};

export const validatePassword = (value: string): string => {
    if (!value.trim()) return 'La contraseña es obligatoria';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (value.length > 32) return 'La contraseña no puede exceder 32 caracteres';
    if (!PASSWORD_LOWERCASE_REGEX.test(value)) return 'Debe contener al menos una minúscula';
    if (!PASSWORD_UPPERCASE_REGEX.test(value)) return 'Debe contener al menos una mayúscula';
    if (!PASSWORD_DIGIT_REGEX.test(value)) return 'Debe contener al menos un número';
    if (PASSWORD_WHITESPACE_REGEX.test(value)) return 'No puede contener espacios';
    if (!PASSWORD_SPECIAL_CHAR_REGEX.test(value)) return 'La contraseña contiene caracteres no permitidos';
    if (REPEATED_PASSWORD_CHARS_REGEX.test(value)) return 'Demasiados caracteres repetidos';
    return '';
};

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
