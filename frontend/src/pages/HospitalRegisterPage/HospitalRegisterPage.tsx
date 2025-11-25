import React, {useState, useEffect} from 'react';
import ImageUpload from "../../components/ImageUpload/ImageUpload.tsx";
import Button from '../../components/UI/Button/Button'
import FormField from '../../components/FormField/FormField'

interface Hospital {
  id: number;
  cif: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

interface HospitalFormData {
  cif: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  cif?: string;
  name?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

const HospitalRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<HospitalFormData>({
    cif: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    const hospitalData: Hospital = {
      id: 0,
      cif: '',
      name: '',
      address: '',
      email: '',
      phoneNumber: ''
    };
    setCurrentHospital(hospitalData);
  }, []);

  const validateField = (name: string, value: string): string => {
    // Declaraciones movidas fuera del switch
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof HospitalFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    let sanitizedValue = value;

    switch (name) {
      case 'name':
        sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.&()]/g, '');
        if (sanitizedValue.length > 100) sanitizedValue = sanitizedValue.substring(0, 100);
        break;
      case 'cif':
        sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (sanitizedValue.length > 10) sanitizedValue = sanitizedValue.substring(0, 10);
        break;
      case 'phoneNumber':
        sanitizedValue = value.replace(/[^\d+\-\s()]/g, '');
        if (sanitizedValue.length > 15) sanitizedValue = sanitizedValue.substring(0, 15);
        break;
      case 'email':
        sanitizedValue = value.toLowerCase().replace(/\s/g, '');
        if (sanitizedValue.length > 100) sanitizedValue = sanitizedValue.substring(0, 100);
        break;
      case 'password':
        sanitizedValue = value.replace(/\s/g, '');
        if (sanitizedValue.length > 32) sanitizedValue = sanitizedValue.substring(0, 32);
        break;
      case 'address':
        sanitizedValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,#ºª°/:()&]/g, '');
        sanitizedValue = sanitizedValue.replace(/[.,]{3,}/g, match => match.substring(0, 2));
        sanitizedValue = sanitizedValue.replace(/\s{2,}/g, ' ');
        sanitizedValue = sanitizedValue.replace(/\b\w/g, char => char.toUpperCase());
        if (sanitizedValue.length > 200) sanitizedValue = sanitizedValue.substring(0, 200);
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    const error = validateField(name, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('cif', formData.cif);
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('password', formData.password);

      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      console.log('Registrando hospital:', Object.fromEntries(submitData));
      console.log('Imagen de perfil:', profileImage);

      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Hospital registrado exitosamente');

      setFormData({
        cif: '',
        name: '',
        address: '',
        email: '',
        phoneNumber: '',
        password: ''
      });
      setProfileImage(null);
      setErrors({});

    } catch (error) {
      console.error('Error registrando hospital:', error);
      alert('Error al registrar el hospital');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cif: '',
      name: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
    setProfileImage(null);
    setErrors({});
    setShowPassword(false);
  };

  if (!currentHospital) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-gray-100">
      <div className="flex flex-col w-11/12 max-w-6xl">
        <div className="flex flex-col gap-8 pt-10">
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col p-6 bg-gray-200 rounded-2xl drop-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Registrar nuevo hospital
              </h2>
              <p className="text-gray-600 mb-5">Todos los datos son obligatorios</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
                  placeholder="Ingrese el CIF"
                />
                <div className="flex justify-center">
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
                    placeholder="Ingrese el nombre"
                    containerClass="w-full"
                    labelClass="w-fit"
                  />
                </div>
                <div className="flex flex-row justify-end">
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
                    placeholder="Ingrese la dirección"
                    containerClass="w-full"
                  />
                </div>
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
                />
                <div className="flex justify-center">
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
                    placeholder="Ingrese el teléfono"
                    containerClass="w-full"
                  />
                </div>
                <div className="flex flex-row justify-end">
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
                    placeholder="Ingrese la contraseña"
                    containerClass="w-full"
                    showPasswordToggle={true}
                    isPasswordVisible={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>) : 'Registrar nuevo hospital'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Restablecer
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-row w-full justify-center">
            <ImageUpload onImageChange={setProfileImage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegisterPage;