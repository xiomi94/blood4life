import { Link, useNavigate } from 'react-router';
import Button from '../../components/UI/Button/Button';
import FormField from '../../components/FormField/FormField';
import { useState, useCallback } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [userType, setUserType] = useState<'bloodDonor' | 'hospital' | 'admin'>('bloodDonor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(formData.username, formData.password, userType);
      login(userType);

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
        className="flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 gap-4 sm:gap-6"
        onSubmit={handleSubmit}
        aria-busy={isLoading}
      >
        <h2 className="font-poppins font-bold text-h3 sm:text-h2 text-gray-800 text-center mb-4">
          Iniciar sesión
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
            aria-live="assertive"
          >
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="userType"
              value="bloodDonor"
              checked={userType === 'bloodDonor'}
              onChange={() => setUserType('bloodDonor')}
            />
            <span className="ml-2 text-gray-700">Donante</span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="userType"
              value="hospital"
              checked={userType === 'hospital'}
              onChange={() => setUserType('hospital')}
            />
            <span className="ml-2 text-gray-700">Hospital</span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="userType"
              value="admin"
              checked={userType === 'admin'}
              onChange={() => setUserType('admin')}
            />
            <span className="ml-2 text-gray-700">Admin</span>
          </label>
        </div>

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
          <span className="text-sm sm:text-base text-gray-600">
            ¿No tiene una cuenta? Regístrate haciendo click{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 underline"
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
