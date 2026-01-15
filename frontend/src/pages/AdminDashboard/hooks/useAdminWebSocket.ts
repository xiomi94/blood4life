import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useWebSocket } from '../../../hooks/useWebSocket';
import type { BloodDonor, Hospital, Appointment, Campaign } from '../../../services/adminService';

interface UseAdminWebSocketProps {
    isConnected: boolean;
    donors: BloodDonor[];
    hospitals: Hospital[];
    appointments: Appointment[];
    campaigns: Campaign[];
    setDonors: React.Dispatch<React.SetStateAction<BloodDonor[]>>;
    setHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>;
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
    refreshData: () => Promise<void>;
}

export const useAdminWebSocket = ({
    isConnected,
    donors,
    hospitals,
    appointments,
    campaigns,
    setDonors,
    setHospitals,
    setAppointments,
    setCampaigns,
    refreshData
}: UseAdminWebSocketProps) => {
    const { t } = useTranslation();
    const { subscribe } = useWebSocket();

    useEffect(() => {
        if (!isConnected) return;

        try {
            // Suscribirnos a nuevos registros de donantes
            const donorSubscription = subscribe('/topic/blood-donors', (message) => {
                const newDonor = JSON.parse(message.body);
                setDonors(prev => {
                    // Evitar duplicados
                    if (prev.some(d => d.id === newDonor.id)) {
                        return prev.map(d => d.id === newDonor.id ? newDonor : d);
                    }
                    return [...prev, newDonor];
                });
                refreshData(); // Refresh stats chart
                toast.success(t('dashboard.admin.toasts.newDonor'));
            });

            // Suscribirnos a nuevos registros de hospitales
            const hospitalSubscription = subscribe('/topic/hospitals', (message) => {
                const newHospital = JSON.parse(message.body);
                setHospitals(prev => {
                    // Evitar duplicados
                    if (prev.some(h => h.id === newHospital.id)) {
                        return prev.map(h => h.id === newHospital.id ? newHospital : h);
                    }
                    return [...prev, newHospital];
                });
                refreshData(); // Refresh stats
                toast.success(t('dashboard.admin.toasts.newHospital'));
            });

            // Suscribirnos a nuevas inscripciones (appointments)
            const appointmentSubscription = subscribe('/topic/appointments', (message) => {
                const newApp = JSON.parse(message.body);
                setAppointments(prev => {
                    if (prev.some(a => a.id === newApp.id)) {
                        return prev.map(a => a.id === newApp.id ? newApp : a);
                    }
                    return [newApp, ...prev];
                });
                refreshData(); // Refresh stats
                toast.info(t('dashboard.admin.toasts.newAppointment'));
            });

            // Suscribirnos a nuevas campañas
            const campaignSubscription = subscribe('/topic/campaigns', (message) => {
                const newCampaign = JSON.parse(message.body);
                setCampaigns(prev => {
                    if (prev.some(c => c.id === newCampaign.id)) {
                        return prev.map(c => c.id === newCampaign.id ? newCampaign : c);
                    }
                    return [newCampaign, ...prev];
                });
                refreshData(); // Refresh stats
                toast.info(t('dashboard.admin.toasts.newCampaign'));
            });

            // Cleanup: desuscribirnos al desmontar
            return () => {
                if (donorSubscription) donorSubscription();
                if (hospitalSubscription) hospitalSubscription();
                if (appointmentSubscription) appointmentSubscription();
                if (campaignSubscription) campaignSubscription();
            };
        } catch (error) {
            console.warn('WebSocket subscription error (will retry):', error);
            // No hacer nada - el componente seguirá funcionando sin WebSocket
        }
    }, [isConnected, subscribe, donors, hospitals, appointments, campaigns, refreshData]);
};
