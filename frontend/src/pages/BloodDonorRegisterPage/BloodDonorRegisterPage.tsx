import ImageUpload from "../../components/ImageUpload/ImageUpload.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '../../components/UI/Button/Button.tsx'
import FormField from '../../components/FormField/FormField';
import SelectField from '../../components/SelectField/SelectField';

interface BloodDonorFormData {
  dni: string,
  firstName: string,
  lastName: string,
  gender: string,
  bloodType: string,
  email: string,
  phoneNumber: string,
  dateOfBirth: string,
  password?: string
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

const BloodDonorRegisterPage: React.FC = () => {
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
    { value: '0+', label: '0+' },
    { value: '0-', label: '0-' }
  ];

  useEffect(() => {

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
  }, []);


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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof BloodDonorFormData] as string);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    if (!validateForm()) {
      alert('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const bloodTypeMap: { [key: string]: number } = {
        'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4,
        'AB+': 5, 'AB-': 6, '0+': 7, '0-': 8
      };

      const submitData = new FormData();
      submitData.append('dni', formData.dni);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('gender', formData.gender);
      submitData.append('bloodTypeId', bloodTypeMap[formData.bloodType].toString());
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      if (formData.password) submitData.append('password', formData.password);

      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      const response = await axios.post('http://localhost:8080/api/auth/bloodDonor/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del backend:', response.data);
      alert('Donante registrado correctamente');
      resetForm();
      setSelectedImage(null);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error('Error registrando donante:', error);
      alert(error.response?.data?.error || 'Error al registrar los datos del donante');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    <div className="flex flex-col w-full h-full items-center bg-gray-100 min-h-screen">
      <div className="flex flex-col w-11/12 max-w-6xl">
        <div className="flex flex-col gap-8 pt-10">
          <div className="flex-1">
            <form
              onSubmit={handleRegister}
              className="flex flex-col p-6 bg-gray-200 rounded-2xl drop-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Registro de Donante
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

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
                  containerClass="w-full"
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
                  containerClass="w-full"
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
                  containerClass="w-full"
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
                  containerClass="w-full"
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
                  containerClass="w-full"
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
                  containerClass="w-full"
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
                  containerClass="w-full"
                />


                <FormField
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Fecha de Nacimiento"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  error={errors.dateOfBirth}
                  containerClass="w-full"
                />


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
                  containerClass="w-full"
                  showPasswordToggle={true}
                  isPasswordVisible={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
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
                    </>) : 'Registrarse'}
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
            <ImageUpload
              onImageChange={(file: File | null) => {
                setSelectedImage(file);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodDonorRegisterPage;