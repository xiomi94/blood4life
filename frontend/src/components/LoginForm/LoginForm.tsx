import { Link } from 'react-router';
import Button from '../../components/UI/Button/Button';
import FormField from '../../components/FormField/FormField';
import { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de login:', formData);
  };

  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-6 md:px-0">
      <form
        className="flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 gap-4 sm:gap-6"
        onSubmit={handleSubmit}
      >
        {/* Título */}
        <h2 className="font-poppins font-bold text-h3 sm:text-h2 text-gray-800 text-center mb-4">
          Iniciar sesión
        </h2>

        {/* Username */}
        <FormField
          type="text"
          id="username"
          name="username"
          label="Nombre de usuario"
          value={formData.username}
          onChange={handleInputChange}
          required
          placeholder="Ingrese su nombre de usuario"
          containerClass="mb-2"
          labelClass="text-sm sm:text-base"
          autoComplete="username"
        />

        {/* Password */}
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

        {/* Botón enviar */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-6 sm:px-8 py-2 sm:py-3 text-body w-auto sm:w-auto sm:max-w-64"
          >
            Enviar
          </Button>
        </div>

        {/* Link registro */}
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
