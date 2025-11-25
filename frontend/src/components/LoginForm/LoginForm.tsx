import {Link} from 'react-router-dom';
import Button from '../../components/UI/Button/Button.tsx';
import FormField from '../../components/FormField/FormField.tsx';
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
    // Lógica de login aquí
    console.log('Datos de login:', formData);
  };

  return (
    <div className="flex w-4/12 justify-center items-center">
      <form
        className="flex flex-col w-full bg-white rounded-2xl shadow-xl p-8 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row w-full justify-center mb-2">
          <p className="text-h2 font-bold text-gray-800 text-center">
            Iniciar sesión
          </p>
        </div>
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
          labelClass="text-body"
          autoComplete="username"
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
          labelClass="text-body"
          showPasswordToggle={true}
          isPasswordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          autoComplete="current-password"
        />
        <div className="flex flex-row w-full justify-center mt-6 mb-4">
          <Button
            type="submit"
            className="px-8 py-3 text-body"
          >
            Enviar
          </Button>
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            ¿No tiene una cuenta? Regístrate haciendo click {" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer text-sm"
            >
              aquí
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

export default LoginForm;