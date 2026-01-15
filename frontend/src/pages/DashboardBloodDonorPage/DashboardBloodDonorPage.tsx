import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

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
      if (
        message.type === 'CAMPAIGN_CREATED' ||
        message.type === 'CAMPAIGN_UPDATED' ||
        message.type === 'CAMPAIGN_DELETED'
      ) {
        console.log('Refreshing campaigns in donor dashboard');
        fetchAllCampaigns();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);

  // WebSocket connection for total donors counter
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket conectado al servidor');

        // Subscribe to topic for updates
        client.subscribe('/topic/total-bloodDonors', (message) => {
          console.log('Total de donantes recibido:', message.body);
          setTotalDonors(Number(message.body));
        });

        // Request current total from server
        client.publish({
          destination: '/app/getTotalDonors',
          body: '',
        });
      },
      onStompError: (frame) => {
        console.error('Error en WebSocket:', frame);
      },
      onWebSocketClose: () => {
        console.log('🔌 WebSocket desconectado');
      },
    });

    client.activate();

    return () => {
      console.log('Cerrando conexión WebSocket...');
      client.deactivate();
    };
  }, []);

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

  return (
    <div className="flex flex-row flex-grow w-full bg-gray-100 dark:bg-gray-900">
      <DonorSidebar />

      <main className="grid w-full">
        <div className="p-8">
          <UpcomingAppointments appointments={upcomingAppointments} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CampaignProgressChart
                campaigns={allCampaigns}
                selectedDate={selectedDate}
                filteredCampaigns={filteredCampaigns}
                onClearFilter={clearSelectedDate}
              />

              <DonationHistory donations={completedDonations} />
            </div>

            <div className="space-y-6">
              <Calendar
                currentDate={currentDate}
                allCampaigns={allCampaigns}
                onMonthChange={changeMonth}
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
