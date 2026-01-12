/**
 * Centralized validation utility functions for the application.
 * Contains regular expressions and validation functions used across different forms.
 */

// Regular expressions
export const DNI_REGEX = /^[0-9]{8}[A-Za-z]$/;
// CIF: 8-10 alphanumeric characters, starts with a letter
export const CIF_REGEX = /^[A-Za-z0-9]{8,10}$/;
export const CIF_START_REGEX = /^[A-Za-z]/;
// Names: Letters, spaces, hyphens, dots, ampersands, parentheses
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.&()]+$/;
// Address: Alphanumeric, spaces, punctuation
export const ADDRESS_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,#ºª°/:()&]+$/;
// Email: Standard email pattern
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone: Optional international code, area code, number
export const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
// Password requirements
export const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/;
export const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/;
export const PASSWORD_DIGIT_REGEX = /(?=.*\d)/;
export const PASSWORD_WHITESPACE_REGEX = /\s/;
export const PASSWORD_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>/?]*$/;

// Common repetitive patterns
export const REPEATED_CHARS_REGEX = /(.)\1{4,}/; // limit for names
export const REPEATED_DIGITS_REGEX = /(\d)\1{7,}/; // limit for phones
export const REPEATED_PASSWORD_CHARS_REGEX = /(.)\1{3,}/; // limit for passwords

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
export const validateName = (value: string, fieldLabel: string = 'nombre'): string => {
    if (!value.trim()) return `El ${fieldLabel} es obligatorio`;
    if (value.trim().length < 2) return `El ${fieldLabel} debe tener al menos 2 caracteres`;
    if (value.trim().length > 100) return `El ${fieldLabel} no puede exceder 100 caracteres`;
    if (!NAME_REGEX.test(value)) return 'Solo puede contener letras, espacios y los caracteres .-&()';
    if (/[0-9]/.test(value)) return 'No puede contener números';
    if (REPEATED_CHARS_REGEX.test(value)) return 'Demasiados caracteres repetidos';
    return '';
};

/**
 * Validates address field with strict checks for street and number availability
 */
export const validateAddress = (value: string): string => {
    if (!value.trim()) return 'La dirección es obligatoria';
    if (value.trim().length < 10) return 'La dirección debe tener al menos 10 caracteres';
    if (value.trim().length > 200) return 'La dirección no puede exceder 200 caracteres';
    if (!ADDRESS_REGEX.test(value)) return 'La dirección contiene caracteres no válidos';
    if (!/\d/.test(value)) return 'La dirección debe incluir un número';

    // Additional strict checks often used in Hospital form
    const lettersOnly = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
    if (lettersOnly.length < 3) return 'La dirección debe contener al menos 3 letras';

    // Check for street name and number presence
    const addressParts = value.trim().split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/);
    const hasStreetAndNumber = addressParts.some(part => /^\d+$/.test(part)) &&
        addressParts.some(part => /[a-zA-Z]{3,}/.test(part));

    // Note: We are being slightly more lenient here than the specific Hospital logic to be generic,
    // but the basics are covered. If very specific logic is needed it can be added.
    if (!hasStreetAndNumber) return 'La dirección debe incluir la calle y el número';

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
 * Validates email address
 */
export const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El email es obligatorio';
    if (value.length > 100) return 'El email no puede exceder 100 caracteres';
    if (/\s/.test(value)) return 'El email no puede contener espacios';
    if (!EMAIL_REGEX.test(value)) return 'El formato del email no es válido';

    const domain = value.split('@')[1];
    if (domain && domain.length < 4) return 'El dominio del email es demasiado corto';

    return '';
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (value: string): string => {
    if (!value.trim()) return 'El teléfono es obligatorio';

    const digitsOnly = value.replace(/\D/g, '');

    // Broad range to cover different requirements (9-15 is standard, 9-12 mostly for local)
    // We will use 9-15 to be safe as per validationUtils, but hospital had 9-12. 
    // Let's use 9-15 to be inclusive.
    if (digitsOnly.length < 9) return 'El teléfono debe tener al menos 9 dígitos';
    if (digitsOnly.length > 15) return 'El teléfono no puede tener más de 15 dígitos';

    if (!PHONE_REGEX.test(value)) return 'Formato de teléfono no válido';
    if (REPEATED_DIGITS_REGEX.test(digitsOnly)) return 'Número de teléfono no válido';

    return '';
};

/**
 * Validates password with complexity requirements
 */
export const validatePassword = (value: string): string => {
    if (!value.trim()) return 'La contraseña es obligatoria';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (value.length > 32) return 'La contraseña no puede exceder 32 caracteres';

    if (!PASSWORD_LOWERCASE_REGEX.test(value)) return 'Debe contener al menos una minúscula';
    if (!PASSWORD_UPPERCASE_REGEX.test(value)) return 'Debe contener al menos una mayúscula';
    if (!PASSWORD_DIGIT_REGEX.test(value)) return 'Debe contener al menos un número';
    if (PASSWORD_WHITESPACE_REGEX.test(value)) return 'No puede contener espacios';

    // Check for special chars if needed (Hospital form checked allowed chars)
    if (!PASSWORD_SPECIAL_CHAR_REGEX.test(value)) return 'La contraseña contiene caracteres no permitidos';

    if (REPEATED_PASSWORD_CHARS_REGEX.test(value)) return 'Demasiados caracteres repetidos';

    return '';
};

/**
 * Validates date of birth for 18+ requirement
 */
export const validateDateOfBirth = (value: string): string => {
    if (!value.trim()) return 'La fecha de nacimiento es obligatoria';

    const birthDate = new Date(value);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return 'Fecha inválida';

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) return 'Debes tener al menos 18 años';

    if (birthDate > today) return 'La fecha no puede ser futura';

    return '';
};

/**
 * Helper to validate a generic required field
 */
export const validateRequired = (value: string, fieldName: string): string => {
    if (!value || !value.trim()) return `El campo ${fieldName} es obligatorio`;
    return '';
};
