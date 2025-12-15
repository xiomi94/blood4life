import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../../services/authService';
import ImageUpload from "../../components/ImageUpload/ImageUpload.tsx";
import Button from '../../components/UI/Button/Button';
import FormField from '../../components/FormField/FormField';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import Modal from '../../components/Modal/Modal';

interface Hospital {
  id: number;
  cif: string;
  name: string;
  address: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
}

interface HospitalFormData {
  cif: string;
  name: string;
  address: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  cif?: string;
  name?: string;
  address?: string;
  postalCode?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

const HospitalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HospitalFormData>({
    cif: '',
    name: '',
    address: '',
    postalCode: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Persist form data in localStorage
  const { clearPersistedData } = useFormPersistence(
    'hospitalRegistrationForm',
    formData,
    setFormData
  );

  useEffect(() => {
    const hospitalData: Hospital = { id: 0, cif: '', name: '', address: '', postalCode: '', email: '', phoneNumber: '' };
    setCurrentHospital(hospitalData);
  }, []);

  const validateField = (name: string, value: string): string => {
    let words: string[];
    let addressParts: string[];
    let hasStreetAndNumber: boolean;
    let lettersOnly: string;
    let isValidFormat: boolean;
    const digitsOnly = value.replace(/\D/g, '');
    const commonPatterns = [
      /^(Calle|Avenida|Av\.|Plaza|Paseo|Camino|Travesía|C\/)\s+[a-zA-Z]/,
      /^[a-zA-Z]+\s+[a-zA-Z]+\s+\d+/,
      /^\d+\s+[a-zA-Z]+/,
      /^[a-zA-Z]+\s+\d+/,
    ];
    let domain: string | undefined;

    switch (name) {
      case 'cif':
        if (!value.trim()) return 'El CIF es obligatorio';
        if (!/^[A-Za-z0-9]{8,10}$/.test(value)) return 'El CIF debe tener entre 8 y 10 caracteres alfanuméricos';
        if (!/^[A-Za-z]/.test(value)) return 'El CIF debe comenzar con una letra';
        return '';

      case 'name':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.&()]+$/.test(value)) return 'El nombre solo puede contener letras, espacios y los caracteres .-&()';
        if (/[0-9]/.test(value)) return 'El nombre no puede contener números';
        if (/[@#~€¬]/.test(value)) return 'El nombre contiene caracteres no válidos';
        if (/(.)\1{4,}/.test(value)) return 'Demasiados caracteres repetidos';
        return '';

      case 'address':
        if (!value.trim()) return 'La dirección es obligatoria';
        if (value.trim().length < 10) return 'La dirección debe tener al menos 10 caracteres';
        if (value.trim().length > 200) return 'La dirección no puede exceder 200 caracteres';
        if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,#ºª°/:()&]+$/.test(value)) return 'La dirección contiene caracteres no válidos';
        if (!/\d/.test(value)) return 'La dirección debe incluir un número';
        words = value.trim().split(/\s+/).filter(word => /[a-zA-Z]{3,}/.test(word));
        if (words.length === 0) return 'La dirección debe incluir el nombre de una calle válido';
        addressParts = value.trim().split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/);
        hasStreetAndNumber = addressParts.some(part => /^\d+$/.test(part)) &&
          addressParts.some(part => /[a-zA-Z]{3,}/.test(part));
        if (!hasStreetAndNumber) return 'La dirección debe incluir tanto el nombre de la calle como el número';
        if (/[.,]{3,}/.test(value)) return 'Demasiados caracteres especiales consecutivos';
        lettersOnly = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
        if (lettersOnly.length < 3) return 'La dirección debe contener al menos 3 letras';
        isValidFormat = commonPatterns.some(pattern => pattern.test(value.trim()));
        if (!isValidFormat) return 'Formato de dirección no reconocido. Ejemplos: "Calle Mayor 123", "Av. Constitución 45"';
        return '';

      case 'postalCode':
        if (!value.trim()) return 'El código postal es obligatorio';
        if (digitsOnly.length !== 5) return 'El código postal debe tener exactamente 5 dígitos';
        const provinceCode = parseInt(digitsOnly.substring(0, 2));
        if (provinceCode < 1 || provinceCode > 52) return 'Código postal no válido (debe estar entre 01000 y 52999)';
        if (/^(\d)\1{4}$/.test(digitsOnly)) return 'Código postal no válido';
        return '';

      case 'email':
        if (!value.trim()) return 'El email es obligatorio';
        if (value.length > 100) return 'El email no puede exceder 100 caracteres';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del email no es válido';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'El formato del email no es válido';
        if (value.includes(' ')) return 'El email no puede contener espacios';
        domain = value.split('@')[1];
        if (domain && domain.length < 4) return 'El dominio del email es demasiado corto';
        return '';

      case 'phoneNumber':
        if (!value.trim()) return 'El teléfono es obligatorio';
        if (digitsOnly.length < 9) return 'El teléfono debe tener al menos 9 dígitos';
        if (digitsOnly.length > 12) return 'El teléfono no puede tener más de 12 dígitos';
        if (!/^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(value)) return 'Formato de teléfono no válido';
        if (/(\d)\1{7,}/.test(digitsOnly)) return 'Número de teléfono no válido';
        return '';

      case 'password':
        if (!value.trim()) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (value.length > 32) return 'La contraseña no puede exceder 32 caracteres';
        if (!/(?=.*[a-z])/.test(value)) return 'La contraseña debe contener al menos una minúscula';
        if (!/(?=.*[A-Z])/.test(value)) return 'La contraseña debe contener al menos una mayúscula';
        if (!/(?=.*\d)/.test(value)) return 'La contraseña debe contener al menos un número';
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>/?]*$/.test(value)) return 'La contraseña contiene caracteres no permitidos';
        if (/\s/.test(value)) return 'La contraseña no puede contener espacios';
        if (/(.)\1{3,}/.test(value)) return 'Demasiados caracteres repetidos';
        return '';

      default:
        return '';
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof HospitalFormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      const errorMessages = Object.values(formErrors).map(err => `• ${err}`).join('\n');
      showModal(
        'Formulario incompleto',
        `Por favor, corrige los siguientes errores:\n\n${errorMessages}`,
        'error'
      );
      return;
    }
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, val]) => submitData.append(key, val));
      if (profileImage) submitData.append('image', profileImage);

      await authService.registerHospital(submitData);

      clearPersistedData();
      showModal(
        '¡Hospital registrado!',
        'El hospital ha sido registrado exitosamente. Ahora puedes iniciar sesión.',
        'success'
      );
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Error al registrar hospital';
      showModal(
        'Error en el registro',
        errorMessage,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    clearPersistedData();
    setFormData({ cif: '', name: '', address: '', postalCode: '', email: '', phoneNumber: '', password: '' });
    setProfileImage(null);
    setErrors({});
    setShowPassword(false);
  };

  if (!currentHospital) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-flex items-center text-body-lg">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-roboto text-body-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-grow items-center bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 py-6">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
      <div className="w-full max-w-6xl flex flex-col gap-6 md:gap-8">
        {/* Título */}
        <div className="text-center">
          <h2 className="font-poppins font-semibold text-h3 sm:text-h2 md:text-h1 text-gray-800 mb-2">
            Registrar nuevo hospital
          </h2>
          <p className="font-roboto text-caption sm:text-body-sm md:text-body text-gray-500">
            Todos los datos son obligatorios
          </p>
        </div>
        <div className="flex flex-col w-full gap-6 lg:gap-12 items-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <ImageUpload onImageChange={setProfileImage} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-4xl bg-white rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8"
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
                placeholder="Ingrese CIF"
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
                placeholder="Ingrese nombre"
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
                placeholder="Ingrese dirección"
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
                placeholder="Ingrese código postal"
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
                placeholder="Ingrese email"
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
                placeholder="Ingrese teléfono"
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
                  placeholder="Ingrese contraseña"
                  showPasswordToggle={true}
                  isPasswordVisible={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-gray-500">
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
                className="px-6 py-3 text-body-sm w-full sm:flex-1 sm:max-w-48"
              >
                Restablecer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default HospitalRegisterPage;
