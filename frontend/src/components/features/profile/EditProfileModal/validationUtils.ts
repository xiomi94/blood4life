// Validation utility functions for EditProfileModal
// Re-exporting from centralized validation or adapting where necessary
import {
    validateDNI as centralValidateDNI,
    validateCIF as centralValidateCIF,
    validateName as centralValidateName,
    validateAddress as centralValidateAddress,
    validatePostalCode as centralValidatePostalCode,
    validatePhoneNumber as centralValidatePhoneNumber,
    validatePassword as centralValidateNewPassword
} from '../../../../utils/validation';

export type PasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Validates DNI (Spanish ID) format
 */
export const validateDNI = centralValidateDNI;

/**
 * Validates CIF (Spanish company ID) format
 */
export const validateCIF = centralValidateCIF;

/**
 * Validates name fields (firstName, lastName, name)
 */
export const validateName = centralValidateName;

/**
 * Validates address field
 */
export const validateAddress = centralValidateAddress;

/**
 * Validates postal code (Spanish format: 5 digits, province codes 01-52)
 */
export const validatePostalCode = centralValidatePostalCode;

/**
 * Validates phone number
 */
export const validatePhoneNumber = centralValidatePhoneNumber;

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
    return centralValidateNewPassword(value);
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
