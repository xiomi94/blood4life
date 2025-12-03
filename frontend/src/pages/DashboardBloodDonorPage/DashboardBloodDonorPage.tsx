import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardStats } from '../../services/dashboardService';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

type ChartType = 'bloodType' | 'gender';

const DashboardBloodDonorPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedChart, setSelectedChart] = useState<ChartType>('bloodType');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las estadísticas');
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-600">Cargando estadísticas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-red-600">{error}</div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

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

    return (
        <div className="flex flex-row flex-grow w-full bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 flex items-center justify-center">
                    <img src="/src/assets/images/Logo.webp" alt="Blood4Life Logo" className="h-16 w-auto" />
                </div>

                {/* Action Button */}
                <div className="px-4 mb-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva donación
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium">Inicio</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="font-medium">Mis campañas</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors relative">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="font-medium">Noticias</span>
                        <span className="absolute right-4 top-3 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">NEW</span>
                    </a>
                </nav>

                {/* Footer */}
                <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
                    <p className="mb-1">Blood4Life © 2025</p>
                    <p>Todos los derechos reservados.</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-grow w-full">


                {/* Content Area */}
                <div className="p-8">
                    {/* Campañas disponibles */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Campañas disponibles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Hospital Doctor Negrín</p>
                                <p className="text-2xl font-bold text-gray-800">7 vacantes</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Hospital Insular</p>
                                <p className="text-2xl font-bold text-gray-800">12 vacantes</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Hospital La Paloma</p>
                                <p className="text-2xl font-bold text-gray-800">17 vacantes</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Hospital Perpetuo Socorro</p>
                                <p className="text-2xl font-bold text-gray-800">17 vacantes</p>
                            </div>
                        </div>
                    </section>

                    {/* Main Grid: Charts + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Charts Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Estadísticas */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Estadísticas de donantes</h2>
                                    <select
                                        id="chartType"
                                        value={selectedChart}
                                        onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="bloodType">Distribución por tipo de sangre</option>
                                        <option value="gender">Distribución por género</option>
                                    </select>
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
                            </section>

                            {/* Historial de donaciones */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Historial de donaciones</h2>
                                <p className="text-sm text-gray-500 mb-4">Lorem ipsum dolor sit amet, consectetur adipis.</p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                Finalizado
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800">Campaña de donación</p>
                                                <p className="text-sm text-gray-500">Descripción campaña</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800">Hospital Negrín</p>
                                            <p className="text-sm text-gray-500">Jan 17, 2022</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                Finalizado
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800">Campaña de donación</p>
                                                <p className="text-sm text-gray-500">Descripción campaña</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800">Hospital Negrín</p>
                                            <p className="text-sm text-gray-500">Jan 17, 2022</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Calendar + Stats */}
                        <div className="space-y-6">
                            {/* Calendar */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendario</h2>

                                <div className="mb-3">
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
                                        <div>Lu</div>
                                        <div>Ma</div>
                                        <div>Mi</div>
                                        <div>Ju</div>
                                        <div>Vi</div>
                                        <div>Sa</div>
                                        <div>Do</div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                        <div className="p-2 text-gray-400">28</div>
                                        <div className="p-2 text-gray-400">29</div>
                                        <div className="p-2 text-gray-400">30</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">1</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">2</div>
                                        <div className="p-2 bg-blue-600 text-white rounded font-medium cursor-pointer">3</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">4</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">5</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">6</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">7</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">8</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">9</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">10</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">11</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">12</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">13</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">14</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">15</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">16</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">17</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">18</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">19</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">20</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">21</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">22</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">23</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">24</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">25</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">26</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">27</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">28</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">29</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">30</div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">31</div>
                                    </div>
                                </div>
                            </section>

                            {/* Stats Cards */}
                            <section className="space-y-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total donantes hoy</p>
                                    <p className="text-4xl font-bold text-gray-800">84,382</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total donaciones</p>
                                    <p className="text-4xl font-bold text-gray-800">120</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardBloodDonorPage;
