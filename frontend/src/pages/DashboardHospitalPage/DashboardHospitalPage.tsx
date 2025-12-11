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
import CreateCampaignModal from '../../components/CreateCampaignModal/CreateCampaignModal';
import EditCampaignModal from '../../components/EditCampaignModal/EditCampaignModal';
import { useAuth } from '../../context/AuthContext';
import { campaignService, type Campaign } from '../../services/campaignService';


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

type ChartType = 'bloodType' | 'gender' | 'campaigns';

const DashboardHospitalPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>('campaigns');
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [hospitalCampaigns, setHospitalCampaigns] = useState<Campaign[]>([]);
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  // Edit campaign state
  const [showEditModal, setShowEditModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);

  useEffect(() => {
    campaignService.getAllCampaigns()
      .then(setAllCampaigns)
      .catch(err => console.error('Error fetching all campaigns:', err));
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const refreshCampaigns = () => {
    campaignService.getAllCampaigns()
      .then(setAllCampaigns)
      .catch(err => console.error('Error refreshing campaigns:', err));

    if (user?.id) {
      campaignService.getCampaignsByHospital(user.id)
        .then(setHospitalCampaigns)
        .catch(err => console.error('Error refreshing hospital campaigns:', err));
    }
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  const handleEditClick = (campaign: Campaign) => {
    setCampaignToEdit(campaign);
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete || deleteConfirmText !== campaignToDelete.name) return;

    try {
      await campaignService.deleteCampaign(campaignToDelete.id);
      setShowDeleteModal(false);
      setCampaignToDelete(null);
      setDeleteConfirmText('');
      refreshCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Error al eliminar la campaña');
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Determine status based on campaigns
      let statusClass = "hover:bg-gray-100 cursor-pointer";
      let hasCampaign = false;

      // Check for campaigns on this day
      const campaignsOnDay = allCampaigns.filter(c =>
        dateStr >= c.startDate && dateStr <= c.endDate
      );

      if (campaignsOnDay.length > 0) {
        hasCampaign = true;
        const nowStr = new Date().toISOString().split('T')[0];

        // Priority: Active > Future > Finished
        if (campaignsOnDay.some(c => dateStr >= c.startDate && dateStr <= c.endDate && nowStr >= c.startDate && nowStr <= c.endDate)) {
          // Active today (roughly) - Use Green
          statusClass = "bg-green-500 text-white font-medium hover:bg-green-600";
        } else if (campaignsOnDay.some(c => c.startDate > nowStr)) {
          // Future - Use Blue
          statusClass = "bg-blue-500 text-white font-medium hover:bg-blue-600";
        } else {
          // Past - Use Red/Gray
          statusClass = "bg-red-200 text-red-800 font-medium hover:bg-red-300";
        }
      }

      // Check if it's "today"
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      if (isToday && !hasCampaign) {
        statusClass = "bg-blue-100 text-blue-800 font-bold border border-blue-300";
      }

      days.push(
        <div key={day} className={`p-2 rounded flex items-center justify-center text-sm transition-colors ${statusClass}`} title={campaignsOnDay.map(c => c.name).join(', ')}>
          {day}
        </div>
      );
    }
    return days;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {
    if (selectedChart === 'campaigns' && user?.id) {
      campaignService.getCampaignsByHospital(user.id)
        .then(data => setHospitalCampaigns(data))
        .catch(err => console.error('Error loading campaigns:', err));
    }
  }, [selectedChart, user]);

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
      <aside className="w-80 border-r border-gray-300 flex flex-col py-4">

        {/* Action Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowCreateCampaignModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva campaña
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <a href="/index"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Inicio</span>
          </a>
          <a href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="font-medium">Mis campañas</span>
          </a>
          <a href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg mb-1 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="font-medium">Noticias</span>
            <span
              className="absolute right-4 top-3 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">NEW</span>
          </a>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="grid w-full">
        {/* Content Area */}
        <div className="p-8">
          {/* Citas programadas */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Citas programadas para hoy
            </h2>

            {/* Contenedor limitado en ancho */}
            <div className="w-full overflow-hidden">
              <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Juan Pérez (O+)
                  </p>
                  <p className="text-2xl font-bold text-gray-800">09:00 AM</p>
                </div>

                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    María García (A-)
                  </p>
                  <p className="text-2xl font-bold text-gray-800">10:30 AM</p>
                </div>

                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Carlos López (B+)
                  </p>
                  <p className="text-2xl font-bold text-gray-800">02:00 PM</p>
                </div>

                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Ana Martínez (AB+)
                  </p>
                  <p className="text-2xl font-bold text-gray-800">04:30 PM</p>
                </div>
              </div>
            </div>
          </section>


          {/* Main Grid: Charts + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estadísticas */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-start mb-6">
                  <select
                    id="chartType"
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                    className="appearance-none pr-8 pl-0 py-1 bg-transparent text-xl font-bold text-gray-800 border-none focus:ring-0 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_-4px_center] bg-no-repeat"
                  >
                    <option value="campaigns" className="text-lg font-semibold text-gray-700">Campañas</option>
                    <option value="bloodType" className="text-lg font-semibold text-gray-700">Distribución por tipo de sangre</option>
                    <option value="gender" className="text-lg font-semibold text-gray-700">Distribución por género</option>
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

                {selectedChart === 'campaigns' && (
                  <div className="relative h-[350px] w-full overflow-y-auto pr-2 space-y-3">
                    {hospitalCampaigns.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No hay campañas activas
                      </div>
                    ) : (
                      hospitalCampaigns.map(campaign => (
                        <div key={campaign.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-row items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                Meta: {campaign.currentDonorCount || 0} / {campaign.requiredDonorQuantity} donantes
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(campaign)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Editar campaña"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(campaign)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Eliminar campaña"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                          </div>
                          <p className="text-base text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                            <div>
                              <span className="font-semibold block mb-1">Fechas:</span>
                              {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                            </div>
                            <div>
                              <span className="font-semibold block mb-1">Tipos de sangre:</span>
                              <div className="flex flex-wrap gap-1">
                                {campaign.requiredBloodType.split(',').map((type, idx) => (
                                  <span key={idx} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                    {type.replace(/[\[\]\s"]/g, '')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Calendar */}
            <div className="space-y-6">
              {/* Calendar Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">Calendario</h3>
                  <div className="flex gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-medium text-gray-700">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarDays()}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 justify-center">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Activa hoy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Futura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-200"></span>
                    <span>Pasada</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <section className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Citas hoy</p>
                  <p className="text-4xl font-bold text-gray-800">8</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Donaciones este mes</p>
                  <p className="text-4xl font-bold text-gray-800">247</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateCampaignModal
        isOpen={showCreateCampaignModal}
        onClose={() => setShowCreateCampaignModal(false)}
        onSuccess={() => {
          setShowCreateCampaignModal(false);
          refreshCampaigns();
        }}
      />

      <EditCampaignModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        campaign={campaignToEdit}
        onSuccess={() => {
          setShowEditModal(false);
          refreshCampaigns();
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 opacity-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Eliminar Campaña</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar la campaña <span className="font-bold text-gray-800">"{campaignToDelete.name}"</span>?
              Esta acción no se puede deshacer.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escribe el nombre de la campaña para confirmar:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder={campaignToDelete.name}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCampaignToDelete(null);
                  setDeleteConfirmText('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmText !== campaignToDelete.name}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHospitalPage;
