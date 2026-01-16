import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/LogoShadowMini.webp";
import Button from "../../components/common/ui/Button/Button";
import FormField from "../../components/common/forms/FormField/FormField";
import { toast } from 'sonner';

const LdapLoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const authHeader = 'Basic ' + btoa(username + ':' + password);

        try {
            const response = await fetch('http://localhost:8080/api/auth/admin/ldap-login', {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });

            const data = await response.json();

            if (response.ok) {
                // Extract JWT token from response if present
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                toast.success('Login exitoso');
                // Success - redirect to admin dashboard
                navigate('/dashboard');
            } else {
                const errorMsg = data.message || data.error || 'Error de autenticación';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = 'Error de conexión con el servidor';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto"
                />
            </div>

            {/* Formulario */}
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center w-full px-4 sm:px-6 md:px-0">
                    <form
                        className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 gap-4 sm:gap-6"
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

                        <FormField
                            type="text"
                            id="username"
                            name="username"
                            label="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="admin@admin.es"
                            containerClass="mb-2"
                            labelClass="text-sm sm:text-base"
                            autoComplete="username"
                            aria-invalid={!!error}
                        />

                        <FormField
                            type="password"
                            id="password"
                            name="password"
                            label="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu contraseña"
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
                                {isLoading ? 'Autenticando...' : 'Ingresar'}
                            </Button>
                        </div>

                        <div className="text-center mt-2">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-200">
                                Herramienta de gestión LDAP interna
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LdapLoginPage;
