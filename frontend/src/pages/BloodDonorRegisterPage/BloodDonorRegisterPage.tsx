import ImageUpload from "../../components/ImageUpload/ImageUpload.tsx";
import React, {useEffect, useState} from "react";
import Button from '../../components/Button/Button'

interface BloodDonor {
  id?: number,
  dni: string,
  firstName: string,
  lastName: string,
  gender: string,
  bloodtype: string,
  email: string,
  phoneNumber: string,
  dateOfBirth: string,
  password?: string
}

interface BloodDonorFormData {
  dni: string,
  firstName: string,
  lastName: string,
  gender: string,
  bloodtype: string,
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
  bloodtype?: string;
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
    bloodtype: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentBloodDonor, setCurrentBloodDonor] = useState<BloodDonor | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const bloodDonorData: BloodDonor = {
      id: 1,
      dni: '54136071M',
      firstName: 'Xiomara',
      lastName: 'Jiménez Velázquez',
      gender: 'Femenino',
      bloodtype: '0+',
      email: 'xiomarajimenezvelazquez@alumno.ieselrincon.es',
      phoneNumber: '658663494',
      dateOfBirth: '',
      password: ''
    };
    setCurrentBloodDonor(bloodDonorData);

    setFormData({
      dni: bloodDonorData.dni,
      firstName: bloodDonorData.firstName,
      lastName: bloodDonorData.lastName,
      gender: bloodDonorData.gender,
      bloodtype: bloodDonorData.bloodtype,
      email: bloodDonorData.email,
      phoneNumber: bloodDonorData.phoneNumber,
      dateOfBirth: bloodDonorData.dateOfBirth,
      password: bloodDonorData.password || ''
    });
  }, []);

  // Función de validación simplificada como la de tu compañero
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

      case 'bloodtype':
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real como la de tu compañero
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor, corrige los errores en el formulario');
      return;
    }

    if (!currentBloodDonor) {
      alert('No hay datos del donante disponibles');
      return;
    }

    setLoading(true);

    try {
      // Crear FormData como lo hace tu compañero
      const submitData = new FormData();
      submitData.append('dni', formData.dni);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('gender', formData.gender);
      submitData.append('bloodtype', formData.bloodtype);
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('dateOfBirth', formData.dateOfBirth);

      if (formData.password) {
        submitData.append('password', formData.password);
      }

      console.log('Actualizando donante:', Object.fromEntries(submitData));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentBloodDonor(prev => prev ? {
        ...prev,
        dni: formData.dni,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        bloodtype: formData.bloodtype,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password
      } : null);

      alert('Datos del donante actualizados exitosamente');
    } catch (error) {
      console.error('Error actualizando donante:', error);
      alert('Error al actualizar los datos del donante');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (currentBloodDonor) {
      setFormData({
        dni: currentBloodDonor.dni,
        firstName: currentBloodDonor.firstName,
        lastName: currentBloodDonor.lastName,
        gender: currentBloodDonor.gender,
        bloodtype: currentBloodDonor.bloodtype,
        email: currentBloodDonor.email,
        phoneNumber: currentBloodDonor.phoneNumber,
        dateOfBirth: currentBloodDonor.dateOfBirth,
        password: ''
      });
    }
    setShowPassword(false);
    setErrors({});
  };

  if (!currentBloodDonor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando datos del donante...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center bg-gray-100 min-h-screen">
      <div className="flex flex-col w-11/12 max-w-6xl">

        {/* Sección Superior: Formulario e Imagen - Estilo simplificado como el de tu compañero */}
        <div className="flex flex-col gap-8 pt-10">

          {/* Formulario */}
          <div className="flex-1">
            <form
              onSubmit={handleUpdate}
              className="flex flex-col p-6 bg-gray-200 rounded-2xl drop-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Gestionar datos del donante
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

                {/* DNI */}
                <div className="w-full">
                  <label htmlFor="dni" className="block text-md font-bold text-black mb-1">
                    DNI
                  </label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.dni ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el DNI *"
                    maxLength={9}
                  />
                  {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="firstName" className="block text-md font-bold text-black mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el nombre *"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="lastName" className="block text-md font-bold text-black mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese los apellidos *"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="gender" className="block text-md font-bold text-black mb-1">
                    Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione un género *</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="prefiero-no-decir">Prefiero no decirlo</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="bloodtype" className="block text-md font-bold text-black mb-1">
                    Tipo de sangre
                  </label>
                  <select
                    id="bloodtype"
                    name="bloodtype"
                    value={formData.bloodtype}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.bloodtype ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione un tipo de sangre *</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="0+">0+</option>
                    <option value="0-">0-</option>
                  </select>
                  {errors.bloodtype && <p className="text-red-500 text-sm mt-1">{errors.bloodtype}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="email" className="block text-md font-bold text-black mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el email *"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="phoneNumber" className="block text-md font-bold text-black mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el teléfono *"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="dateOfBirth" className="block text-md font-bold text-black mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div className="w-full">
                  <label htmlFor="password" className="block text-md font-bold text-black mb-1">
                    Contraseña
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow pr-10 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese la contraseña *"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                               stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        ) : (
                          <svg className="h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>) : 'Actualizar datos'}
                </Button>
                <Button type="button" onClick={resetForm} disabled={loading}>
                  Restablecer
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-row w-full justify-center">
            <ImageUpload
              onImageChange={(file: File | null) => {
                console.log("Imagen seleccionada:", file);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodDonorRegisterPage;