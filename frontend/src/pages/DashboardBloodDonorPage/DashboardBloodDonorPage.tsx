import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTotalDonors } from '../../hooks/useTotalBloodDonors';
import { campaignService, type Campaign } from '../../services/campaignService';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { DonorSidebar } from '../../components/DonorDashboard/DonorSidebar';
import { UpcomingAppointments } from '../../components/DonorDashboard/UpcomingAppointments';
import { CampaignProgressChart } from '../../components/DonorDashboard/CampaignProgressChart';
import { DonationHistory } from '../../components/DonorDashboard/DonationHistory';
import { Calendar } from '../../components/DonorDashboard/Calendar';
import { StatsCards } from '../../components/DonorDashboard/StatsCards';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardBloodDonorPage = () => {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  // WebSocket hook for total donors counter
  const totalDonors = useTotalDonors();

  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  // Fetch dashboard stats
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

  // Fetch all campaigns
  const fetchAllCampaigns = async () => {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      setAllCampaigns(campaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  // Fetch my appointments
  const fetchMyAppointments = async () => {
    if (!user?.id) return;
    try {
      const appointments = await appointmentService.getAppointmentsByDonor(user.id);
      setMyAppointments(appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchAllCampaigns();
    if (user?.id) {
      fetchMyAppointments();
    }
  }, [user]);

  // WebSocket subscription for campaign updates
  useEffect(() => {
    const unsubscribe = subscribe('/topic/campaigns', (message) => {
      console.log('📨 Donor Dashboard - Received WebSocket message:', message);
      if (message.type === 'CAMPAIGN_CREATED' ||
        message.type === 'CAMPAIGN_UPDATED' ||
        message.type === 'CAMPAIGN_DELETED') {
        console.log('🔄 Refreshing campaigns in donor dashboard');
        fetchAllCampaigns();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);



  // Helper functions
  const getCompletedDonations = () => {
    return myAppointments.filter(apt => apt.appointmentStatus.id === 3);
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return myAppointments
      .filter(apt =>
        (apt.appointmentStatus.id === 1 || apt.appointmentStatus.id === 2) &&
        new Date(apt.dateAppointment) >= now
      )
      .slice(0, 4);
  };

  const getNextAvailableDate = (): Date => {
    const completedDonations = getCompletedDonations();
    if (completedDonations.length === 0) {
      return new Date();
    }

    const sortedDonations = completedDonations.sort((a, b) =>
      new Date(b.dateAppointment).getTime() - new Date(a.dateAppointment).getTime()
    );
    const lastDonation = sortedDonations[0];

    const waitingPeriod = user?.gender === "Masculino" ? 90 : 120;
    const nextDate = new Date(lastDonation.dateAppointment);
    nextDate.setDate(nextDate.getDate() + waitingPeriod);

    return nextDate;
  };

  const canDonateNow = (): boolean => {
    const nextAvailableDate = getNextAvailableDate();
    return new Date() >= nextAvailableDate;
  };

  const getDaysUntilNextDonation = (): number => {
    if (canDonateNow()) return 0;
    const nextDate = getNextAvailableDate();
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
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
                bloodDonorsCounter={totalDonors}
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
