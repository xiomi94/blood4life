import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from './useWebSocket';
import { campaignService, type Campaign } from '../services/campaignService';
import { appointmentService, type Appointment } from '../services/appointmentService';
import { dashboardService, type DashboardStats } from '../services/dashboardService';

export const useDonorDashboard = () => {
  const { user } = useAuth();
  const { subscribe, isConnected } = useWebSocket();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchAllCampaigns(),
          fetchMyAppointments()
        ]);
      } catch (err) {
        console.error("Error loading initial data", err);
        setError("Error cargando datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInitialData();
    }
  }, [user]);

  // WebSocket subscription for real-time campaign updates
  useEffect(() => {
    if (!isConnected) return;

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
  }, [subscribe, isConnected]);

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

  const fetchAllCampaigns = async () => {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      setAllCampaigns(campaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const fetchMyAppointments = async () => {
    if (!user?.id) return;
    try {
      const appointments = await appointmentService.getAppointmentsByDonor(user.id);
      setMyAppointments(appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  // Get completed donations (appointments with status COMPLETED = id 3)
  const getCompletedDonations = () => {
    return myAppointments.filter(apt => apt.appointmentStatus.id === 3);
  };

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const now = new Date();
    return myAppointments
      .filter(apt =>
        (apt.appointmentStatus.id === 1 || apt.appointmentStatus.id === 2) &&
        new Date(apt.dateAppointment) >= now
      )
      .slice(0, 4);
  };

  // Calculamos cuándo puede volver a donar según su género
  const getNextAvailableDate = (): Date => {
    const completedDonations = getCompletedDonations();

    // Si nunca ha donado, puede hacerlo hoy
    if (completedDonations.length === 0) {
      return new Date();
    }

    // Ordenamos para obtener la última donación
    const sortedDonations = completedDonations.sort((a, b) =>
      new Date(b.dateAppointment).getTime() - new Date(a.dateAppointment).getTime()
    );
    const lastDonation = sortedDonations[0];

    // Periodo de espera: 90 días hombres, 120 mujeres
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

  const canJoinCampaign = (campaign: Campaign): boolean => {
    const nextAvailableDate = getNextAvailableDate();
    const campaignStart = new Date(campaign.startDate);
    return campaignStart >= nextAvailableDate;
  };

  // Calendar helpers
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

  // Filtrar campañas disponibles para este donante
  const getAvailableCampaigns = () => {
    return allCampaigns.filter(campaign => {
      if (!user?.bloodType) return false;

      // Limpiamos los caracteres raros del array de tipos de sangre
      const requiredTypes = campaign.requiredBloodType.split(',').map(t => t.trim().replace(/[\[\]\"]/g, ''));

      // Si es Universal o coincide con mi tipo, me sirve
      return requiredTypes.includes('Universal') || requiredTypes.includes(user.bloodType);
    }).slice(0, 4); // Solo mostramos 4
  };

  return {
    user,
    stats,
    loading,
    error,
    allCampaigns,
    myAppointments,
    currentDate,
    selectedDate,
    filteredCampaigns,
    getCompletedDonations,
    getUpcomingAppointments,
    getNextAvailableDate,
    canDonateNow,
    getDaysUntilNextDonation,
    canJoinCampaign,
    changeMonth,
    handleDayClick,
    clearSelectedDate,
    getAvailableCampaigns,
  };
};
