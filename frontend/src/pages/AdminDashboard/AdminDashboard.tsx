import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { adminService, type BloodDonor, type Hospital, type Appointment, type AppointmentStatus, type Campaign } from '../../services/adminService';
import { useWebSocket } from '../../hooks/useWebSocket';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState<AppointmentStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'donors' | 'hospitals' | 'appointments' | 'campaigns'>('donors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Estados para modales de edición
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // WebSocket para actualizaciones en tiempo real
  const { isConnected, subscribe } = useWebSocket();

  // Cargar todos los datos al inicio
  useEffect(() => {
    fetchData();
  }, []);

  // Suscribirse a actualizaciones en tiempo real
  useEffect(() => {
    if (!isConnected) return;

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
      toast.info(t('dashboard.admin.toasts.newCampaign'));
    });

    // Cleanup: desuscribirnos al desmontar
    return () => {
      if (donorSubscription) donorSubscription();
      if (hospitalSubscription) hospitalSubscription();
      if (appointmentSubscription) appointmentSubscription();
      if (campaignSubscription) campaignSubscription();
    };
  }, [isConnected, subscribe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Usamos Promise.all para cargar todo a la vez (paralelo)
      const [statsData, donorsData, hospitalsData, appsData, statusesData, campaignsData] = await Promise.all([
        dashboardService.getStats(),
        adminService.getBloodDonors(),
        adminService.getHospitals(),
        adminService.getAppointments(),
        adminService.getAppointmentStatuses(),
        adminService.getCampaigns()
      ]);

      setStats(statsData);
      setDonors(donorsData);
      setHospitals(hospitalsData);
      setAppointments(appsData);
      setAppointmentStatuses(statusesData);
      setCampaigns(campaignsData);
      setError(null);
    } catch (err) {
      setError(t('dashboard.admin.errors.loadAdminData'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para borrar donante con confirmación
  const handleDeleteDonor = async (id: number) => {
    if (window.confirm(t('dashboard.admin.confirms.deleteDonor'))) {
      try {
        await adminService.deleteBloodDonor(id);
        // Actualizamos la lista localmente filtrando el eliminado
        setDonors(donors.filter(d => d.id !== id));
        toast.success(t('dashboard.admin.toasts.deleteDonorSuccess'));
      } catch (err) {
        toast.error(t('dashboard.admin.toasts.deleteDonorError'));
      }
    }
  };

  // Función para borrar hospital con confirmación
  const handleDeleteHospital = async (id: number) => {
    if (window.confirm(t('dashboard.admin.confirms.deleteHospital'))) {
      try {
        await adminService.deleteHospital(id);
        // Actualizamos la lista localmente
        setHospitals(hospitals.filter(h => h.id !== id));
        toast.success(t('dashboard.admin.toasts.deleteHospitalSuccess'));
      } catch (err) {
        toast.error(t('dashboard.admin.toasts.deleteHospitalError'));
      }
    }
  };

  // Función para guardar cambios de donante
  const handleSaveDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    try {
      // Preparar datos para enviar al backend
      const donorData: any = {
        firstName: editingDonor.firstName,
        lastName: editingDonor.lastName,
        dni: editingDonor.dni,
        gender: editingDonor.gender,
        email: editingDonor.email,
        phoneNumber: editingDonor.phoneNumber,
        dateOfBirth: editingDonor.dateOfBirth,
      };

      // Si hay tipo de sangre seleccionado, agregar bloodTypeId
      if (editingDonor.bloodType?.id) {
        donorData.bloodType = { id: editingDonor.bloodType.id };
      }

      const updated = await adminService.updateBloodDonor(editingDonor.id, donorData);
      setDonors(donors.map(d => d.id === updated.id ? updated : d));
      setEditingDonor(null);
      toast.success(t('dashboard.admin.toasts.updateDonorSuccess'));
    } catch (err) {
      console.error('Error updating donor:', err);
      toast.error(t('dashboard.admin.toasts.updateDonorError'));
    }
  };

  // Función para guardar cambios de hospital
  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;

    try {
      const updated = await adminService.updateHospital(editingHospital.id, editingHospital);
      setHospitals(hospitals.map(h => h.id === updated.id ? updated : h));
      setEditingHospital(null);
      toast.success(t('dashboard.admin.toasts.updateHospitalSuccess', 'Hospital actualizado correctamente'));
    } catch (err) {
      toast.error(t('dashboard.admin.toasts.updateHospitalError', 'Error al actualizar hospital'));
    }
  };

  // Función para borrar inscripción con confirmación
  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm(t('dashboard.admin.confirms.deleteAppointment'))) {
      try {
        await adminService.deleteAppointment(id);
        setAppointments(appointments.filter(a => a.id !== id));
        toast.success(t('dashboard.admin.toasts.deleteAppointmentSuccess'));
      } catch (err) {
        toast.error(t('dashboard.admin.toasts.deleteAppointmentError'));
      }
    }
  };

  // Función para guardar cambios de inscripción
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      const dataToUpdate = {
        appointmentStatus: editingAppointment.appointmentStatus,
        hospitalComment: editingAppointment.hospitalComment,
        dateAppointment: editingAppointment.dateAppointment,
        hourAppointment: editingAppointment.hourAppointment
      };

      const updated = await adminService.updateAppointment(editingAppointment.id, dataToUpdate);
      setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
      setEditingAppointment(null);
      toast.success(t('dashboard.admin.toasts.updateAppointmentSuccess'));
    } catch (err) {
      toast.error(t('dashboard.admin.toasts.updateAppointmentError', 'Error al actualizar inscripción'));
    }
  };

  // Función para borrar campaña con confirmación
  const handleDeleteCampaign = async (id: number) => {
    if (window.confirm(t('dashboard.admin.confirms.deleteCampaign'))) {
      try {
        await adminService.deleteCampaign(id);
        setCampaigns(campaigns.filter(c => c.id !== id));
        toast.success(t('dashboard.admin.toasts.deleteCampaignSuccess'));
      } catch (err) {
        toast.error(t('dashboard.admin.toasts.deleteCampaignError', 'Error al eliminar campaña'));
      }
    }
  };

  // Función para guardar cambios de campaña
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    try {
      const updated = await adminService.updateCampaign(editingCampaign.id, editingCampaign);
      setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
      setEditingCampaign(null);
      toast.success(t('dashboard.admin.toasts.updateCampaignSuccess'));
    } catch (err) {
      toast.error(t('dashboard.admin.toasts.updateCampaignError', 'Error al actualizar campaña'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">{t('dashboard.admin.loading')}</div>
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

  const chartData = stats ? {
    labels: [t('dashboard.admin.chart.xAxisLabel')],
    datasets: [
      {
        label: t('dashboard.admin.chart.donorsLabel'),
        data: [stats.totalUsers.counts[0]],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: t('dashboard.admin.chart.hospitalsLabel'),
        data: [stats.totalUsers.counts[1]],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  const maxCount = stats ? Math.max(...stats.totalUsers.counts) : 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('dashboard.admin.chart.title'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        max: maxCount + 2,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">{t('dashboard.admin.title')}</h1>

      {/* Graph Section */}
      {chartData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 max-w-4xl mx-auto w-full">
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'donors'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          onClick={() => setActiveTab('donors')}
        >
          {t('dashboard.admin.tabs.donors')}
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'hospitals'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          onClick={() => setActiveTab('hospitals')}
        >
          {t('dashboard.admin.tabs.hospitals')}
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'appointments'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          onClick={() => setActiveTab('appointments')}
        >
          {t('dashboard.admin.tabs.appointments')}
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'campaigns'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          onClick={() => setActiveTab('campaigns')}
        >
          {t('dashboard.admin.tabs.campaigns')}
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {activeTab === 'donors' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.dni')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.gender')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.phone')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.birthDate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.bloodType')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                ) : activeTab === 'hospitals' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.cif')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.phone')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.address')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                ) : activeTab === 'appointments' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.donor')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.campaign')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.comment')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.hospital')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.location')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.progress')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activeTab === 'donors' ? (
                donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{donor.firstName} {donor.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{donor.dni}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{donor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {donor.gender === 'M' ? t('dashboard.admin.table.male') : t('dashboard.admin.table.female')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{donor.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString(undefined) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{donor.bloodType?.type || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => setEditingDonor(donor)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('dashboard.admin.table.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {t('dashboard.admin.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'hospitals' ? (
                hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{hospital.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.cif}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => setEditingHospital(hospital)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('dashboard.admin.table.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteHospital(hospital.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {t('dashboard.admin.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'appointments' ? (
                appointments.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {app.bloodDonor?.firstName} {app.bloodDonor?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{app.bloodDonor?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{app.campaignName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.dateAppointment).toLocaleDateString(undefined)} {app.hourAppointment?.substring(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.appointmentStatus.id === 1 ? 'bg-yellow-100 text-yellow-800' :
                        app.appointmentStatus.id === 2 ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {t(`dashboard.admin.table.statusList.${app.appointmentStatus.id}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title={app.hospitalComment}>
                        {app.hospitalComment || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => setEditingAppointment(app)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('dashboard.admin.table.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(app.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {t('dashboard.admin.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.hospitalName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.startDate).toLocaleDateString(undefined)} - {new Date(campaign.endDate).toLocaleDateString(undefined)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${Math.min(100, ((campaign.currentDonorCount || 0) / campaign.requiredDonorQuantity) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.currentDonorCount || 0}/{campaign.requiredDonorQuantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => setEditingCampaign(campaign)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('dashboard.admin.table.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {t('dashboard.admin.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición de Donante */}
      {editingDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.admin.modals.editDonor')}</h2>
            <form onSubmit={handleSaveDonor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.firstName')} *</label>
                  <input
                    type="text"
                    value={editingDonor.firstName}
                    onChange={(e) => setEditingDonor({ ...editingDonor, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.lastName')} *</label>
                  <input
                    type="text"
                    value={editingDonor.lastName}
                    onChange={(e) => setEditingDonor({ ...editingDonor, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.dni')} *</label>
                  <input
                    type="text"
                    value={editingDonor.dni}
                    onChange={(e) => setEditingDonor({ ...editingDonor, dni: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.gender')} *</label>
                  <select
                    value={editingDonor.gender}
                    onChange={(e) => setEditingDonor({ ...editingDonor, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="M">{t('dashboard.admin.table.male')}</option>
                    <option value="F">{t('dashboard.admin.table.female')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.email')} *</label>
                <input
                  type="email"
                  value={editingDonor.email}
                  onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.phone')}</label>
                  <input
                    type="tel"
                    value={editingDonor.phoneNumber || ''}
                    onChange={(e) => setEditingDonor({ ...editingDonor, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.birthDate')}</label>
                  <input
                    type="date"
                    value={editingDonor.dateOfBirth || ''}
                    onChange={(e) => setEditingDonor({ ...editingDonor, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.bloodType')}</label>
                <select
                  value={editingDonor.bloodType?.id || ''}
                  onChange={(e) => setEditingDonor({
                    ...editingDonor,
                    bloodType: e.target.value ? { id: parseInt(e.target.value), type: '' } : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t('dashboard.admin.modals.bloodTypePlaceholder')}</option>
                  <option value="1">A+</option>
                  <option value="2">A-</option>
                  <option value="3">B+</option>
                  <option value="4">B-</option>
                  <option value="5">AB+</option>
                  <option value="6">AB-</option>
                  <option value="7">0+</option>
                  <option value="8">0-</option>
                </select>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('dashboard.admin.modals.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('dashboard.admin.modals.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición de Hospital */}
      {editingHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.admin.modals.editHospital')}</h2>
            <form onSubmit={handleSaveHospital} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.name')} *</label>
                <input
                  type="text"
                  value={editingHospital.name}
                  onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.cif')} *</label>
                  <input
                    type="text"
                    value={editingHospital.cif}
                    onChange={(e) => setEditingHospital({ ...editingHospital, cif: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.phone')} *</label>
                  <input
                    type="tel"
                    value={editingHospital.phoneNumber}
                    onChange={(e) => setEditingHospital({ ...editingHospital, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.email')} *</label>
                <input
                  type="email"
                  value={editingHospital.email}
                  onChange={(e) => setEditingHospital({ ...editingHospital, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.address')} *</label>
                <input
                  type="text"
                  value={editingHospital.address}
                  onChange={(e) => setEditingHospital({ ...editingHospital, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('dashboard.admin.modals.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('dashboard.admin.modals.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Edición de Inscripción */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.admin.modals.editAppointment')}</h2>
            <form onSubmit={handleSaveAppointment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.status')}</label>
                  <select
                    value={editingAppointment.appointmentStatus.id}
                    onChange={(e) => setEditingAppointment({
                      ...editingAppointment,
                      appointmentStatus: appointmentStatuses.find(s => s.id === parseInt(e.target.value)) || editingAppointment.appointmentStatus
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {appointmentStatuses.map(status => (
                      <option key={status.id} value={status.id}>{t(`dashboard.admin.table.statusList.${status.id}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.date')}</label>
                  <input
                    type="date"
                    value={editingAppointment.dateAppointment}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, dateAppointment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.time')}</label>
                <input
                  type="time"
                  value={editingAppointment.hourAppointment?.substring(0, 5)}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, hourAppointment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.hospitalComment')}</label>
                <textarea
                  value={editingAppointment.hospitalComment || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, hospitalComment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[100px]"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('dashboard.admin.modals.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('dashboard.admin.modals.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Edición de Campaña */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('dashboard.admin.modals.editCampaign')}</h2>
            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.name')} *</label>
                <input
                  type="text"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.description')}</label>
                <textarea
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.startDate')} *</label>
                  <input
                    type="date"
                    value={editingCampaign.startDate}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.endDate')} *</label>
                  <input
                    type="date"
                    value={editingCampaign.endDate}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.location')} *</label>
                <input
                  type="text"
                  value={editingCampaign.location}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.admin.modals.requiredDonors')} *</label>
                <input
                  type="number"
                  value={editingCampaign.requiredDonorQuantity}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, requiredDonorQuantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('dashboard.admin.modals.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('dashboard.admin.modals.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
