import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { adminService, type BloodDonor, type Hospital } from '../../services/adminService';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [activeTab, setActiveTab] = useState<'donors' | 'hospitals'>('donors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, donorsData, hospitalsData] = await Promise.all([
        dashboardService.getStats(),
        adminService.getBloodDonors(),
        adminService.getHospitals()
      ]);
      setStats(statsData);
      setDonors(donorsData);
      setHospitals(hospitalsData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del administrador');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este donante?')) {
      try {
        await adminService.deleteBloodDonor(id);
        setDonors(donors.filter(d => d.id !== id));
      } catch (err) {
        alert('Error al eliminar donante');
      }
    }
  };

  const handleDeleteHospital = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hospital?')) {
      try {
        await adminService.deleteHospital(id);
        setHospitals(hospitals.filter(h => h.id !== id));
      } catch (err) {
        alert('Error al eliminar hospital');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Cargando panel de administración...</div>
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

  const chartData = stats ? {
    labels: stats.totalUsers.labels,
    datasets: [
      {
        label: 'Total Usuarios',
        data: stats.totalUsers.counts,
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)'],
        borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Usuarios',
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

      {/* Graph Section */}
      {chartData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto w-full">
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'donors'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          onClick={() => setActiveTab('donors')}
        >
          Donantes
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'hospitals'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          onClick={() => setActiveTab('hospitals')}
        >
          Hospitales
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'donors' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'donors' ? (
                donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donor.firstName} {donor.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{donor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{donor.dni}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{hospital.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{hospital.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteHospital(hospital.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
