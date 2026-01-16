import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { dashboardService, type DashboardStats } from '../../../services/dashboardService';
import { adminService, type BloodDonor, type Hospital, type Campaign, type AdminAppointment, type AppointmentStatus } from '../../../services/adminService';

export const useAdminData = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [donors, setDonors] = useState<BloodDonor[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [appointmentStatuses, setAppointmentStatuses] = useState<AppointmentStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { t } = useTranslation();
    const { isAuthenticated, userType, user } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);

            // Usamos Promise.allSettled para identificar qué falla
            const results = await Promise.allSettled([
                dashboardService.getStats(),
                adminService.getBloodDonors(),
                adminService.getHospitals(),
                adminService.getAppointments(),
                adminService.getAppointmentStatuses(),
                adminService.getCampaigns()
            ]);

            const labels = ['Stats', 'Donors', 'Hospitals', 'Appointments', 'Statuses', 'Campaigns'];

            // Log de resultados para debugging
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`❌ Failed to load ${labels[index]}:`, result.reason);
                } else {
                    console.log(`✅ Successfully loaded ${labels[index]}`);
                }
            });

            // Establecer los datos que SÍ se cargaron, independientemente de algunos fallos
            setStats(results[0].status === 'fulfilled' ? results[0].value : null);
            setDonors(results[1].status === 'fulfilled' ? results[1].value : []);
            setHospitals(results[2].status === 'fulfilled' ? results[2].value : []);
            setAppointments(results[3].status === 'fulfilled' ? results[3].value : []);
            setAppointmentStatuses(results[4].status === 'fulfilled' ? results[4].value : []);
            setCampaigns(results[5].status === 'fulfilled' ? results[5].value : []);

            // Verificar si todas tuvieron éxito
            const allSuccessful = results.every(r => r.status === 'fulfilled');

            if (!allSuccessful) {
                // Identificar qué falló pero NO bloquear el dashboard
                const failed = results
                    .map((result, index) => result.status === 'rejected' ? labels[index] : null)
                    .filter(Boolean);

                console.warn('⚠️ Some data failed to load:', failed.join(', '));
                // NO establecemos error para que el dashboard se muestre de todas formas
            }

            // Siempre limpiar error para mostrar el dashboard
            setError(null);
        } catch (err) {
            setError(t('dashboard.admin.errors.loadAdminData'));
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos solo cuando el usuario esté autenticado como admin Y el perfil esté cargado
    useEffect(() => {
        if (isAuthenticated && userType === 'admin' && user !== null) {
            fetchData();
        }
    }, [isAuthenticated, userType, user]);

    // Función para borrar donante
    const handleDeleteDonor = async (id: number) => {
        try {
            await adminService.deleteBloodDonor(id);
            setDonors(donors.filter(d => d.id !== id));
            toast.success(t('dashboard.admin.toasts.deleteDonorSuccess'));
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.deleteDonorError'));
        }
    };

    // Función para borrar hospital
    const handleDeleteHospital = async (id: number) => {
        try {
            await adminService.deleteHospital(id);
            setHospitals(hospitals.filter(h => h.id !== id));
            toast.success(t('dashboard.admin.toasts.deleteHospitalSuccess'));
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.deleteHospitalError'));
        }
    };

    // Función para borrar inscripción
    const handleDeleteAppointment = async (id: number) => {
        try {
            await adminService.deleteAppointment(id);
            setAppointments(appointments.filter(a => a.id !== id));
            toast.success(t('dashboard.admin.toasts.deleteAppointmentSuccess'));
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.deleteAppointmentError'));
        }
    };

    // Función para borrar campaña
    const handleDeleteCampaign = async (id: number) => {
        try {
            await adminService.deleteCampaign(id);
            setCampaigns(campaigns.filter(c => c.id !== id));
            toast.success(t('dashboard.admin.toasts.deleteCampaignSuccess'));
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.deleteCampaignError'));
        }
    };

    // Función para actualizar donantes
    const updateDonor = async (donor: BloodDonor) => {
        try {
            const donorData: any = {
                firstName: donor.firstName,
                lastName: donor.lastName,
                dni: donor.dni,
                gender: donor.gender,
                email: donor.email,
                phoneNumber: donor.phoneNumber,
                dateOfBirth: donor.dateOfBirth,
            };

            if (donor.bloodType?.id) {
                donorData.bloodType = { id: donor.bloodType.id };
            }

            const updated = await adminService.updateBloodDonor(donor.id!, donorData);
            setDonors(donors.map(d => d.id === updated.id ? updated : d));
            toast.success(t('dashboard.admin.toasts.updateDonorSuccess'));
            return true;
        } catch (err) {
            console.error('Error updating donor:', err);
            toast.error(t('dashboard.admin.toasts.updateDonorError'));
            return false;
        }
    };

    // Función para actualizar hospitales
    const updateHospital = async (hospital: Hospital) => {
        try {
            const updated = await adminService.updateHospital(hospital.id!, hospital);
            setHospitals(hospitals.map(h => h.id === updated.id ? updated : h));
            toast.success(t('dashboard.admin.toasts.updateHospitalSuccess'));
            return true;
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.updateHospitalError'));
            return false;
        }
    };

    // Función para actualizar inscripciones
    const updateAppointment = async (appointment: AdminAppointment) => {
        try {
            const dataToUpdate = {
                appointmentStatus: appointment.appointmentStatus,
                hospitalComment: appointment.hospitalComment,
                dateAppointment: appointment.dateAppointment,
                hourAppointment: appointment.hourAppointment
            };

            const updated = await adminService.updateAppointment(appointment.id, dataToUpdate);
            setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
            toast.success(t('dashboard.admin.toasts.updateAppointmentSuccess'));
            return true;
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.updateAppointmentError'));
            return false;
        }
    };

    // Función para actualizar campañas
    const updateCampaign = async (campaign: Campaign) => {
        try {
            const updated = await adminService.updateCampaign(campaign.id, campaign);
            setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
            toast.success(t('dashboard.admin.toasts.updateCampaignSuccess'));
            return true;
        } catch (err) {
            toast.error(t('dashboard.admin.toasts.updateCampaignError'));
            return false;
        }
    };

    return {
        // Estado
        stats,
        donors,
        hospitals,
        appointments,
        campaigns,
        appointmentStatuses,
        loading,
        error,

        // Métodos de actualización
        setDonors,
        setHospitals,
        setAppointments,
        setCampaigns,

        // Acciones
        updateDonor,
        updateHospital,
        updateAppointment,
        updateCampaign,
        handleDeleteDonor,
        handleDeleteHospital,
        handleDeleteAppointment,
        handleDeleteCampaign,
        fetchData,
    };
};
