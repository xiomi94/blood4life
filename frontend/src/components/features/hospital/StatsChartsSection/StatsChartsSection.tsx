import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../../../context/ThemeContext';
import type { Campaign } from '../../../../services/campaignService';
import type { DashboardStats } from '../../../../services/dashboardService';
import CampaignsList from '../CampaignsList/CampaignsList';

type ChartType = 'bloodType' | 'gender' | 'myCampaigns' | 'allCampaigns' | 'completedCampaigns';

interface StatsChartsSectionProps {
    stats: DashboardStats;
    campaigns: Campaign[];
    onToggleAllCampaigns: (value: boolean) => void;
    selectedDate: string | null;
    filteredCampaigns: Campaign[];
    onClearSelectedDate: () => void;
    onEditCampaign: (campaign: Campaign) => void;
    onDeleteCampaign: (campaign: Campaign) => void;
}

const StatsChartsSection: React.FC<StatsChartsSectionProps> = ({
    stats,
    campaigns,
    onToggleAllCampaigns,
    selectedDate,
    filteredCampaigns,
    onClearSelectedDate,
    onEditCampaign,
    onDeleteCampaign
}) => {
    const { t } = useTranslation();
    const [selectedChart, setSelectedChart] = useState<ChartType>('myCampaigns');
    const [searchTerm, setSearchTerm] = useState('');

    // Handle chart type change and update campaign filter
    const handleChartChange = (newChart: ChartType) => {
        setSelectedChart(newChart);
        if (newChart === 'myCampaigns') {
            onToggleAllCampaigns(false);
        } else if (newChart === 'allCampaigns' || newChart === 'completedCampaigns') {
            onToggleAllCampaigns(true); // Completed campaigns are typically viewed from "All" history, or maybe just "My"?
            // User requirement: "mostrar en el card de campañas... campañas realizadas"
            // Usually "Completed" implies history. If the user wants ONLY THEIR completed, we might need a flag.
            // But usually "All" vs "My" is one toggle.
            // Let's assume 'completedCampaigns' fetches/uses ALL campaigns to filter from, OR respects the current user context?
            // The user said: "Hay una opción (por defecto) en el que se muestran las campañas hechas por el propio usuario... Hay una opción... total de campañas... opción más... campañas realizadas".
            // It seems "Completed" is a sibling to "My" and "All".
            // Let's assume "Completed" shows "My" completed campaigns if we follow "My Campaigns" logic, or maybe "All".
            // Given the context of "Dashboard", usually you want to see YOUR history.
            // But if "All Campaigns" shows everyone's, "Completed" might typically show everyone's too?
            // To be safe, let's keep `showAllCampaigns` as true for 'completedCampaigns' to ensure we have the candidate set, 
            // BUT actually, we probably want "My Completed" vs "All Completed"?
            // The user didn't specify. I will assume "All Completed" for now as it's a separate category in the list.
            // Actually, if I toggle `onToggleAllCampaigns(true)`, `campaigns` prop will contain ALL campaigns.
        }
    };

    // Filter campaigns based on logic:
    // Active: EndDate >= Today - 7 days
    // Completed: EndDate < Today - 7 days
    // Filtramos las campañas según lo que el usuario haya seleccionado (activas, completadas o una fecha)
    let displayCampaigns = campaigns; // Por defecto mostramos las que vienen

    if (selectedDate) {
        displayCampaigns = filteredCampaigns; // Si hay fecha, priorizamos eso
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Hace una semana para considerar 'completadas' vs 'activas' reciente
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        // Lógica simple de filtrado
        if (selectedChart === 'completedCampaigns') {
            displayCampaigns = campaigns.filter(c => {
                const endDate = new Date(c.endDate);
                return endDate < oneWeekAgo;
            });
        } else if (selectedChart === 'myCampaigns' || selectedChart === 'allCampaigns') {
            displayCampaigns = campaigns.filter(c => {
                const endDate = new Date(c.endDate);
                return endDate >= oneWeekAgo;
            });
        }
    }

    const { isDarkMode } = useTheme();
    const textColor = isDarkMode ? '#ffffff' : '#374151'; // White for dark mode, Gray-700 for light mode

    const [bloodTypeGenderFilter, setBloodTypeGenderFilter] = useState<string>('all');

    // Process Blood Type Data to ensure all types are shown in specific order
    const orderedBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    // Calculate counts based on filter
    // Calculamos los datos del gráfico de tipos de sangre
    // Lo hacemos cada vez que renderiza (más simple que usar useMemo)
    let finalBloodTypeCounts: number[] = [];

    if (bloodTypeGenderFilter === 'all' || !stats.breakdown) {
        // Datos normales si no hay filtro
        const map = new Map<string, number>();
        stats.bloodType.labels.forEach((label, index) => {
            map.set(label, stats.bloodType.counts[index]);
        });
        finalBloodTypeCounts = orderedBloodTypes.map(type => map.get(type) || 0);
    } else {
        // Filtramos por género usando breakdown
        const map = new Map<string, number>();
        stats.breakdown
            .filter(item => item.gender === bloodTypeGenderFilter)
            .forEach(item => {
                const current = map.get(item.bloodType) || 0;
                map.set(item.bloodType, current + item.count);
            });
        finalBloodTypeCounts = orderedBloodTypes.map(type => map.get(type) || 0);
    }

    const finalBloodTypeLabels = orderedBloodTypes;

    // Blood Type Chart Data
    const bloodTypeChartData = {
        labels: finalBloodTypeLabels,
        datasets: [
            {
                label: 'Número de Donantes',
                data: finalBloodTypeCounts,
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
                    color: textColor,
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
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: textColor,
                    stepSize: 1, // Ensure integer steps for counts
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: textColor
                }
            },
        },
    };

    // Gender Chart Data
    const genderColors: { [key: string]: string } = {
        'Masculino': 'rgba(59, 130, 246, 0.7)', // Blue
        'Femenino': 'rgba(236, 72, 153, 0.7)', // Pink
        'Prefiero no decirlo': 'rgba(107, 114, 128, 0.7)' // Gray
    };

    const genderBorderColors: { [key: string]: string } = {
        'Masculino': 'rgba(59, 130, 246, 1)',
        'Femenino': 'rgba(236, 72, 153, 1)',
        'Prefiero no decirlo': 'rgba(107, 114, 128, 1)'
    };

    const genderChartData = {
        labels: stats.gender.labels,
        datasets: [
            {
                label: 'Distribución por Género',
                data: stats.gender.counts,
                backgroundColor: stats.gender.labels.map(label => genderColors[label] || 'rgba(156, 163, 175, 0.7)'),
                borderColor: stats.gender.labels.map(label => genderBorderColors[label] || 'rgba(156, 163, 175, 1)'),
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
                    color: textColor,
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {selectedDate ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('dashboard.stats.selectedCampaigns')}</h2>
                            <button
                                onClick={onClearSelectedDate}
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                            >
                                {t('dashboard.stats.clearFilter')}
                            </button>
                        </>
                    ) : (
                        <select
                            id="chartType"
                            value={selectedChart}
                            onChange={(e) => handleChartChange(e.target.value as ChartType)}
                            className="appearance-none pr-8 pl-0 py-1 bg-transparent text-xl font-bold text-gray-800 dark:text-white dark:bg-gray-800 border-none focus:ring-0 focus:outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_-4px_center] bg-no-repeat"
                        >
                            <option value="myCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.myCampaigns')}</option>
                            <option value="allCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.allCampaigns')}</option>
                            <option value="completedCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.completedCampaigns')}</option>
                            <option value="bloodType" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.bloodTypeOption')}</option>
                            <option value="gender" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.genderOption')}</option>
                        </select>
                    )}
                </div>
                {(selectedChart === 'myCampaigns' || selectedChart === 'allCampaigns' || selectedChart === 'completedCampaigns') && (
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('dashboard.stats.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

            <div key={selectedChart} className="animate-fade-in w-full">
                {selectedChart === 'bloodType' && (
                    <div className="relative h-[450px] w-full flex flex-col">
                        <div className="flex flex-wrap justify-end gap-2 mb-2">
                            <button
                                onClick={() => setBloodTypeGenderFilter('all')}
                                className={`px - 2 py - 1 text - xs font - medium rounded - md transition - colors ${bloodTypeGenderFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} `}
                            >
                                {t('dashboard.stats.allGenders')}
                            </button>
                            <button
                                onClick={() => setBloodTypeGenderFilter('Masculino')}
                                className={`px - 2 py - 1 text - xs font - medium rounded - md transition - colors ${bloodTypeGenderFilter === 'Masculino' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} `}
                            >
                                {t('dashboard.stats.male')}
                            </button>
                            <button
                                onClick={() => setBloodTypeGenderFilter('Femenino')}
                                className={`px - 2 py - 1 text - xs font - medium rounded - md transition - colors ${bloodTypeGenderFilter === 'Femenino' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} `}
                            >
                                {t('dashboard.stats.female')}
                            </button>
                            <button
                                onClick={() => setBloodTypeGenderFilter('Prefiero no decirlo')}
                                className={`px - 2 py - 1 text - xs font - medium rounded - md transition - colors ${bloodTypeGenderFilter === 'Prefiero no decirlo' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} `}
                            >
                                {t('dashboard.stats.preferNotToSay')}
                            </button>
                        </div>
                        <div className="flex-1 relative w-full min-h-0">
                            <Bar data={bloodTypeChartData} options={bloodTypeOptions} />
                        </div>
                    </div>
                )}

                {selectedChart === 'gender' && (
                    <div className="relative h-[450px] w-full flex items-center justify-center">
                        <div className="h-full w-full">
                            <Doughnut data={genderChartData} options={genderOptions} />
                        </div>
                    </div>
                )}

                {(selectedChart === 'myCampaigns' || selectedChart === 'allCampaigns' || selectedChart === 'completedCampaigns') && (
                    <div className="relative h-[450px] w-full">
                        <div
                            className="h-full overflow-y-auto pr-2 pt-2 pb-2 space-y-3 custom-scrollbar"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#cbd5e1 transparent'
                            }}
                        >
                            {displayCampaigns.length > 0 ? (
                                <CampaignsList
                                    campaigns={displayCampaigns}
                                    searchTerm={searchTerm}
                                    selectedDate={selectedDate}
                                    onEditCampaign={onEditCampaign}
                                    onDeleteCampaign={onDeleteCampaign}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                                    {searchTerm
                                        ? t('dashboard.campaigns.noResults')
                                        : selectedDate
                                            ? t('dashboard.campaigns.noCampaignsOnDate')
                                            : t('dashboard.stats.noCampaignsToShow')}
                                </div>
                            )}
                        </div>
                        {/* Gradient fade effects */}
                        {displayCampaigns.length > 0 && (
                            <>
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white dark:from-gray-800 via-white/90 dark:via-gray-800/90 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white dark:from-gray-800 via-white/90 dark:via-gray-800/90 to-transparent pointer-events-none"></div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default StatsChartsSection;
