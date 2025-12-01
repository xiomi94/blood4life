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

const DashboardHospitalPage = () => {
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold text-gray-600">Cargando estadísticas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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
                backgroundColor: 'rgba(37, 99, 235, 0.6)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
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
                    'rgba(59, 130, 246, 0.6)', // blue-500
                    'rgba(236, 72, 153, 0.6)', // pink-500
                    'rgba(107, 114, 128, 0.6)', // gray-500
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(107, 114, 128, 1)',
                ],
                borderWidth: 1,
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
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-800 text-center mb-8">
                    Panel de Hospital - Estadísticas
                </h1>

                <div className="mb-8 flex justify-center">
                    <div className="relative inline-block w-64">
                        <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-2">
                            Seleccionar Tipo de Gráfico
                        </label>
                        <select
                            id="chartType"
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="bloodType">Distribución por Tipo de Sangre</option>
                            <option value="gender">Distribución por Género</option>
                        </select>
                    </div>
                </div>

                {selectedChart === 'bloodType' && (
                    <div className="relative h-[400px] w-full">
                        <Bar data={bloodTypeChartData} options={bloodTypeOptions} />
                    </div>
                )}

                {selectedChart === 'gender' && (
                    <div className="relative h-[400px] w-full">
                        <Doughnut data={genderChartData} options={genderOptions} />
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a href="/" className="text-blue-600 hover:text-blue-800 underline font-medium">
                        Volver al Inicio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardHospitalPage;
