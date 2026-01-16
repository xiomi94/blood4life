import { useState } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import { validateCurrentPassword, validateNewPassword, validateConfirmPassword, type PasswordData } from './validationUtils';
import type { UserType } from '../../../../types/common.types';

interface UsePasswordChangeReturn {
    passwordData: PasswordData;
    passwordErrors: Partial<Record<keyof PasswordData, string>>;
    showPasswordFields: boolean;
    setShowPasswordFields: (show: boolean) => void;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    validatePasswords: () => boolean;
    changePassword: () => Promise<void>;
}

/**
 * Obtiene el endpoint de cambio de contraseña según el tipo de usuario
 */
const getPasswordChangeEndpoint = (userType: UserType): string => {
    const endpoints: Record<UserType, string> = {
        bloodDonor: '/bloodDonor/change-password',
        hospital: '/hospital/change-password',
        admin: '/admin/change-password',
    };
    return endpoints[userType];
};

/**
 * Custom hook for managing password change functionality
 * - Handles password input state and validation
 * - Manages password change API call
 * - 100% shared between donor and hospital (only endpoint differs)
 */
export const usePasswordChange = (userType: UserType | null): UsePasswordChangeReturn => {
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordData, string>>>({});
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });

        // Clear error when user starts typing again
        if (passwordErrors[name as keyof PasswordData]) {
            setPasswordErrors({ ...passwordErrors, [name]: '' });
        }
    };

    const validatePasswords = (): boolean => {
        const errors: Partial<Record<keyof PasswordData, string>> = {
            currentPassword: validateCurrentPassword(passwordData.currentPassword),
            newPassword: validateNewPassword(passwordData.newPassword),
            confirmPassword: validateConfirmPassword(passwordData.confirmPassword, passwordData.newPassword)
        };

        const hasErrors = Object.values(errors).some(error => error !== '');

        if (hasErrors) {
            setPasswordErrors(errors);
        }

        return !hasErrors;
    };

    const changePassword = async () => {
        if (!userType) {
            throw new Error('User type is required for password change');
        }

        const passwordFormData = new FormData();
        passwordFormData.append('currentPassword', passwordData.currentPassword);
        passwordFormData.append('newPassword', passwordData.newPassword);

        const endpoint = getPasswordChangeEndpoint(userType);
        await axiosInstance.post(endpoint, passwordFormData);
    };

    return {
        passwordData,
        passwordErrors,
        showPasswordFields,
        setShowPasswordFields,
        handlePasswordChange,
        validatePasswords,
        changePassword
    };
};
