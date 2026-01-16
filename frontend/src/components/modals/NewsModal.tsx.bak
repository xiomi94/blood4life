import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isbtService, type IsbtSystem } from '../../services/isbtService';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [systems, setSystems] = useState<IsbtSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<IsbtSystem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setSelectedSystem(null); // Reset selection
      isbtService.getSystems()
        .then(data => setSystems(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

      // Lock body scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- RENDER DETAIL VIEW ---
  if (selectedSystem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedSystem(null)} // Click backdrop returns to list
        ></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col z-50 animate-fadeIn">
          {/* Header with Back Button */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSystem(null)}
                className="mr-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                  {selectedSystem.symbol || selectedSystem.id}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {selectedSystem.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detalle del Sistema Sanguíneo
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Detail Body */}
          <div className="p-8 overflow-y-auto flex-1">
            <div className="space-y-8">

              {/* Description Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Descripción General
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {selectedSystem.description || "No hay descripción detallada disponible para este sistema en este momento."}
                </p>
              </section>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Año de Descubrimiento</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedSystem.yearDiscovered || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Total de Antígenos</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedSystem.antigenCount || "N/A"}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Ubicación Genética</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono text-lg">
                    {selectedSystem.geneLocation || "Desconocida"}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">ID Internacional</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                    ISBT {selectedSystem.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* Clinical Significance */}
              {selectedSystem.clinicalSignificance && (
                <section className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Importancia Clínica
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {selectedSystem.clinicalSignificance}
                  </p>
                </section>
              )}

              {/* External Link */}
              {selectedSystem.url && (
                <div className="pt-4 flex justify-end">
                  <a
                    href={selectedSystem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Ver documentación oficial completa
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER LIST VIEW ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Main Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col z-50 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {t('dashboard.sidebar.news') || 'Noticias ISBT'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actualizaciones de la Base de Datos ISBT 128
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - LIST */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Cargando datos de ISBT...</p>
            </div>
          ) : systems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-medium">No se pudieron cargar las noticias</p>
              <p className="text-sm mt-1">Inténtelo de nuevo más tarde</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {systems.map((system) => (
                <button
                  key={system.id}
                  onClick={() => setSelectedSystem(system)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 text-left w-full"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-lg rounded-lg group-hover:scale-110 transition-transform">
                      {system.symbol || system.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {system.name || `Sistema sanguíneo ${system.id}`}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {system.description || `ID de sistema: ${system.id.toString().padStart(3, '0')}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Leer más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex justify-between items-center text-xs text-gray-400">
          <span>Fuente: ISBT 128 Standard</span>
          <span>{systems.length} registros encontrados</span>
        </div>
      </div>
    </div>
  );
};
