import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Logo from '../../assets/images/LogoShadow.webp';
import Button from '../../components/UI/Button/Button';

function NotFoundPage() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    // Auto-redirect after 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col lg:flex-row flex-grow w-full items-center justify-center gap-6 sm:gap-10 md:gap-20 lg:gap-40 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gray-100">
            {/* Logo - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
                <img
                    className="w-48 h-auto xl:w-100"
                    src={Logo}
                    alt="Blood4Life Logo"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center w-full max-w-3xl">
                <div className="text-center">
                    {/* Error Message */}
                    <div className="mb-6 sm:mb-8 md:mb-10">
                        <h2 className="text-h3 sm:text-h2 md:text-h1 text-gray-800 mb-3 sm:mb-4">
                            Vaya... parece que algo salió mal
                        </h2>
                        <p className="text-body-sm sm:text-body md:text-body-lg text-gray-500 max-w-lg mx-auto">
                            No te preocupes, será redirigido a la página principal en{' '}
                            <span className="font-semibold text-blue-600">{countdown}</span> segundos.
                        </p>
                    </div>

                    {/* Additional Help */}
                    <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 border-t border-gray-300">
                        <p className="flex flex-col items-center justify-center gap-4 text-body-sm sm:text-body md:text-body-lg text-gray-600 max-w-md mx-auto">
                            O si lo prefieres, puedes{' '}
                            <Button
                                onClick={() => navigate(-1)}
                                className="font-medium cursor-pointer"
                            >
                                Volver a la página anterior
                            </Button>
                        </p>
                    </div>

                    {/* Mobile Logo - Only visible on mobile */}
                    <div className="lg:hidden mt-8 sm:mt-10 flex justify-center opacity-30">
                        <img
                            className="w-32 h-auto sm:w-40"
                            src={Logo}
                            alt="Blood4Life Logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
