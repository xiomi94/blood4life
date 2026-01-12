import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import { useFormPersistence } from './useFormPersistence';
import {
    validateDNI,
    validateName,
    validateRequired,
    validateEmail,
    validatePhoneNumber,
    validateDateOfBirth,
    validatePassword
} from '../utils/validation';

export interface BloodDonorFormData {
    dni: string;
    firstName: string;
    lastName: string;
    gender: string;
    bloodType: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
}

export interface ValidationErrors {
    dni?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    bloodType?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    password?: string;
}

export const useBloodDonorRegister = (
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
) => {
    const { t } = useTranslation();

    // Initial State
    const initialFormState: BloodDonorFormData = {
        dni: '',
        firstName: '',
        lastName: '',
        gender: '',
        bloodType: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        password: ''
    };

    const [formData, setFormData] = useState<BloodDonorFormData>(initialFormState);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Persistence
    const { clearPersistedData } = useFormPersistence(
        'bloodDonorRegistrationForm',
        formData,
        setFormData
    );

    // Logic to validate a single field
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'dni':
                return validateDNI(value) ? t('auth.register.bloodDonor.validation.dniInvalid') : '';
            case 'firstName':
                return validateName(value, 'nombre') ? t('auth.register.bloodDonor.validation.firstNameMin') : '';
            case 'lastName':
                return validateName(value, 'apellido') ? t('auth.register.bloodDonor.validation.lastNameMin') : '';
            case 'gender':
                return validateRequired(value, 'género');
            case 'bloodType':
                return validateRequired(value, 'tipo de sangre');
            case 'email':
                return validateEmail(value) ? t('auth.register.bloodDonor.validation.emailInvalid') : '';
            case 'phoneNumber':
                return validatePhoneNumber(value) ? t('auth.register.bloodDonor.validation.phoneMin') : '';
            case 'dateOfBirth':
                const dobError = validateDateOfBirth(value);
                if (dobError === 'Debes tener al menos 18 años') return t('auth.register.bloodDonor.validation.ageMin');
                if (dobError === 'La fecha no puede ser futura') return t('auth.register.bloodDonor.validation.dateFuture');
                return dobError;
            case 'password':
                return validatePassword(value) ? t('auth.register.bloodDonor.validation.passwordMin') : '';
            default:
                return '';
        }
    };

    // Validar todo el formulario
    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        // Validación explícita de cada campo
        const dniError = validateField('dni', formData.dni);
        if (dniError) newErrors.dni = dniError;

        const firstNameError = validateField('firstName', formData.firstName);
        if (firstNameError) newErrors.firstName = firstNameError;

        const lastNameError = validateField('lastName', formData.lastName);
        if (lastNameError) newErrors.lastName = lastNameError;

        const genderError = validateField('gender', formData.gender);
        if (genderError) newErrors.gender = genderError;

        const bloodTypeError = validateField('bloodType', formData.bloodType);
        if (bloodTypeError) newErrors.bloodType = bloodTypeError;

        const emailError = validateField('email', formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validateField('phoneNumber', formData.phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;

        const dobError = validateField('dateOfBirth', formData.dateOfBirth);
        if (dobError) newErrors.dateOfBirth = dobError;

        const passwordError = validateField('password', formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return newErrors;
    };

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleImageChange = (file: File | null) => {
        setSelectedImage(file);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        clearPersistedData();
        setFormData(initialFormState);
        setSelectedImage(null);
        setErrors({});
        setShowPassword(false);
    };

    // Función de registro
    const register = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validar
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            const errorMessages = Object.values(formErrors).map(err => `• ${err}`).join('\n');
            onError?.(`${t('auth.register.bloodDonor.validation.fixErrors')}\n\n${errorMessages}`);
            return;
        }

        setLoading(true);

        // Mapa para convertir el string de sangre a ID numérico (backend lo requiere así)
        const bloodTypeMap: Record<string, number> = {
            "A+": 1, "A-": 2, "B+": 3, "B-": 4,
            "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
        };

        // 2. Preparar datos para enviar
        const submitData = new FormData();
        submitData.append("dni", formData.dni);
        submitData.append("firstName", formData.firstName);
        submitData.append("lastName", formData.lastName);
        submitData.append("gender", formData.gender);
        // Usamos el mapa para obtener el ID
        submitData.append("bloodTypeId", bloodTypeMap[formData.bloodType].toString());
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);

        // Campos opcionales
        if (formData.phoneNumber) {
            submitData.append("phoneNumber", formData.phoneNumber);
        }

        // Formato de fecha (sólo YYYY-MM-DD)
        if (formData.dateOfBirth) {
            submitData.append("dateOfBirth", formData.dateOfBirth.split("T")[0]);
        }

        if (selectedImage) {
            submitData.append("image", selectedImage);
        }

        try {
            // 3. Enviar al backend
            const response = await authService.registerBloodDonor(submitData);
            console.log("Registro exitoso:", response.data);

            // 4. Limpiar y éxito
            clearPersistedData();
            onSuccess?.(t('auth.register.bloodDonor.success'));
            resetForm();
        } catch (err: any) {
            console.error("Error registrando donante:", err);
            onError?.(err.response?.data?.error || t('auth.register.bloodDonor.error'));
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
        handleSelectChange,
        handleImageChange,
        togglePasswordVisibility,
        register,
        resetForm
    };
};
