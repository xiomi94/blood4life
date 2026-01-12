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
import { dashboardService } from '../../services/dashboardService';
import type { DashboardStats } from '../../services/dashboardService';
import CreateCampaignModal from '../../components/Modals/CreateCampaignModal/CreateCampaignModal';
import EditCampaignModal from '../../components/Modals/EditCampaignModal/EditCampaignModal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { campaignService, type Campaign } from '../../services/campaignService';
import { appointmentService, type AppointmentWithDonor } from '../../services/appointmentService';
import { useWebSocket } from '../../hooks/useWebSocket';

// Imported Components
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar/DashboardSidebar';
import AppointmentsSection from '../../components/Dashboard/AppointmentsSection/AppointmentsSection';
import StatsChartsSection from '../../components/Dashboard/StatsChartsSection/StatsChartsSection';
import DonationsHistorySection from '../../components/Dashboard/DonationsHistorySection/DonationsHistorySection';
import CalendarSection from '../../components/Dashboard/CalendarSection/CalendarSection';
import DeleteCampaignModal from '../../components/Modals/DeleteCampaignModal/DeleteCampaignModal';

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

const DashboardHospitalPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { subscribe } = useWebSocket();

  // Stats and loading state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Campaign state
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [hospitalCampaigns, setHospitalCampaigns] = useState<Campaign[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Edit campaign state
  const [showEditModal, setShowEditModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  // Appointments state
  const [todayAppointments, setTodayAppointments] = useState<AppointmentWithDonor[]>([]);
  const [monthlyDonations, setMonthlyDonations] = useState<number>(0);

  // Fetch all campaigns
  useEffect(() => {
    campaignService.getAllCampaigns()
      .then(setAllCampaigns)
      .catch(err => console.error('Error fetching all campaigns:', err));
  }, []);

  // Fetch today's appointments and monthly donations
  useEffect(() => {
    if (user?.id) {
      appointmentService.getTodayAppointmentsByHospital(user.id)
        .then(setTodayAppointments)
        .catch(err => console.error('Error fetching today appointments:', err));

      appointmentService.getMonthlyDonationsByHospital(user.id)
        .then(setMonthlyDonations)
        .catch(err => console.error('Error fetching monthly donations:', err));
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

  // Fetch hospital campaigns when user is loaded
  useEffect(() => {
    if (user?.id) {
      campaignService.getCampaignsByHospital(user.id)
        .then(data => setHospitalCampaigns(data))
        .catch(err => console.error('Error loading hospital campaigns:', err));
    }
  }, [user]);



  // Fetch dashboard stats
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
      setError(t('dashboard.loadError'));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
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

  const handleDayClick = (dateStr: string, campaignsOnDay: Campaign[]) => {
    if (campaignsOnDay.length > 0) {
      setSelectedDate(dateStr);
      setFilteredCampaigns(campaignsOnDay);
    }
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
    setFilteredCampaigns([]);
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

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCampaignToDelete(null);
    setDeleteConfirmText('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">{t('dashboard.loading')}</div>
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
      <div className="flex flex-row flex-grow w-full bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <DashboardSidebar onCreateCampaign={() => setShowCreateCampaignModal(true)} />

        {/* Main Content */}
        <main className="grid w-full">
          <div className="p-8">
            {/* Appointments Section */}
            <AppointmentsSection appointments={todayAppointments} />

            {/* Main Grid: Charts + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Charts Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Charts Section */}
                <StatsChartsSection
                  stats={stats}
                  campaigns={showAllCampaigns ? allCampaigns : hospitalCampaigns}
                  showAllCampaigns={showAllCampaigns}
                  onToggleAllCampaigns={setShowAllCampaigns}
                  selectedDate={selectedDate}
                  filteredCampaigns={filteredCampaigns}
                  onClearSelectedDate={clearSelectedDate}
                  onEditCampaign={handleEditClick}
                  onDeleteCampaign={handleDeleteClick}
                />

                {/* Donations History Section */}
                <DonationsHistorySection />
              </div>

              {/* Right Column: Calendar */}
              <div className="space-y-6">
                <CalendarSection
                  campaigns={allCampaigns}
                  onDayClick={handleDayClick}
                />

                {/* Stats Cards */}
                <section className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{t('dashboard.stats.appointmentsToday')}</p>
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">{todayAppointments.length}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{t('dashboard.stats.donationsThisMonth')}</p>
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">{monthlyDonations}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Create Campaign Modal */}
        <CreateCampaignModal
          isOpen={showCreateCampaignModal}
          onClose={() => setShowCreateCampaignModal(false)}
          onSuccess={refreshCampaigns}
        />

        {/* Edit Campaign Modal */}
        <EditCampaignModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCampaignToEdit(null);
          }}
          campaign={campaignToEdit}
          onSuccess={refreshCampaigns}
        />

        {/* Delete Confirmation Modal */}
        <DeleteCampaignModal
          isOpen={showDeleteModal}
          campaign={campaignToDelete}
          confirmText={deleteConfirmText}
          onConfirmTextChange={setDeleteConfirmText}
          onConfirm={handleDeleteConfirm}
          onCancel={handleCancelDelete}
        />
      </div>
    </>
  );
};

export default DashboardHospitalPage;
