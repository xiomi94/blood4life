import React from "react";
import { useTranslation } from 'react-i18next';
import Button from '../../../common/ui/Button/Button';
import FormField from '../../../common/forms/FormField/FormField';
import SelectField from '../../../common/forms/SelectField/SelectField';
import DatePicker from '../../../common/forms/DatePicker/DatePicker';
import ImageUpload from "../../../common/forms/ImageUpload/ImageUpload";
import { useBloodDonorRegister } from "../../../../hooks/useBloodDonorRegister";

interface BloodDonorRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
}

const BloodDonorRegisterForm: React.FC<BloodDonorRegisterFormProps> = ({ onSuccess, onError }) => {
    const { t } = useTranslation();
    const {
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
    } = useBloodDonorRegister(onSuccess, onError);

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

    return (
        <div className="flex flex-col w-full gap-2 lg:gap-4 items-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <ImageUpload onImageChange={handleImageChange} />
            </div>
            <p className="text-body-sm text-gray-500 dark:text-gray-400 text-center my-0">
                {t('auth.register.requiredField')}
            </p>

            <form
                onSubmit={register}
                className="flex flex-col w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
            >
                <div className="grid grid-cols-1 gap-4 md:gap-6 w-full">
                    <FormField
                        type="text"
                        id="dni"
                        name="dni"
                        label={t('auth.register.bloodDonor.dni')}
                        value={formData.dni}
                        onChange={handleInputChange}
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
                        value={formData.firstName}
                        onChange={handleInputChange}
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
                        value={formData.lastName}
                        onChange={handleInputChange}
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
                        label={t('auth.register.bloodDonor.bloodType')}
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
                        label={t('auth.register.bloodDonor.email')}
                        value={formData.email}
                        onChange={handleInputChange}
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
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
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
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
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
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            error={errors.password}
                            placeholder={t('auth.register.bloodDonor.passwordPlaceholder')}
                            showPasswordToggle={true}
                            isPasswordVisible={showPassword}
                            onTogglePassword={togglePasswordVisibility}
                            autoComplete="new-password"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {t('auth.register.bloodDonor.passwordHint')}
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
                                <span>{t('auth.register.bloodDonor.processing')}</span>
                            </>) : t('auth.register.bloodDonor.registerButton')}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:flex-1 sm:max-w-48"
                    >
                        {t('auth.register.bloodDonor.resetButton')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BloodDonorRegisterForm;
