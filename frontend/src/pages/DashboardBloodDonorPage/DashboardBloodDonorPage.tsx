import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import { campaignService } from '../../services/campaignService';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import type { Campaign } from '../../types/common.types';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { DonorSidebar } from '../../components/features/donor/DonorSidebar';
import { UpcomingAppointments } from '../../components/features/donor/UpcomingAppointments';
import { CampaignProgressChart } from '../../components/features/donor/CampaignProgressChart';
import { DonationHistory } from '../../components/features/donor/DonationHistory';
import { Calendar } from '../../components/features/donor/Calendar';
import { StatsCards } from '../../components/features/donor/StatsCards';

import CreateDonationModal from '../../components/features/donor/CreateDonationModal/CreateDonationModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardBloodDonorPage = () => {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  // currentDate removed; handled internally by Calendar
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // WebSocket state for total donors counter
  const [totalDonors, setTotalDonors] = useState(0);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error('Error al cargar las estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all campaigns
  const fetchAllCampaigns = useCallback(async () => {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      setAllCampaigns(campaigns);
      console.log(' Campaigns cargadas:', campaigns.length, 'campaigns loaded');
    } catch (err) {
      console.error('Error al cargar las campañas:', err);
    }
  }, []);

  // Fetch my appointments
  const fetchMyAppointments = async () => {
    if (!user?.id) return;
    try {
      const appointments = await appointmentService.getAppointmentsByDonor(user.id);
      setMyAppointments(appointments);
    } catch (err) {
      console.error('Error al cargar las citas:', err);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      // Refresh appointments list
      await fetchMyAppointments();
      // Refresh stats
      await fetchStats();
      // Show success message
      toast.success('Cita eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar la cita:', err);
      toast.error('Error al eliminar la cita. Por favor, intenta de nuevo.');
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
    const unsubscribe = subscribe('/topic/campaigns', (message: any) => {
      console.log('📨 Donor Dashboard - Received WebSocket message:', message);
      if (
        message.type === 'CAMPAIGN_CREATED' ||
        message.type === 'CAMPAIGN_UPDATED' ||
        message.type === 'CAMPAIGN_DELETED'
      ) {
        console.log('Actualizando campañas en el dashboard del donante');
        fetchAllCampaigns();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, fetchAllCampaigns]);

  // WebSocket connection for total donors counter
  // WebSocket connection for total donors counter
  const { isConnected, publish } = useWebSocket();

  useEffect(() => {
    if (!user?.id || !isConnected) return;

    console.log(' Suscribiéndose a contador de donantes');

    // 1. Subscribe
    const unsubscribe = subscribe('/topic/total-bloodDonors', (message: any) => {
      console.log('Total de donantes recibido:', message);
      setTotalDonors(Number(message));
    });

    // 2. Request initial value (after subscription is set up)
    publish('/app/getTotalDonors', '');

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, publish, user?.id, isConnected]);

  // Helper functions
  const getCompletedDonations = () => {
    return myAppointments.filter((apt) => apt.appointmentStatus.id === 3);
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return myAppointments
      .filter(
        (apt) =>
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

    const sortedDonations = completedDonations.sort(
      (a, b) => new Date(b.dateAppointment).getTime() - new Date(a.dateAppointment).getTime()
    );
    const lastDonation = sortedDonations[0];

    const waitingPeriod = user?.gender === 'Masculino' ? 90 : 120;
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

  // Check if donor can schedule a new appointment (considering pending appointments)
  const canScheduleNewAppointment = (): { canSchedule: boolean; nextDate: Date | null } => {
    const now = new Date();

    // Check for pending or confirmed appointments (status 1 or 2)
    const upcomingAppointments = myAppointments.filter(
      (apt) =>
        (apt.appointmentStatus.id === 1 || apt.appointmentStatus.id === 2) &&
        new Date(apt.dateAppointment) >= now
    );

    if (upcomingAppointments.length > 0) {
      // Has a pending appointment, calculate when they can schedule next
      const nextAppointment = upcomingAppointments[0];
      const appointmentDate = new Date(nextAppointment.dateAppointment);
      const waitingPeriod = user?.gender === 'Masculino' ? 90 : 120;
      const availableDate = new Date(appointmentDate);
      availableDate.setDate(availableDate.getDate() + waitingPeriod);

      return { canSchedule: false, nextDate: availableDate };
    }

    // No pending appointments, check based on last completed donation
    const nextAvailableDate = getNextAvailableDate();
    const canDonate = now >= nextAvailableDate;

    return {
      canSchedule: canDonate,
      nextDate: canDonate ? null : nextAvailableDate
    };
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
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</div>
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
  const { canSchedule, nextDate } = canScheduleNewAppointment();

  return (
    <div className="flex flex-row flex-grow w-full bg-gray-100 dark:bg-gray-900">
      <DonorSidebar
        onNewDonationClick={() => setIsDonationModalOpen(true)}
        canDonate={canSchedule}
        nextAvailableDate={nextDate || undefined}
      />

      <CreateDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSuccess={() => {
          fetchMyAppointments();
          fetchStats(); // Refresh stats too
        }}
      />

      <main className="grid w-full">
        <div className="p-8">
          <UpcomingAppointments
            appointments={upcomingAppointments}
            campaigns={allCampaigns}
            onDelete={handleDeleteAppointment}
            userBloodType={user?.bloodType?.type}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CampaignProgressChart
                campaigns={allCampaigns}
                selectedDate={selectedDate}
                filteredCampaigns={filteredCampaigns}
                onClearFilter={clearSelectedDate}
                canDonate={canSchedule}
                nextAvailableDate={nextDate || undefined}
              />

              <DonationHistory donations={completedDonations} />
            </div>

            <div className="space-y-6">
              <Calendar
                allCampaigns={allCampaigns}
                onDayClick={handleDayClick}
              />

              <StatsCards
                totalDonors={totalDonors}
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
