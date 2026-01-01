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
import CreateCampaignModal from '../../components/Modals/CreateCampaignModal/CreateCampaignModal';
import EditCampaignModal from '../../components/Modals/EditCampaignModal/EditCampaignModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { campaignService, type Campaign } from '../../services/campaignService';
import { appointmentService, type AppointmentWithDonor } from '../../services/appointmentService';
import { useWebSocket } from '../../hooks/useWebSocket';


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
  const { subscribe } = useWebSocket();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>('campaigns');
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [hospitalCampaigns, setHospitalCampaigns] = useState<Campaign[]>([]);
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  // Edit campaign state
  const [showEditModal, setShowEditModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [todayAppointments, setTodayAppointments] = useState<AppointmentWithDonor[]>([]);

  useEffect(() => {
    campaignService.getAllCampaigns()
      .then(setAllCampaigns)
      .catch(err => console.error('Error fetching all campaigns:', err));
  }, []);

  useEffect(() => {
    if (user?.id) {
      appointmentService.getTodayAppointmentsByHospital(user.id)
        .then(setTodayAppointments)
        .catch(err => console.error('Error fetching today appointments:', err));
    }
  }, [user]);

  // WebSocket subscription for real-time campaign updates
  useEffect(() => {
    const unsubscribe = subscribe('/topic/campaigns', (message) => {
      console.log('📨 Received WebSocket message:', message);
      if (message.type === 'CAMPAIGN_CREATED' ||
        message.type === 'CAMPAIGN_UPDATED' ||
        message.type === 'CAMPAIGN_DELETED') {
        console.log('🔄 Refreshing campaigns due to:', message.type);
        refreshCampaigns();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);


  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const changeYear = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const selectMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setCalendarView('days');
  };

  const selectYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setCalendarView('months');
  };

  const handleDayClick = (dateStr: string, campaignsOnDay: Campaign[]) => {
    if (campaignsOnDay.length > 0) {
      setSelectedDate(dateStr);
      setFilteredCampaigns(campaignsOnDay);
      setSelectedChart('campaigns');
    }
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
    setFilteredCampaigns([]);
  };

  const refreshCampaigns = async () => {
    try {
      console.log('🔄 Refreshing campaigns...');
      const allCamps = await campaignService.getAllCampaigns();
      console.log('✅ All campaigns fetched:', allCamps.length);
      setAllCampaigns(allCamps);

      if (user?.id) {
        const hospitalCamps = await campaignService.getCampaignsByHospital(user.id);
        console.log('✅ Hospital campaigns fetched:', hospitalCamps.length);
        setHospitalCampaigns(hospitalCamps);
      }
      console.log('✅ Campaigns refresh completed');
    } catch (err) {
      console.error('❌ Error refreshing campaigns:', err);
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
      console.log('🗑️ Deleting campaign:', campaignToDelete.name);
      await campaignService.deleteCampaign(campaignToDelete.id);
      console.log('✅ Campaign deleted successfully');
      await refreshCampaigns();
      setShowDeleteModal(false);
      setCampaignToDelete(null);
      setDeleteConfirmText('');
    } catch (err) {
      console.error('❌ Error deleting campaign:', err);
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
      const nowStr = new Date().toISOString().split('T')[0];

      // Find campaigns on this day
      const campaignsOnDay = allCampaigns.filter(c =>
        dateStr >= c.startDate && dateStr <= c.endDate
      );

      let statusClass = "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white";
      let backgroundStyle: React.CSSProperties = {};

      if (campaignsOnDay.length > 0) {


        // Categorize campaigns
        const isPast = campaignsOnDay.every(c => c.endDate < nowStr);
        const isFuture = campaignsOnDay.every(c => c.startDate > nowStr);
        const isActive = campaignsOnDay.some(c => c.startDate <= nowStr && c.endDate >= nowStr);


        // Determine color based on campaign status
        // Single campaign
        if (isActive) {
          // Active - green
          statusClass = "bg-green-500 text-white font-medium hover:bg-green-600 cursor-pointer relative";
        } else if (isFuture) {
          // Future - light blue
          statusClass = "bg-blue-400 text-white font-medium hover:bg-blue-500 cursor-pointer relative";
        } else if (isPast) {
          // Past - red
          statusClass = "bg-red-500 text-white font-medium hover:bg-red-600 cursor-pointer relative";
        }

      }

      // Check if it's "today"
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      if (isToday && campaignsOnDay.length === 0) {
        statusClass = "bg-blue-100 text-blue-800 font-bold border border-blue-300";
      }

      days.push(
        <div
          key={day}
          className={`p-2 rounded flex items-center justify-center text-sm transition-colors relative ${statusClass} ${campaignsOnDay.length > 0 ? 'cursor-pointer' : ''}`}
          style={backgroundStyle}
          title={campaignsOnDay.map(c => c.name).join(', ')}
          onClick={() => handleDayClick(dateStr, campaignsOnDay)}
        >
          {day}

          {campaignsOnDay.length >= 2 && (
            <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-black dark:text-gray-900 bg-white/80 dark:bg-gray-100/90 rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {campaignsOnDay.length}
            </span>
          )}





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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</div>
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
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
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
                  {todayAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-w-[280px]">
                      <p className="text-sm text-gray-500 text-center">
                        No hay citas programadas para hoy
                      </p>
                    </div>
                  ) : (
                    todayAppointments
                      .sort((a, b) => {
                        const timeA = a.hourAppointment || '00:00';
                        const timeB = b.hourAppointment || '00:00';
                        return timeA.localeCompare(timeB);
                      })
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start"
                        >
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {appointment.bloodDonor
                              ? `${appointment.bloodDonor.firstName} ${appointment.bloodDonor.lastName} (${appointment.bloodDonor.bloodType})`
                              : 'Donante desconocido'}
                          </p>
                          {appointment.bloodDonor?.dni && (
                            <p className="text-xs text-gray-400 mb-2">
                              DNI: {appointment.bloodDonor.dni}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-gray-800">
                            {appointment.hourAppointment || 'Sin hora'}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </section>


            {/* Main Grid: Charts + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Charts Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Estadísticas */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      {selectedDate ? (
                        <>
                          <h2 className="text-xl font-bold text-gray-800">Campañas seleccionadas</h2>
                          <button
                            onClick={clearSelectedDate}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                          >
                            Limpiar filtro
                          </button>
                        </>
                      ) : (
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
                      )}
                    </div>
                    {selectedChart === 'campaigns' && (
                      <div className="relative w-full sm:w-auto">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por título o ubicación..."
                          className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

                  {selectedChart === 'campaigns' && (() => {
                    const campaignsToShow = selectedDate ? filteredCampaigns : hospitalCampaigns;
                    const filteredBySearch = searchTerm
                      ? campaignsToShow.filter(campaign =>
                        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      : campaignsToShow;

                    return (
                      <div className="relative h-[400px] w-full">
                        <div
                          className="h-full overflow-y-auto pr-2 pt-2 pb-2 space-y-3 custom-scrollbar"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 transparent'
                          }}
                        >
                          {filteredBySearch.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-gray-500">
                              {searchTerm
                                ? 'No se encontraron campañas con ese criterio'
                                : selectedDate
                                  ? 'No hay campañas en esta fecha'
                                  : 'No hay campañas activas'}
                            </div>
                          ) : (
                            filteredBySearch
                              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                              .map(campaign => (
                                <div key={campaign.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-row items-center gap-3 flex-wrap">
                                      <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                        Meta: {campaign.currentDonorCount || 0}/{campaign.requiredDonorQuantity} donantes
                                      </span>
                                      <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {campaign.location}
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
                        {/* Gradient fade effects */}
                        {filteredBySearch.length > 0 && (
                          <>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </section>

                {/* Historial de donaciones */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Donaciones recibidas</h2>
                  <p className="text-sm text-gray-500 mb-4">Últimas donaciones de sangre recibidas en el hospital.</p>

                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Finalizado
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">Campaña de donación</p>
                          <p className="text-sm text-gray-500">Donación tipo O+</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">Hospital Negrín</p>
                        <p className="text-sm text-gray-500">Jan 17, 2022</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Finalizado
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">Campaña de donación</p>
                          <p className="text-sm text-gray-500">Donación tipo A-</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">Hospital Negrín</p>
                        <p className="text-sm text-gray-500">Jan 17, 2022</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Calendar + Stats */}
              <div className="space-y-6">
                {/* Calendar */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendario</h2>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <button
                        onClick={() => calendarView === 'days' ? changeMonth(-1) : changeYear(-1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                      >
                        &lt;
                      </button>
                      <div className="flex gap-2">
                        {calendarView === 'days' && (
                          <>
                            <button
                              onClick={() => setCalendarView('months')}
                              className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              {monthNames[currentDate.getMonth()]}
                            </button>
                            <button
                              onClick={() => setCalendarView('years')}
                              className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              {currentDate.getFullYear()}
                            </button>
                          </>
                        )}
                        {calendarView === 'months' && (
                          <button
                            onClick={() => setCalendarView('years')}
                            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {currentDate.getFullYear()}
                          </button>
                        )}
                        {calendarView === 'years' && (
                          <h3 className="font-semibold text-gray-800">
                            {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                          </h3>
                        )}
                      </div>
                      <button
                        onClick={() => calendarView === 'days' ? changeMonth(1) : changeYear(1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                      >
                        &gt;
                      </button>
                    </div>

                    {calendarView === 'days' && (
                      <>
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
                          {renderCalendarDays()}
                        </div>
                      </>
                    )}

                    {calendarView === 'months' && (
                      <div className="grid grid-cols-3 gap-2">
                        {monthNames.map((month, index) => (
                          <button
                            key={index}
                            onClick={() => selectMonth(index)}
                            className={`p-3 rounded-lg text-sm font-medium transition-colors ${currentDate.getMonth() === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}

                    {calendarView === 'years' && (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }, (_, i) => {
                          const startDecade = Math.floor(currentDate.getFullYear() / 10) * 10;
                          const year = startDecade + i - 1;
                          const isCurrentYear = year === currentDate.getFullYear();
                          const isOutOfRange = i === 0 || i === 11;
                          return (
                            <button
                              key={year}
                              onClick={() => selectYear(year)}
                              className={`p-3 rounded-lg text-sm font-medium transition-colors ${isCurrentYear
                                ? 'bg-blue-500 text-white'
                                : isOutOfRange
                                  ? 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2 text-xs justify-center text-gray-500">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Realizadas</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Activas</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div> Futuras</div>
                    </div>
                  </div>
                </section>

                {/* Stats Cards */}
                <section className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Citas hoy</p>
                    <p className="text-4xl font-bold text-gray-800">8</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
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
          onSuccess={async () => {
            setShowCreateCampaignModal(false);
            await refreshCampaigns();
          }}
        />

        <EditCampaignModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          campaign={campaignToEdit}
          onSuccess={async () => {
            setShowEditModal(false);
            await refreshCampaigns();
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
    </>
  );
};

export default DashboardHospitalPage;
