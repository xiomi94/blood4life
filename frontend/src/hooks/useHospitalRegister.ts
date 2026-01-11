import { useState } from 'react';
import { authService } from '../services/authService';
import { useFormPersistence } from './useFormPersistence';
import {
    validateCIF,
    validateName,
    validateAddress,
    validatePostalCode,
    validateEmail,
    validatePhoneNumber,
    validatePassword
} from '../utils/validation';

export interface HospitalFormData {
    cif: string;
    name: string;
    address: string;
    postalCode: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface FormErrors {
    cif?: string;
    name?: string;
    address?: string;
    postalCode?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
}

export const useHospitalRegister = (
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
) => {
    const initialFormState: HospitalFormData = {
        cif: '',
        name: '',
        address: '',
        postalCode: '',
        email: '',
        phoneNumber: '',
        password: ''
    };

    const [formData, setFormData] = useState<HospitalFormData>(initialFormState);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { clearPersistedData } = useFormPersistence(
        'hospitalRegistrationForm',
        formData,
        setFormData
    );

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'cif':
                return validateCIF(value);
            case 'name':
                return validateName(value, 'nombre');
            case 'address':
                return validateAddress(value);
            case 'postalCode':
                return validatePostalCode(value);
            case 'email':
                return validateEmail(value);
            case 'phoneNumber':
                return validatePhoneNumber(value);
            case 'password':
                return validatePassword(value);
            default:
                return '';
        }
    };

    // Validamos todo el formulario antes de enviar
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        // Validamos cada campo uno por uno
        const cifError = validateCIF(formData.cif);
        if (cifError) newErrors.cif = cifError;

        const nameError = validateName(formData.name, 'nombre');
        if (nameError) newErrors.name = nameError;

        const addressError = validateAddress(formData.address);
        if (addressError) newErrors.address = addressError;

        const postalCodeError = validatePostalCode(formData.postalCode);
        if (postalCodeError) newErrors.postalCode = postalCodeError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return newErrors;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleImageChange = (file: File | null) => {
        setProfileImage(file);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        clearPersistedData();
        setFormData(initialFormState);
        setProfileImage(null);
        setErrors({});
        setShowPassword(false);
    };

    // Función para enviar el registro
    const register = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validamos
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            // Si hay errores, construimos un mensaje y no enviamos
            const errorMessages = Object.values(formErrors).map(err => `• ${err}`).join('\n');
            onError?.(`Por favor, corrige los siguientes errores:\n\n${errorMessages}`);
            return;
        }

        setLoading(true);
        try {
            // 2. Preparamos los datos (FormData porque hay imagen)
            const submitData = new FormData();
            submitData.append('cif', formData.cif);
            submitData.append('name', formData.name);
            submitData.append('address', formData.address);
            submitData.append('postalCode', formData.postalCode);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('password', formData.password);

            if (profileImage) {
                submitData.append('image', profileImage);
            }

            // 3. Enviamos al servidor
            await authService.registerHospital(submitData);

            // 4. Limpiamos y avisamos
            clearPersistedData();
            onSuccess?.('El hospital ha sido registrado exitosamente. Ahora puedes iniciar sesión.');
            resetForm();
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.error || 'Error al registrar hospital';
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        showPassword,
        handleInputChange,
        handleImageChange,
        togglePasswordVisibility,
        register,
        resetForm
    };
};
