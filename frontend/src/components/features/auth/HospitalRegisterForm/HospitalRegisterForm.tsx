import React from 'react';
import Button from '../../../common/ui/Button/Button';
import FormField from '../../../common/forms/FormField/FormField';
import ImageUpload from "../../../common/forms/ImageUpload/ImageUpload";
import { useHospitalRegister } from '../../../../hooks/useHospitalRegister';

interface HospitalRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
}

const HospitalRegisterForm: React.FC<HospitalRegisterFormProps> = ({ onSuccess, onError }) => {
    const {
        formData,
        errors,
        loading,
        showPassword,
        handleInputChange,
        handleImageChange,
        togglePasswordVisibility,
        register,
        resetForm
    } = useHospitalRegister(onSuccess, onError);

    return (
        <div className="flex flex-col w-full gap-2 lg:gap-4 items-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <ImageUpload onImageChange={handleImageChange} />
            </div>
            <p className="text-body-sm text-gray-500 dark:text-gray-400 text-center my-0">
                El asterisco "*" indica que el dato a introducir es obligatorio
            </p>
            <form
                onSubmit={register}
                className="flex flex-col w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
            >
                <div className="grid grid-cols-1 gap-4 md:gap-6 w-full">
                    <FormField
                        type="text"
                        id="cif"
                        name="cif"
                        label="CIF"
                        value={formData.cif}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.cif}
                        placeholder="Ingrese CIF *"
                    />
                    <FormField
                        type="text"
                        id="name"
                        name="name"
                        label="Nombre"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.name}
                        placeholder="Ingrese nombre *"
                        autoComplete="organization"
                    />
                    <FormField
                        type="text"
                        id="address"
                        name="address"
                        label="Dirección"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.address}
                        placeholder="Ingrese dirección *"
                        autoComplete="street-address"
                    />
                    <FormField
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        label="Código Postal"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        error={errors.postalCode}
                        placeholder="Ingrese código postal *"
                        autoComplete="postal-code"
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
                        placeholder="Ingrese email *"
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
                        placeholder="Ingrese teléfono *"
                        autoComplete="tel"
                    />
                    <div>
                        <FormField
                            type="password"
                            id="password"
                            name="password"
                            label="Contraseña"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            error={errors.password}
                            placeholder="Ingrese contraseña *"
                            showPasswordToggle={true}
                            isPasswordVisible={showPassword}
                            onTogglePassword={togglePasswordVisibility}
                            autoComplete="new-password"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Debe contener: mayúscula, minúscula, número (8-32 caracteres)
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
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </>
                        ) : 'Registrar'}
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 text-body-sm w-full sm:w-48"
                    >
                        Restablecer
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default HospitalRegisterForm;
