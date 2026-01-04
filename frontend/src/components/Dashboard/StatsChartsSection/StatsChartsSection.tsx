import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { DashboardStats } from '../../../services/dashboardService';
import type { Campaign } from '../../../services/campaignService';
import CampaignsList from '../CampaignsList/CampaignsList';

type ChartType = 'bloodType' | 'gender' | 'campaigns';

interface StatsChartsSectionProps {
    stats: DashboardStats;
    campaigns: Campaign[];
    selectedDate: string | null;
    filteredCampaigns: Campaign[];
    onClearSelectedDate: () => void;
    onEditCampaign: (campaign: Campaign) => void;
    onDeleteCampaign: (campaign: Campaign) => void;
}

const StatsChartsSection: React.FC<StatsChartsSectionProps> = ({
    stats,
    campaigns,
    selectedDate,
    filteredCampaigns,
    onClearSelectedDate,
    onEditCampaign,
    onDeleteCampaign
}) => {
    const { t } = useTranslation();
    const [selectedChart, setSelectedChart] = useState<ChartType>('campaigns');
    const [searchTerm, setSearchTerm] = useState('');

    // Blood Type Chart Data
    const bloodTypeChartData = {
        labels: stats.bloodType.labels,
        datasets: [
            {
                label: 'Número de Donantes',
                data: stats.bloodType.counts,
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const bloodTypeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 12,
                    },
                    padding: 15,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Gender Chart Data
    const genderChartData = {
        labels: stats.gender.labels,
        datasets: [
            {
                label: 'Distribución por Género',
                data: stats.gender.counts,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(107, 114, 128, 0.7)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(107, 114, 128, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const genderOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 12,
                    },
                },
            },
        },
    };

    const campaignsToShow = selectedDate ? filteredCampaigns : campaigns;

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {selectedDate ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('dashboard.stats.selectedCampaigns')}</h2>
                            <button
                                onClick={onClearSelectedDate}
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                            >
                                {t('dashboard.stats.clearFilter')}
                            </button>
                        </>
                    ) : (
                        <select
                            id="chartType"
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                            className="appearance-none pr-8 pl-0 py-1 bg-transparent text-xl font-bold text-gray-800 dark:text-white dark:bg-gray-800 border-none focus:ring-0 focus:outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_-4px_center] bg-no-repeat"
                        >
                            <option value="campaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.campaignsOption')}</option>
                            <option value="bloodType" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.bloodTypeOption')}</option>
                            <option value="gender" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.genderOption')}</option>
                        </select>
                    )}
                </div>
                {selectedChart === 'campaigns' && (
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('dashboard.stats.searchPlaceholder')}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {selectedChart === 'bloodType' && (
                <div className="relative h-[350px] w-full">
                    <Bar data={bloodTypeChartData} options={bloodTypeOptions} />
                </div>
            )}

            {selectedChart === 'gender' && (
                <div className="relative h-[350px] w-full">
                    <Doughnut data={genderChartData} options={genderOptions} />
                </div>
            )}

            {selectedChart === 'campaigns' && (
                <div className="relative h-[400px] w-full">
                    <div
                        className="h-full overflow-y-auto pr-2 pt-2 pb-2 space-y-3 custom-scrollbar"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 transparent'
                        }}
                    >
                        <CampaignsList
                            campaigns={campaignsToShow}
                            searchTerm={searchTerm}
                            selectedDate={selectedDate}
                            onEditCampaign={onEditCampaign}
                            onDeleteCampaign={onDeleteCampaign}
                        />
                    </div>
                    {/* Gradient fade effects */}
                    {campaignsToShow.length > 0 && (
                        <>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white dark:from-gray-800 via-white/90 dark:via-gray-800/90 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white dark:from-gray-800 via-white/90 dark:via-gray-800/90 to-transparent pointer-events-none"></div>
                        </>
                    )}
                </div>
            )}
        </section>
    );
};

export default StatsChartsSection;
