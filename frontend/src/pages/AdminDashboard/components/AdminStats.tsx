import { useTranslation } from 'react-i18next';
import type { DashboardStats } from '../../../services/dashboardService';

interface AdminStatsProps {
    stats: DashboardStats | null;
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
    const { t } = useTranslation();

    if (!stats) return null;

    const totalDonors = stats.totalUsers.counts[0] || 0;
    const totalHospitals = stats.totalUsers.counts[1] || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto w-full">
            {/* Tarjeta de Total Donantes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t('dashboard.admin.stats.totalDonors')}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {totalDonors}
                </p>
            </div>

            {/* Tarjeta de Total Hospitales */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {t('dashboard.admin.stats.totalHospitals')}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {totalHospitals}
                </p>
            </div>
        </div>
    );
};
