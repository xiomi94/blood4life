import React from 'react';

interface DonationConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  onConfirm,
  onCancel,
  loading
}) => {
  return (
    <div className="p-8 flex flex-col items-center text-center space-y-8 animate-fade-in">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Información Importante
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
          Una vez programada la cita tendrás un tiempo de espera hasta poder donar de nuevo:
        </p>
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 inline-block text-left">
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span><strong>3 meses</strong> para los hombres</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span><strong>4 meses</strong> para las mujeres</span>
            </li>
          </ul>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-6">
          ¿Estás de acuerdo con estas condiciones?
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-md pt-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
        >
          Volver
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirmando...
            </>
          ) : (
            'Sí, acepto'
          )}
        </button>
      </div>
    </div>
  );
};
