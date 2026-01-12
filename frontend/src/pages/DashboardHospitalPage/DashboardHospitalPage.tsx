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
import { useTranslation } from 'react-i18next';
import { useHospitalDashboard } from '../../hooks/useHospitalDashboard';

// Imported Components
import DashboardSidebar from '../../components/features/hospital/DashboardSidebar/DashboardSidebar';
import AppointmentsSection from '../../components/features/hospital/AppointmentsSection/AppointmentsSection';
import StatsChartsSection from '../../components/features/hospital/StatsChartsSection/StatsChartsSection';
import DonationsHistorySection from '../../components/features/hospital/DonationsHistorySection/DonationsHistorySection';
import CalendarSection from '../../components/features/hospital/CalendarSection/CalendarSection';
import CreateCampaignModal from '../../components/features/hospital/CreateCampaignModal/CreateCampaignModal';
import EditCampaignModal from '../../components/features/hospital/EditCampaignModal/EditCampaignModal';
import DeleteCampaignModal from '../../components/features/hospital/DeleteCampaignModal/DeleteCampaignModal';

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
  const {
    // State
    stats,
    loading,
    error,
    hospitalCampaigns,
    allCampaigns,
    showAllCampaigns,
    todayAppointments,
    monthlyDonations,
    selectedDate,
    filteredCampaigns,

    // Modal State
    showCreateCampaignModal,
    showEditModal,
    showDeleteModal,
    campaignToEdit,
    campaignToDelete,
    deleteConfirmText,

    // Setters
    setShowAllCampaigns,
    setShowCreateCampaignModal,
    setShowEditModal,
    setCampaignToEdit,
    setDeleteConfirmText,

    // Actions
    refreshCampaigns,
    handleDayClick,
    clearSelectedDate,
    handleDeleteClick,
    handleEditClick,
    handleDeleteConfirm,
    handleCancelDelete
  } = useHospitalDashboard();

  // Si está cargando, mostramos un mensaje
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
        {/* Sidebar: Menú de navegación */}
        <DashboardSidebar onCreateCampaign={() => setShowCreateCampaignModal(true)} />

        {/* Main Content: Aquí va todo el contenido principal */}
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
