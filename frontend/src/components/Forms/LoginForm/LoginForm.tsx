import { Link, useNavigate } from 'react-router';
import Button from '../../UI/Button/Button';
import FormField from '../FormField/FormField';
import { useState, useCallback } from 'react';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useFormPersistence } from '../../../hooks/useFormPersistence';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'bloodDonor' as 'bloodDonor' | 'hospital' | 'admin'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persist form data in localStorage (excluding password for security)
  const { clearPersistedData } = useFormPersistence(
    'loginForm',
    formData,
    setFormData,
    ['password'] // Exclude password from persistence
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-detect admin based on email
    if (name === 'username') {
      if (value.endsWith('@admin.es')) {
        setFormData(prev => ({ ...prev, username: value, userType: 'admin' }));
      } else {
        // If not admin email, ensure userType is not admin
        if (formData.userType === 'admin') {
          setFormData(prev => ({ ...prev, username: value, userType: 'bloodDonor' }));
        }
      }
    }
  }, [formData.userType]);

  const handleUserTypeChange = useCallback((userType: 'bloodDonor' | 'hospital' | 'admin') => {
    setFormData(prev => ({
      ...prev,
      userType
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(formData.username, formData.password, formData.userType);
      login(formData.userType);

      clearPersistedData();
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-6 md:px-0">
      <form
        className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 gap-4 sm:gap-6"
        style={{ transition: 'background-color 0.3s ease-in-out' }}
        onSubmit={handleSubmit}
        aria-busy={isLoading}
      >
        <h2 className="font-poppins font-bold text-h3 sm:text-h2 text-gray-800 dark:text-white text-center mb-4">
          Iniciar sesión
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span>{error}</span>
          </div>
        )}

        <fieldset className="mb-2">
          <legend className="sr-only">Tipo de usuario</legend>
          <div className="flex justify-center gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="userType"
                value="bloodDonor"
                checked={formData.userType === 'bloodDonor'}
                onChange={() => handleUserTypeChange('bloodDonor')}
                disabled={formData.username.endsWith('@admin.es')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Donante</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="userType"
                value="hospital"
                checked={formData.userType === 'hospital'}
                onChange={() => handleUserTypeChange('hospital')}
                disabled={formData.username.endsWith('@admin.es')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Hospital</span>
            </label>
          </div>
        </fieldset>

        <FormField
          type="email"
          id="username"
          name="username"
          label="Correo electrónico"
          value={formData.username}
          onChange={handleInputChange}
          required
          placeholder="Ingrese su correo"
          containerClass="mb-2"
          labelClass="text-sm sm:text-base"
          autoComplete="email"
          aria-invalid={!!error}
        />

        <FormField
          type="password"
          id="password"
          name="password"
          label="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder="Ingrese su contraseña"
          containerClass="mb-4"
          labelClass="text-sm sm:text-base"
          showPasswordToggle={true}
          isPasswordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          autoComplete="current-password"
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-6 sm:px-8 py-2 sm:py-3 text-body w-full sm:w-auto sm:max-w-64 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Enviar'}
          </Button>
        </div>

        <div className="text-center mt-2">
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-200">
            ¿No tiene una cuenta? Regístrate haciendo click{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              aquí
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
