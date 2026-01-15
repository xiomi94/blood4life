import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../../../context/ThemeContext';
import type { Campaign } from '../../../../services/campaignService';
import type { DashboardStats } from '../../../../services/dashboardService';
import CampaignsList from '../CampaignsList/CampaignsList';

type ChartType = 'bloodType' | 'myCampaigns' | 'allCampaigns' | 'completedCampaigns';

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
    const [selectedChart, setSelectedChart] = useState<ChartType>(() => {
        const saved = localStorage.getItem('dashboard_lastSelectedChart');
        return (saved as ChartType) || 'myCampaigns';
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Handle chart type change and update campaign filter
    const handleChartChange = (newChart: ChartType) => {
        setSelectedChart(newChart);
        localStorage.setItem('dashboard_lastSelectedChart', newChart);
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
        console.log('🩸 Backend sends these blood types:', stats.bloodType.labels);

        stats.bloodType.labels.forEach((label, index) => {
<<<<<<< Updated upstream
            map.set(label.trim(), stats.bloodType.counts[index]);
=======
            // Normalize blood types: Convert "0+" to "O+" and "0-" to "O-"
            const normalizedLabel = label.replace(/^0([+-])$/, 'O$1');
            map.set(normalizedLabel, stats.bloodType.counts[index]);
>>>>>>> Stashed changes
        });
        finalBloodTypeCounts = orderedBloodTypes.map(type => map.get(type) || 0);
    } else {
        // Filtramos por género usando breakdown
        const map = new Map<string, number>();
        stats.breakdown
            .filter(item => item.gender === bloodTypeGenderFilter)
            .forEach(item => {
<<<<<<< Updated upstream
                const type = item.bloodType.trim();
                const current = map.get(type) || 0;
                map.set(type, current + item.count);
=======
                // Normalize blood type
                const normalizedType = item.bloodType.replace(/^0([+-])$/, 'O$1');
                const current = map.get(normalizedType) || 0;
                map.set(normalizedType, current + item.count);
>>>>>>> Stashed changes
            });
        finalBloodTypeCounts = orderedBloodTypes.map(type => map.get(type) || 0);
    }

    const finalBloodTypeLabels = orderedBloodTypes;

    // Prepare gender-separated data for grouped bar chart
    let maleData: number[] = [];
    let femaleData: number[] = [];
    let otherData: number[] = [];

    if (bloodTypeGenderFilter === 'all' && stats.breakdown) {
        // Create grouped data showing all genders
        const maleMap = new Map<string, number>();
        const femaleMap = new Map<string, number>();
        const otherMap = new Map<string, number>();

        stats.breakdown.forEach(item => {
            // Normalize blood type
            const normalizedType = item.bloodType.replace(/^0([+-])$/, 'O$1');
            const genderLower = item.gender.toLowerCase();
            if (genderLower === 'masculino') {
<<<<<<< Updated upstream
                maleMap.set(item.bloodType.trim(), item.count);
            } else if (genderLower === 'femenino') {
                femaleMap.set(item.bloodType.trim(), item.count);
            } else {
                // Captura cualquier otra variación (Otro, Prefiero no decirlo, etc.)
                otherMap.set(item.bloodType.trim(), item.count);
=======
                maleMap.set(normalizedType, item.count);
            } else if (genderLower === 'femenino') {
                femaleMap.set(normalizedType, item.count);
            } else {
                // Captura cualquier otra variación (Otro, Prefiero no decirlo, etc.)
                otherMap.set(normalizedType, item.count);
>>>>>>> Stashed changes
            }
        });

        maleData = orderedBloodTypes.map(type => maleMap.get(type) || 0);
        femaleData = orderedBloodTypes.map(type => femaleMap.get(type) || 0);
        otherData = orderedBloodTypes.map(type => otherMap.get(type) || 0);
    } else if (stats.breakdown) {
        // When filtered by gender, use breakdown to show only that gender's data
        const genderMap = new Map<string, number>();

        stats.breakdown
            .filter(item => item.gender.toLowerCase() === bloodTypeGenderFilter.toLowerCase())
            .forEach(item => {
                genderMap.set(item.bloodType.trim(), item.count);
            });

        const filteredCounts = orderedBloodTypes.map(type => genderMap.get(type) || 0);

        maleData = bloodTypeGenderFilter === 'Masculino' ? filteredCounts : new Array(8).fill(0);
        femaleData = bloodTypeGenderFilter === 'Femenino' ? filteredCounts : new Array(8).fill(0);
        otherData = bloodTypeGenderFilter === 'Prefiero no decirlo' ? filteredCounts : new Array(8).fill(0);
    } else {
        // Fallback: use finalBloodTypeCounts if breakdown is not available
        maleData = bloodTypeGenderFilter === 'Masculino' ? finalBloodTypeCounts : new Array(8).fill(0);
        femaleData = bloodTypeGenderFilter === 'Femenino' ? finalBloodTypeCounts : new Array(8).fill(0);
        otherData = bloodTypeGenderFilter === 'Prefiero no decirlo' ? finalBloodTypeCounts : new Array(8).fill(0);
    }

    // Blood Type Chart Data (Stacked)
    const bloodTypeChartData = {
        labels: finalBloodTypeLabels,
        datasets: [
            {
                label: t('dashboard.stats.male'),
                data: maleData,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: t('dashboard.stats.female'),
                data: femaleData,
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: t('dashboard.stats.preferNotToSay'),
                data: otherData,
                backgroundColor: 'rgba(107, 114, 128, 0.8)',
                borderColor: 'rgba(107, 114, 128, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    // Calcular el máximo para el eje Y (redondeo al siguiente múltiplo de 5)
    const allValues = [...maleData, ...femaleData, ...otherData];
    const maxBloodTypeCount = Math.max(...allValues, 0);
    // Redondear al siguiente múltiplo de 5 (mínimo 5)
    const bloodTypeYAxisMax = Math.ceil(maxBloodTypeCount / 5) * 5 || 5;

    // Calcular stepSize dinámico para evitar acumulación de números
    let stepSize = 1;
    if (bloodTypeYAxisMax > 50) {
        stepSize = 10;
    } else if (bloodTypeYAxisMax > 20) {
        stepSize = 5;
    } else if (bloodTypeYAxisMax > 10) {
        stepSize = 2;
    }

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
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                },
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: bloodTypeYAxisMax,
                position: 'left' as const,
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                },
                border: {
                    display: true,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                    width: 2,
                },
                ticks: {
                    color: textColor,
                    stepSize: stepSize,
                    font: {
                        size: 11,
                        weight: 500,
                    },
                    padding: 8,
                }
            },
            y1: {
                beginAtZero: true,
                max: bloodTypeYAxisMax,
                position: 'right' as const,
                display: true,
                grid: {
                    display: false,
                },
                border: {
                    display: true,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                    width: 2,
                },
                ticks: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    lineWidth: 1,
                },
                border: {
                    display: true,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                    width: 2,
                },
                ticks: {
                    color: textColor,
                    font: {
                        size: 11,
                        weight: 600,
                    },
                    padding: 8,
                }
            },
        },
        // Configuración para separación entre grupos (tipos de sangre)
        barPercentage: 0.8,
        categoryPercentage: 0.75,
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
                            <option value="completedCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.completedCampaigns')}</option>
                            <option value="bloodType" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.bloodTypeOption')}</option>
                            <option value="myCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.myCampaigns')}</option>
                            <option value="allCampaigns" className="text-lg font-semibold text-gray-700 dark:text-gray-200 dark:bg-gray-800">{t('dashboard.stats.allCampaigns')}</option>
                        </select>
                    )}
                </div>

                {/* Botones de filtro de género - solo para gráfico de tipo de sangre */}
                {selectedChart === 'bloodType' && (
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setBloodTypeGenderFilter('all')}
                            className={`
                                group relative px-4 py-2.5 text-sm font-semibold rounded-lg 
                                transition-all duration-300 ease-in-out
                                flex items-center gap-2
                                ${bloodTypeGenderFilter === 'all'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-blue-500/30 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400'
                                }
                            `}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {t('dashboard.stats.allGenders')}
                        </button>
                        <button
                            onClick={() => setBloodTypeGenderFilter('Masculino')}
                            className={`
                                group relative px-4 py-2.5 text-sm font-semibold rounded-lg 
                                transition-all duration-300 ease-in-out
                                flex items-center gap-2
                                ${bloodTypeGenderFilter === 'Masculino'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-blue-500/30 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400'
                                }
                            `}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {t('dashboard.stats.male')}
                        </button>
                        <button
                            onClick={() => setBloodTypeGenderFilter('Femenino')}
                            className={`
                                group relative px-4 py-2.5 text-sm font-semibold rounded-lg 
                                transition-all duration-300 ease-in-out
                                flex items-center gap-2
                                ${bloodTypeGenderFilter === 'Femenino'
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:border-red-500 dark:hover:border-red-400 hover:shadow-red-500/30 hover:scale-105 hover:text-red-600 dark:hover:text-red-400'
                                }
                            `}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {t('dashboard.stats.female')}
                        </button>
                        <button
                            onClick={() => setBloodTypeGenderFilter('Prefiero no decirlo')}
                            className={`
                                group relative px-4 py-2.5 text-sm font-semibold rounded-lg 
                                transition-all duration-300 ease-in-out
                                flex items-center gap-2
                                ${bloodTypeGenderFilter === 'Prefiero no decirlo'
                                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/50'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-gray-500/30 hover:scale-105 hover:text-gray-600 dark:hover:text-gray-400'
                                }
                            `}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('dashboard.stats.preferNotToSay')}
                        </button>
                    </div>
                )}

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
                    <div className="relative h-[450px] w-full">
                        <Bar data={bloodTypeChartData} options={bloodTypeOptions} />
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
