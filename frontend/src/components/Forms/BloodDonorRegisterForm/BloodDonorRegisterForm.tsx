import React, { useState } from "react";
import Button from '../../UI/Button/Button';
import FormField from '../FormField/FormField';
import SelectField from '../SelectField/SelectField';
import DatePicker from '../../UI/DatePicker/DatePicker';
import ImageUpload from "../../ImageUpload/ImageUpload";
import { authService } from "../../../services/authService";
import { useFormPersistence } from "../../../hooks/useFormPersistence";

interface BloodDonorFormData {
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

interface ValidationErrors {
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

interface BloodDonorRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
}

const BloodDonorRegisterForm: React.FC<BloodDonorRegisterFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState<BloodDonorFormData>({
        dni: '',
        firstName: '',
        lastName: '',
        gender: '',
        bloodType: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        password: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { clearPersistedData } = useFormPersistence(
        'bloodDonorRegistrationForm',
        formData,
        setFormData
    );

    const genderOptions = [
        { value: '', label: 'Seleccione un género *' },
        { value: 'masculino', label: 'Masculino' },
        { value: 'femenino', label: 'Femenino' },
        { value: 'prefiero-no-decir', label: 'Prefiero no decirlo' }
    ];

    const bloodTypeOptions = [
        { value: '', label: 'Seleccione un tipo de sangre *' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'dni':
                if (!value.trim()) return 'El DNI es obligatorio';
                if (!/^[0-9]{8}[A-Z]$/.test(value)) return 'Formato de DNI inválido (8 números + 1 letra)';
                return '';

            case 'firstName':
                if (!value.trim()) return 'El nombre es obligatorio';
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
                return '';

            case 'lastName':
                if (!value.trim()) return 'Los apellidos son obligatorios';
                if (value.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
                return '';

            case 'gender':
                if (!value.trim()) return 'El género es obligatorio';
                return '';

            case 'bloodType':
                if (!value.trim()) return 'El tipo de sangre es obligatorio';
                return '';

            case 'email':
                if (!value.trim()) return 'El email es obligatorio';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del email no es válido';
                return '';

            case 'phoneNumber': {
                if (!value.trim()) return 'El teléfono es obligatorio';
                const digitsOnly = value.replace(/\D/g, '');
                if (digitsOnly.length < 9) return 'El teléfono debe tener al menos 9 dígitos';
                return '';
            }

            case 'dateOfBirth': {
                if (!value.trim()) return 'La fecha de nacimiento es obligatoria';
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    if (age - 1 < 18) return 'Debes ser mayor de 18 años';
                } else {
                    if (age < 18) return 'Debes ser mayor de 18 años';
                }

                if (birthDate > today) return 'La fecha no puede ser futura';
                return '';
            }

            case 'password':
                if (!value.trim()) return 'La contraseña es obligatoria';
                if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
                return '';

            default:
                return '';
        }
    };

    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof BloodDonorFormData] as string);
            if (error) {
                newErrors[key as keyof ValidationErrors] = error;
            }
        });

        setErrors(newErrors);
        return newErrors;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            const errorMessages = Object.values(formErrors).map(err => `• ${err}`).join('\n');
            onError?.(`Por favor, corrige los siguientes errores:\n\n${errorMessages}`);
            return;
        }

        setLoading(true);
        const bloodTypeMap: Record<string, number> = {
            "A+": 1, "A-": 2,
            "B+": 3, "B-": 4,
            "AB+": 5, "AB-": 6,
            "O+": 7, "O-": 8
        };

        const submitData = new FormData();
        submitData.append("dni", formData.dni);
        submitData.append("firstName", formData.firstName);
        submitData.append("lastName", formData.lastName);
        submitData.append("gender", formData.gender);
        submitData.append("bloodTypeId", bloodTypeMap[formData.bloodType].toString());
        submitData.append("email", formData.email);

        if (formData.phoneNumber) {
            submitData.append("phoneNumber", formData.phoneNumber);
        }

        if (formData.dateOfBirth) {
            submitData.append("dateOfBirth", formData.dateOfBirth.split("T")[0]);
        }

        submitData.append("password", formData.password);

        if (selectedImage) {
            submitData.append("image", selectedImage);
        }

        authService.registerBloodDonor(submitData)
            .then((response) => {
                console.log("Registro exitoso:", response.data);
                onSuccess?.('El donante ha sido registrado correctamente. Ahora puedes iniciar sesión.');
                clearPersistedData();
                resetForm();
                setSelectedImage(null);
            })
            .catch((err) => {
                console.error("Error registrando donante:", err);
                onError?.(err.response?.data?.error || 'Ocurrió un error al registrar el donante. Por favor, inténtalo de nuevo.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const resetForm = () => {
        clearPersistedData();
        setFormData({
            dni: '',
            firstName: '',
            lastName: '',
            gender: '',
            bloodType: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            password: ''
        });
        setShowPassword(false);
        setErrors({});
    };

    return (
        <div className="flex flex-col w-full gap-2 lg:gap-4 items-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <ImageUpload
                    onImageChange={(file: File | null) => {
                        setSelectedImage(file);
                    }}
                />
            </div>
            <p className="text-body-sm text-gray-500 dark:text-gray-400 text-center my-0">
                El asterisco "*" indica que el dato a introducir es obligatorio
            </p>

            <form
                onSubmit={handleRegister}
                className="flex flex-col w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
                style={{ transition: 'background-color 0.3s ease-in-out' }}
            >
                <div className="grid grid-cols-1 gap-4 md:gap-6 w-full">
                    <FormField
                        type="text"
                        id="dni"
                        name="dni"
                        label="DNI"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.dni}
                        placeholder="Ingrese el DNI *"
                    />

                    <FormField
                        type="text"
                        id="firstName"
                        name="firstName"
                        label="Nombre"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.firstName}
                        placeholder="Ingrese el nombre *"
                        autoComplete="given-name"
                    />

                    <FormField
                        type="text"
                        id="lastName"
                        name="lastName"
                        label="Apellidos"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.lastName}
                        placeholder="Ingrese los apellidos *"
                        autoComplete="family-name"
                    />

                    <SelectField
                        id="gender"
                        name="gender"
                        label="Género"
                        value={formData.gender}
                        onChange={handleSelectChange}
                        required
                        disabled={loading}
                        error={errors.gender}
                        options={genderOptions}
                    />

                    <SelectField
                        id="bloodType"
                        name="bloodType"
                        label="Tipo de sangre"
                        value={formData.bloodType}
                        onChange={handleSelectChange}
                        required
                        disabled={loading}
                        error={errors.bloodType}
                        options={bloodTypeOptions}
                    />

                    <FormField
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.email}
                        placeholder="Ingrese el email *"
                        autoComplete="email"
                    />

                    <FormField
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Teléfono"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.phoneNumber}
                        placeholder="Ingrese el teléfono *"
                        autoComplete="tel"
                    />

                    <DatePicker
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label="Fecha de Nacimiento"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                            // The DatePicker returns {target: {name, value}}
                            handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                        required
                        disabled={loading}
                        error={errors.dateOfBirth}
                        placeholder="Seleccione la fecha de nacimiento *"
                    />

                    <div>
                        <FormField
                            type="password"
                            id="password"
                            name="password"
                            label="Contraseña"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            error={errors.password}
                            placeholder="Ingrese la contraseña *"
                            showPasswordToggle={true}
                            isPasswordVisible={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoComplete="new-password"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Debe contener: mayúscula, minúscula, número (8-32 caracteres)
                        </p>
                    </div>
                </div>

                <div className="flex flex-row justify-center sm:flex-row gap-3 mt-8">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:flex-1 sm:max-w-48"
                        aria-busy={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </>) : 'Registrarse'}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:flex-1 sm:max-w-48"
                    >
                        Restablecer
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BloodDonorRegisterForm;
