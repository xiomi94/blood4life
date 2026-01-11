import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from 'chart.js';
import { useDonorDashboard } from '../../hooks/useDonorDashboard';
import { useTotalDonors } from '../../hooks/useTotalBloodDonors.ts';
import { DonorSidebar } from '../../components/DonorDashboard/DonorSidebar';
import { UpcomingAppointments } from '../../components/DonorDashboard/UpcomingAppointments';
import { CampaignProgressChart } from '../../components/DonorDashboard/CampaignProgressChart';
import { DonationHistory } from '../../components/DonorDashboard/DonationHistory';
import { Calendar } from '../../components/DonorDashboard/Calendar';
import { StatsCards } from '../../components/DonorDashboard/StatsCards';
import {useEffect} from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardBloodDonorPage = () => {
  const {
    stats,
    loading,
    error,
    allCampaigns,
    currentDate,
    selectedDate,
    filteredCampaigns,
    getCompletedDonations,
    getUpcomingAppointments,
    getNextAvailableDate,
    canDonateNow,
    getDaysUntilNextDonation,
    changeMonth,
    handleDayClick,
    clearSelectedDate,
  } = useDonorDashboard();

  const bloodDonorsCounter = useTotalDonors();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Cargando estadísticas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const completedDonations = getCompletedDonations();
  const upcomingAppointments = getUpcomingAppointments();
  const nextAvailableDate = getNextAvailableDate();
  const daysUntilNext = getDaysUntilNextDonation();

  return (
    <div className="flex flex-row flex-grow w-full bg-gray-100 dark:bg-gray-900">
      <DonorSidebar />

      {/* Main Content */}
      <main className="grid w-full">
        <div className="p-8">
          <UpcomingAppointments appointments={upcomingAppointments} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <CampaignProgressChart
                campaigns={allCampaigns}
                selectedDate={selectedDate}
                filteredCampaigns={filteredCampaigns}
                onClearFilter={clearSelectedDate}
              />

              <DonationHistory donations={completedDonations} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Calendar
                currentDate={currentDate}
                allCampaigns={allCampaigns}
                onMonthChange={changeMonth}
                onDayClick={handleDayClick}
              />

              <StatsCards
                bloodDonorsCounter={bloodDonorsCounter}
                canDonateNow={canDonateNow()}
                daysUntilNext={daysUntilNext}
                nextAvailableDate={nextAvailableDate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardBloodDonorPage;
