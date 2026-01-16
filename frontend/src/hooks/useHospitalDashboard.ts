import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from './useWebSocket';
import { dashboardService, type DashboardStats } from '../services/dashboardService';
import { campaignService, type Campaign } from '../services/campaignService';
import { appointmentService, type AppointmentWithDonor } from '../services/appointmentService';

export const useHospitalDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { subscribe, isConnected } = useWebSocket();

    // Stats and loading state
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Campaign state
    const [hospitalCampaigns, setHospitalCampaigns] = useState<Campaign[]>([]);
    const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
    const [showAllCampaigns, setShowAllCampaigns] = useState(false);

    // Modals state
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Selection state for operations
    const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Calendar state
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

    // Appointments state
    const [todayAppointments, setTodayAppointments] = useState<AppointmentWithDonor[]>([]);
    const [monthlyDonations, setMonthlyDonations] = useState<number>(0);

    // Función para cargar estadísticas del servidor
    const fetchStats = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const data = await dashboardService.getStats();
            console.log('📊 Dashboard Stats Refreshed:', data);
            setStats(data);
            setError(null);
        } catch (err) {
            // Si falla en background, quizás no queremos mostrar error y bloquear UI, pero por ahora lo dejamos
            if (!isBackground) setError(t('dashboard.errors.loadStats', 'Error al cargar las estadísticas'));
            console.error('Error fetching dashboard stats:', err);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    // Función para recargar las campañas
    const refreshCampaigns = async () => {
        try {
            console.log('🔄 Refreshing campaigns...');
            // Cargamos todas para el admin o filtros globales
            const allCamps = await campaignService.getAllCampaigns();
            setAllCampaigns(allCamps);

            // Si tenemos usuario, cargamos solo las suyas
            if (user?.id) {
                const hospitalCamps = await campaignService.getCampaignsByHospital(user.id);
                setHospitalCampaigns(hospitalCamps);
            }
        } catch (err) {
            console.error('❌ Error refreshing campaigns:', err);
        }
    };

    // Cargar datos iniciales al entrar en la página
    useEffect(() => {
        fetchStats();
        campaignService.getAllCampaigns().then(setAllCampaigns).catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // User-dependent Fetch
    // Cargar datos que dependen del usuario (mis campañas, citas, donaciones)
    useEffect(() => {
        if (user?.id) {
            refreshCampaigns();

            // Cargar citas de hoy
            appointmentService.getTodayAppointmentsByHospital(user.id)
                .then(setTodayAppointments)
                .catch(console.error);

            // Cargar donaciones del mes
            appointmentService.getMonthlyDonationsByHospital(user.id)
                .then(setMonthlyDonations)
                .catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // WebSocket Subscription
    useEffect(() => {
        if (!isConnected) return;

        const unsubscribeCampaigns = subscribe('/topic/campaigns', (_message) => {
            // Check message structure - if it's just the object or has type, we refresh anyway for safety
            refreshCampaigns();
        });

        const unsubscribeDonors = subscribe('/topic/blood-donors', () => {
            // When a donor updates their profile, wait a bit for DB consistency then refresh
            setTimeout(() => {
                fetchStats(true);
            }, 500);
        });

        return () => {
            if (unsubscribeCampaigns) unsubscribeCampaigns();
            if (unsubscribeDonors) unsubscribeDonors();
        };
    }, [subscribe, refreshCampaigns, isConnected]);

    // Handlers
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
            await campaignService.deleteCampaign(campaignToDelete.id);
            await refreshCampaigns();
            setShowDeleteModal(false);
            setCampaignToDelete(null);
            setDeleteConfirmText('');
        } catch (err) {
            console.error('Error deleting campaign:', err);
            setError(t('dashboard.errors.deleteCampaign', 'Error al eliminar la campaña'));
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCampaignToDelete(null);
        setDeleteConfirmText('');
    };

    return {
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

        // Setters (for simple interactions)
        setShowAllCampaigns,
        setShowCreateCampaignModal,
        setShowEditModal,
        setShowDeleteModal,
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
    };
};
