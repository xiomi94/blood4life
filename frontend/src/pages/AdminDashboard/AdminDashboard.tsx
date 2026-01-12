import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAdminData } from './hooks/useAdminData';
import { useAdminWebSocket } from './hooks/useAdminWebSocket';
import { AdminStats } from './components/AdminStats';
import { AdminTabs, type TabType } from './components/AdminTabs';
import { EditDonorModal, EditAppointmentModal, EditHospitalModal, EditCampaignModal } from './components/modals';
import Button from '../../components/common/ui/Button/Button';
import ConfirmDialog from '../../components/common/feedback/ConfirmDialog/ConfirmDialog';
import type { BloodDonor, Hospital, Appointment, Campaign } from '../../services/adminService';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('donors');

  // Estados de modales
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Estados para confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'donor' | 'hospital' | 'appointment' | 'campaign' | null;
    data: BloodDonor | Hospital | Appointment | Campaign | null;
  }>({ isOpen: false, type: null, data: null });

  // Hook personalizado para datos admin
  const {
    stats,
    donors,
    hospitals,
    appointments,
    campaigns,
    appointmentStatuses,
    loading,
    error,
    setDonors,
    setHospitals,
    setAppointments,
    setCampaigns,
    updateDonor,
    updateHospital,
    updateAppointment,
    updateCampaign,
    handleDeleteDonor,
    handleDeleteHospital,
    handleDeleteAppointment,
    handleDeleteCampaign,
  } = useAdminData();

  // WebSocket para actualizaciones en tiempo real
  const { isConnected } = useWebSocket();

  useAdminWebSocket({
    isConnected,
    donors,
    hospitals,
    appointments,
    campaigns,
    setDonors,
    setHospitals,
    setAppointments,
    setCampaigns,
  });

  // Funciones wrapper para confirmación de eliminación
  const openDeleteConfirm = (type: 'donor' | 'hospital' | 'appointment' | 'campaign', data: BloodDonor | Hospital | Appointment | Campaign) => {
    setConfirmDelete({ isOpen: true, type, data });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, type: null, data: null });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete.data || !confirmDelete.type) return;

    const id = confirmDelete.data.id;

    switch (confirmDelete.type) {
      case 'donor':
        await handleDeleteDonor(id);
        break;
      case 'hospital':
        await handleDeleteHospital(id);
        break;
      case 'appointment':
        await handleDeleteAppointment(id);
        break;
      case 'campaign':
        await handleDeleteCampaign(id);
        break;
    }
    closeDeleteConfirm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          {t('dashboard.admin.loading')}
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
        {t('dashboard.admin.title')}
      </h1>

      {/* Estadísticas */}
      <AdminStats stats={stats} />

      {/* Tabs */}
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tabla de contenido */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {activeTab === 'donors' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.dni')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.gender')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.bloodType')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                )}
                {activeTab === 'hospitals' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.cif')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.email')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.phone')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.address')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                )}
                {activeTab === 'appointments' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.donor')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.campaign')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.comment')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.admin.table.actions')}</th>
                  </>
                )}
                {activeTab === 'campaigns' && (
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
              {/* Tabla de Donantes */}
              {activeTab === 'donors' &&
                donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {donor.firstName} {donor.lastName}
                      </div>
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
                      <div className="text-sm text-gray-500 dark:text-gray-400">{donor.bloodType?.type || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="blue"
                          onClick={() => setEditingDonor(donor)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.edit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('dashboard.admin.table.edit')}
                        </Button>
                        <Button
                          variant="red"
                          onClick={() => openDeleteConfirm('donor', donor)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('dashboard.admin.table.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Tabla de Hospitales */}
              {activeTab === 'hospitals' &&
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="blue"
                          onClick={() => setEditingHospital(hospital)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.edit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('dashboard.admin.table.edit')}
                        </Button>
                        <Button
                          variant="red"
                          onClick={() => openDeleteConfirm('hospital', hospital)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('dashboard.admin.table.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Tabla de Citas */}
              {activeTab === 'appointments' &&
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
                      {new Date(app.dateAppointment).toLocaleDateString()} {app.hourAppointment?.substring(0, 5)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="blue"
                          onClick={() => setEditingAppointment(app)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.edit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('dashboard.admin.table.edit')}
                        </Button>
                        <Button
                          variant="red"
                          onClick={() => openDeleteConfirm('appointment', app)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('dashboard.admin.table.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Tabla de Campañas */}
              {activeTab === 'campaigns' &&
                campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.hospitalName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
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
                      <div className="flex gap-2">
                        <Button
                          variant="blue"
                          onClick={() => setEditingCampaign(campaign)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.edit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('dashboard.admin.table.edit')}
                        </Button>
                        <Button
                          variant="red"
                          onClick={() => openDeleteConfirm('campaign', campaign)}
                          className="!px-3 !py-1.5 text-xs"
                          aria-label={t('dashboard.admin.table.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('dashboard.admin.table.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {editingDonor && (
        <EditDonorModal
          donor={editingDonor}
          onSave={updateDonor}
          onClose={() => setEditingDonor(null)}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          appointmentStatuses={appointmentStatuses}
          onSave={updateAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}

      {editingHospital && (
        <EditHospitalModal
          hospital={editingHospital}
          onSave={updateHospital}
          onClose={() => setEditingHospital(null)}
        />
      )}

      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onSave={updateCampaign}
          onClose={() => setEditingCampaign(null)}
        />
      )}

      {/* Dialog de confirmación de eliminación con detalles enriquecidos */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteAction}
        title={t(`dashboard.admin.confirms.delete${confirmDelete.type?.charAt(0).toUpperCase()}${confirmDelete.type?.slice(1)}`)}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      >
        <div className="flex justify-center mt-2">
          {/* Wrapper con diseño consistente */}
          <div className="space-y-4 inline-flex flex-col items-start bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full max-w-sm">

            {/* DONANTE */}
            {confirmDelete.type === 'donor' && confirmDelete.data && (
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {(confirmDelete.data as BloodDonor).firstName} {(confirmDelete.data as BloodDonor).lastName}
                  </span>
                </div>

                <div className="flex flex-col gap-3 pl-12 w-full">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    <span>DNI: <span className="font-semibold text-gray-900 dark:text-gray-200">{(confirmDelete.data as BloodDonor).dni}</span></span>
                  </div>
                  {/* Blood Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      {(confirmDelete.data as BloodDonor).bloodType?.type || 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* HOSPITAL */}
            {confirmDelete.type === 'hospital' && confirmDelete.data && (
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                    {(confirmDelete.data as Hospital).name}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pl-12 w-full text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>CIF: <span className="font-semibold text-gray-900 dark:text-gray-300">{(confirmDelete.data as Hospital).cif}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="truncate max-w-[200px]" title={(confirmDelete.data as Hospital).email}>{(confirmDelete.data as Hospital).email}</span>
                  </div>
                </div>
              </>
            )}

            {/* CITA */}
            {confirmDelete.type === 'appointment' && confirmDelete.data && (
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cita de</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {(confirmDelete.data as Appointment).bloodDonor?.firstName} {(confirmDelete.data as Appointment).bloodDonor?.lastName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pl-12 w-full text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{(confirmDelete.data as Appointment).campaignName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium">
                      {new Date((confirmDelete.data as Appointment).dateAppointment).toLocaleDateString()}
                      <span className="mx-1.5 text-gray-300">|</span>
                      {(confirmDelete.data as Appointment).hourAppointment?.substring(0, 5)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* CAMPAÑA */}
            {confirmDelete.type === 'campaign' && confirmDelete.data && (
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {(confirmDelete.data as Campaign).name}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pl-12 w-full text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="truncate max-w-[200px]" title={(confirmDelete.data as Campaign).location}>{(confirmDelete.data as Campaign).location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {new Date((confirmDelete.data as Campaign).startDate).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {new Date((confirmDelete.data as Campaign).endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Default fallback just in case */}
            {!confirmDelete.data && <p className="text-gray-600 dark:text-gray-400">¿Está seguro que desea eliminar este elemento?</p>}

          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default AdminDashboard;
