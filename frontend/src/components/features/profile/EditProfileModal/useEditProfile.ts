import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { validateDNI, validateCIF, validateName, validateAddress, validatePhoneNumber, validatePostalCode, getFieldLabel } from './validationUtils';
import { useImageUpload } from './useImageUpload';
import { usePasswordChange } from './usePasswordChange';

export const useEditProfile = (onClose: () => void) => {
    const { user, userType, refreshUser } = useAuth();
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Integrate other hooks
    const imageUpload = useImageUpload(user);
    const passwordChange = usePasswordChange(userType);

    // Pre-fill form
    useEffect(() => {
        if (user && userType) {
            setFormData({
                ...user,
                bloodTypeId: user.bloodType?.id || '',
            });
        }
    }, [user, userType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (userType === 'bloodDonor') {
            newErrors.dni = validateDNI(formData.dni || '');
            newErrors.firstName = validateName(formData.firstName || '', getFieldLabel('firstName'));
            newErrors.lastName = validateName(formData.lastName || '', getFieldLabel('lastName'));
            newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber || '');
        } else if (userType === 'hospital') {
            newErrors.cif = validateCIF(formData.cif || '');
            newErrors.name = validateName(formData.name || '', getFieldLabel('name'));
            newErrors.address = validateAddress(formData.address || '');
            newErrors.postalCode = validatePostalCode(formData.postalCode || '');
            newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber || '');
        } else if (userType === 'admin') {
            if (!formData.email) {
                newErrors.email = 'El correo electrónico es obligatorio';
            }
        }

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (hasErrors) {
            setErrors(newErrors);
            setMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario' });
        }

        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        if (passwordChange.showPasswordFields && passwordChange.passwordData.currentPassword && passwordChange.passwordData.newPassword) {
            if (!passwordChange.validatePasswords()) {
                setLoading(false);
                setMessage({ type: 'error', text: 'Por favor, corrige los errores en la contraseña' });
                return;
            }
        }

        try {
            const formDataToSend = new FormData();

            if (userType === 'bloodDonor') {
                formDataToSend.append('dni', formData.dni || '');
                formDataToSend.append('firstName', formData.firstName || '');
                formDataToSend.append('lastName', formData.lastName || '');
                formDataToSend.append('gender', formData.gender || '');
                formDataToSend.append('bloodTypeId', formData.bloodTypeId?.toString() || formData.bloodType?.id?.toString() || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
                if (formData.dateOfBirth) {
                    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
                }
            } else if (userType === 'hospital') {
                formDataToSend.append('cif', formData.cif || '');
                formDataToSend.append('name', formData.name || '');
                formDataToSend.append('address', formData.address || '');
                formDataToSend.append('postalCode', formData.postalCode || '');
                formDataToSend.append('email', formData.email || '');
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
            } else if (userType === 'admin') {
                formDataToSend.append('email', formData.email || '');
            }

            if (imageUpload.imageFile && userType !== 'admin') {
                formDataToSend.append('image', imageUpload.imageFile);
            }

            const endpoint = userType === 'bloodDonor'
                ? `/bloodDonor/${user?.id}`
                : userType === 'hospital'
                    ? `/hospital?id=${user?.id}`
                    : `/admin/me`;

            await axiosInstance.put(endpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });

            if (passwordChange.showPasswordFields && passwordChange.passwordData.currentPassword && passwordChange.passwordData.newPassword) {
                try {
                    await passwordChange.changePassword();
                    setMessage({ type: 'success', text: 'Perfil y contraseña actualizados correctamente' });
                } catch (passwordError: any) {
                    console.error('Password change error:', passwordError);
                    setMessage({
                        type: 'error',
                        text: passwordError.response?.data?.error || 'Error al cambiar la contraseña'
                    });
                    setLoading(false);
                    return;
                }
            }

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente. Actualizando...' });

            setTimeout(async () => {
                try {
                    await refreshUser();
                    onClose();
                } catch (refreshError) {
                    console.error('Error refreshing user data:', refreshError);
                    window.location.reload();
                }
            }, 1000);
        } catch (error: any) {
            console.error('Update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Error al actualizar el perfil'
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userType,
        formData,
        errors,
        loading,
        message,
        imageUpload,
        passwordChange,
        handleInputChange,
        handleSubmit,
        setMessage
    };
};
