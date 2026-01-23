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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 gap-3 sm:gap-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#E7000B]/10 dark:bg-[#E7000B]/20 text-[#E7000B] dark:text-[#ff8080] text-xs font-medium rounded-full border border-[#E7000B]/20 shrink-0">
                            <span className="w-1.5 h-1.5 bg-[#E7000B] dark:bg-[#ff8080] rounded-full"></span>
                            {t('dashboard.donations.completed')}
                        </span>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{t('dashboard.donations.campaignLabel')}</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donations.donationType')} O+</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-600 pt-2 sm:pt-0 mt-1 sm:mt-0">
                        <div className="text-left sm:text-right flex-1 sm:flex-none">
                            <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">Hospital Negrín</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Jan 17, 2022</p>
                        </div>
                        <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 gap-3 sm:gap-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#E7000B]/10 dark:bg-[#E7000B]/20 text-[#E7000B] dark:text-[#ff8080] text-xs font-medium rounded-full border border-[#E7000B]/20 shrink-0">
                            <span className="w-1.5 h-1.5 bg-[#E7000B] dark:bg-[#ff8080] rounded-full"></span>
                            {t('dashboard.donations.completed')}
                        </span>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{t('dashboard.donations.campaignLabel')}</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donations.donationType')} A-</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-600 pt-2 sm:pt-0 mt-1 sm:mt-0">
                        <div className="text-left sm:text-right flex-1 sm:flex-none">
                            <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">Hospital Negrín</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Jan 17, 2022</p>
                        </div>
                        <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonationsHistorySection;
