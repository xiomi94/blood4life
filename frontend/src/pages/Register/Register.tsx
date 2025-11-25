import React from 'react';
import {Link} from 'react-router-dom';
import Button from '../../components/UI/Button/Button'

const Register: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center mb-12">
        <h1 className="w-2text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Bienvenido a Blood4Life
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Selecciona tu perfil para continuar con el registro en nuestra plataforma
        </p>
      </div>
      <div className="flex flex-row gap-8 mb-12 justify-center items-start w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 w-auto">
          <div className="flex flex-col items-center">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Soy Donante
            </h2>
            <Button to="/registerbloodDonor">
              Registrarme como Donante
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 w-auto">
          <div className="flex flex-col items-center">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Soy Hospital / Centro
            </h2>
            <Button to="/registerhospital">
              Registrarme como Hospital
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          ¿Ya tiene una cuenta? Click {" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer text-sm"
          >
            aquí
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;