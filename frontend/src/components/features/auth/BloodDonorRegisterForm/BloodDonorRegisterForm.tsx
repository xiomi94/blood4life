import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from '../../../common/ui/Button/Button';
import FormField from '../../../common/forms/FormField/FormField';
import SelectField from '../../../common/forms/SelectField/SelectField';
import DatePicker from '../../../common/forms/DatePicker/DatePicker';
import ImageUpload from "../../../common/forms/ImageUpload/ImageUpload";
import { authService } from "../../../../services/authService";

interface BloodDonorRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
}

const BloodDonorRegisterForm: React.FC<BloodDonorRegisterFormProps> = ({ onSuccess, onError }) => {
    const { t } = useTranslation();

    const [dni, setDni] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const genderOptions = [
        { value: '', label: t('auth.register.bloodDonor.genderSelect') },
        { value: 'Masculino', label: t('auth.register.bloodDonor.male') },
        { value: 'Femenino', label: t('auth.register.bloodDonor.female') },
        { value: 'Prefiero no decirlo', label: t('auth.register.bloodDonor.preferNotToSay') }
    ];

    const bloodTypeOptions = [
        { value: '', label: t('auth.register.bloodDonor.bloodTypeSelect') },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!dni) {
            newErrors.dni = t('auth.register.bloodDonor.validation.dniRequired');
        } else if (!/^[0-9]{8}[A-Z]$/.test(dni)) {
            newErrors.dni = t('auth.register.bloodDonor.validation.dniInvalid');
        }

        if (!firstName) {
            newErrors.firstName = t('auth.register.bloodDonor.validation.firstNameRequired');
        } else if (firstName.length < 2) {
            newErrors.firstName = t('auth.register.bloodDonor.validation.firstNameMin');
        }

        if (!lastName) {
            newErrors.lastName = t('auth.register.bloodDonor.validation.lastNameRequired');
        } else if (lastName.length < 2) {
            newErrors.lastName = t('auth.register.bloodDonor.validation.lastNameMin');
        }

        if (!gender) {
            newErrors.gender = t('auth.register.bloodDonor.validation.genderRequired');
        }

        if (!bloodType) {
            newErrors.bloodType = t('auth.register.bloodDonor.validation.bloodTypeRequired');
        }

        if (!email) {
            newErrors.email = t('auth.register.bloodDonor.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t('auth.register.bloodDonor.validation.emailInvalid');
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = t('auth.register.bloodDonor.validation.phoneRequired');
        } else if (!/^\d{9,}$/.test(phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = t('auth.register.bloodDonor.validation.phoneMin');
        }

        if (!dateOfBirth) {
            newErrors.dateOfBirth = t('auth.register.bloodDonor.validation.dateOfBirthRequired');
        } else {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (age < 18) {
                newErrors.dateOfBirth = t('auth.register.bloodDonor.validation.ageMin');
            }
        }

        if (!password) {
            newErrors.password = t('auth.register.bloodDonor.validation.passwordRequired');
        } else if (password.length < 8) {
            newErrors.password = t('auth.register.bloodDonor.validation.passwordMin');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const errorMessages = Object.values(errors).join('\n');
            onError?.(t('auth.register.bloodDonor.validation.fixErrors') + '\n\n' + errorMessages);
            return;
        }

        setLoading(true);

        const bloodTypeMap: { [key: string]: number } = {
            "A+": 1, "A-": 2,
            "B+": 3, "B-": 4,
            "AB+": 5, "AB-": 6,
            "O+": 7, "O-": 8
        };

        const formData = new FormData();
        formData.append("dni", dni);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("gender", gender);
        formData.append("bloodTypeId", bloodTypeMap[bloodType].toString());
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("dateOfBirth", dateOfBirth.split("T")[0]);
        formData.append("password", password);

        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        authService.registerBloodDonor(formData)
            .then((response) => {
                console.log("Registro exitoso:", response.data);
                onSuccess?.(t('auth.register.bloodDonor.success'));
                resetForm();
            })
            .catch((err) => {
                console.error("Error registrando donante:", err);
                onError?.(err.response?.data?.error || t('auth.register.bloodDonor.error'));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const resetForm = () => {
        setDni('');
        setFirstName('');
        setLastName('');
        setGender('');
        setBloodType('');
        setEmail('');
        setPhoneNumber('');
        setDateOfBirth('');
        setPassword('');
        setSelectedImage(null);
        setShowPassword(false);
        setErrors({});
    };

    return (
        <div className="flex flex-col w-full gap-2 lg:gap-4 items-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <ImageUpload onImageChange={setSelectedImage} />
            </div>
            <p className="text-body-sm text-gray-500 dark:text-gray-400 text-center my-0">
                {t('auth.register.requiredField')}
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
            >
                <div className="grid grid-cols-1 gap-4 md:gap-6 w-full">
                    <FormField
                        type="text"
                        id="dni"
                        name="dni"
                        label={t('auth.register.bloodDonor.dni')}
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.dni}
                        placeholder={t('auth.register.bloodDonor.dniPlaceholder')}
                    />

                    <FormField
                        type="text"
                        id="firstName"
                        name="firstName"
                        label={t('auth.register.bloodDonor.firstName')}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.firstName}
                        placeholder={t('auth.register.bloodDonor.firstNamePlaceholder')}
                        autoComplete="given-name"
                    />

                    <FormField
                        type="text"
                        id="lastName"
                        name="lastName"
                        label={t('auth.register.bloodDonor.lastName')}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.lastName}
                        placeholder={t('auth.register.bloodDonor.lastNamePlaceholder')}
                        autoComplete="family-name"
                    />

                    <SelectField
                        id="gender"
                        name="gender"
                        label={t('auth.register.bloodDonor.gender')}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.gender}
                        options={genderOptions}
                    />

                    <SelectField
                        id="bloodType"
                        name="bloodType"
                        label={t('auth.register.bloodDonor.bloodType')}
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.bloodType}
                        options={bloodTypeOptions}
                    />

                    <FormField
                        type="email"
                        id="email"
                        name="email"
                        label={t('auth.register.bloodDonor.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.email}
                        placeholder={t('auth.register.bloodDonor.emailPlaceholder')}
                        autoComplete="email"
                    />

                    <FormField
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        label={t('auth.register.bloodDonor.phone')}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.phoneNumber}
                        placeholder={t('auth.register.bloodDonor.phonePlaceholder')}
                        autoComplete="tel"
                    />

                    <DatePicker
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label={t('auth.register.bloodDonor.dateOfBirth')}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        disabled={loading}
                        error={errors.dateOfBirth}
                        placeholder={t('auth.register.bloodDonor.dateOfBirthPlaceholder')}
                    />

                    <div>
                        <FormField
                            type="password"
                            id="password"
                            name="password"
                            label={t('auth.register.bloodDonor.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            error={errors.password}
                            placeholder={t('auth.register.bloodDonor.passwordPlaceholder')}
                            showPasswordToggle={true}
                            isPasswordVisible={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoComplete="new-password"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {t('auth.register.bloodDonor.passwordHint')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:w-48"
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
                                <span>{t('auth.register.bloodDonor.processing')}</span>
                            </>) : t('auth.register.bloodDonor.registerButton')}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:w-48"
                    >
                        {t('auth.register.bloodDonor.resetButton')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BloodDonorRegisterForm;
