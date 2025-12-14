import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { campaignService, type Campaign } from '../services/campaignService';
import { appointmentService, type Appointment } from '../services/appointmentService';
import { dashboardService, type DashboardStats } from '../services/dashboardService';

export const useDonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchStats();
    fetchAllCampaigns();
    if (user?.id) {
      fetchMyAppointments();
    }
  }, [user]);

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

  // Calculate next available donation date based on gender
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

  // Available campaigns for this donor
  const getAvailableCampaigns = () => {
    return allCampaigns.filter(campaign => {
      if (!user?.bloodType) return false;
      const requiredTypes = campaign.requiredBloodType.split(',').map(t => t.trim().replace(/[\[\]\"]/g, ''));
      return requiredTypes.includes('Universal') || requiredTypes.includes(user.bloodType);
    }).slice(0, 4);
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
