import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Button from '../../components/UI/Button/Button';

const Register: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      {/* Título */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="font-poppins font-bold text-h3 sm:text-h2 md:text-h1 text-gray-800 mb-4">
          Bienvenido a Blood4Life
        </h1>
        <p className="font-roboto text-body-sm sm:text-body-lg md:text-body text-gray-600 max-w-2xl mx-auto">
          Selecciona tu perfil para continuar con el registro en nuestra plataforma
        </p>
      </div>

      {/* Tarjetas */}
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-start'} gap-4 sm:gap-6 md:gap-8 mb-8 w-full max-w-6xl justify-center`}>
        {/* Donante */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 w-full sm:w-5/12 lg:w-1/3 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="font-poppins font-bold text-body-lg sm:text-h3 text-gray-800 mb-4 sm:mb-8">
            Soy Donante
          </h2>
          <Button to="/registerbloodDonor" className="flex items-center justify-center">
            Registrarme como Donante
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>

        {/* Hospital */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 w-full sm:w-5/12 lg:w-1/3 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="font-poppins font-bold text-body-lg sm:text-h3 text-gray-800 mb-4 sm:mb-8">
            Soy Hospital / Centro
          </h2>
          <Button to="/registerhospital" className="flex items-center justify-center">
            Registrarme como Hospital
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>


      {/* Link a login */}
      <div className="text-center mt-4">
        <span className="font-roboto text-caption sm:text-body-sm text-gray-600">
          ¿Ya tiene una cuenta? Click{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            aquí
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
