import React from 'react';
import { useTranslation } from 'react-i18next';


interface DonationsHistorySectionProps {
    // Props vacías por ahora - datos estáticos en el componente
}

const DonationsHistorySection: React.FC<DonationsHistorySectionProps> = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{t('dashboard.donations.title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('dashboard.donations.subtitle')}
            </p>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t('dashboard.donations.completed')}
                        </span>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">{t('dashboard.donations.campaignLabel')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donations.donationType')} O+</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-800 dark:text-white">Hospital Negrín</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jan 17, 2022</p>
                    </div>
                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t('dashboard.donations.completed')}
                        </span>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">{t('dashboard.donations.campaignLabel')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donations.donationType')} A-</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-800 dark:text-white">Hospital Negrín</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jan 17, 2022</p>
                    </div>
                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DonationsHistorySection;
