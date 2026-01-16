import { useState } from 'react';
import type { Appointment } from '../../../services/appointmentService';
import type { Campaign } from '../../../types/common.types';
import { ConfirmDialog } from '../../common/ui/ConfirmDialog';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  campaigns: Campaign[];
  onDelete?: (appointmentId: number) => void;
  userBloodType?: string;
}

export const UpcomingAppointments = ({ appointments, campaigns, onDelete, userBloodType }: UpcomingAppointmentsProps) => {
  // Debug: Log appointments to see the data
  console.log('📅 Upcoming Appointments Data:', appointments);

  // State for confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: number;
    hospitalName: string;
    date: string;
  } | null>(null);

  // Helper function to get hospital name and location
  const getCampaignDetails = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return {
      hospitalName: campaign?.hospitalName || 'Hospital no encontrado',
      location: campaign?.location || 'Ubicación no disponible'
    };
  };

  const handleDeleteClick = (appointmentId: number, hospitalName: string, date: string) => {
    setAppointmentToDelete({ id: appointmentId, hospitalName, date });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      onDelete?.(appointmentToDelete.id);
    }
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Mis próximas citas de donación
      </h2>

      <div className="w-full overflow-hidden">
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 min-w-[280px]">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No tienes citas programadas</p>
            </div>
          ) : (
            appointments.map(apt => {
              console.log(`Cita #${apt.id} - hourAppointment:`, apt.hourAppointment);
              const { hospitalName, location } = getCampaignDetails(apt.campaignId);
              const formattedDate = new Date(apt.dateAppointment).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

              // Ensure time format is HH:mm
              const formattedTime = apt.hourAppointment ? apt.hourAppointment.slice(0, 5) : '--:--';

              return (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 min-w-[280px] snap-start relative group flex flex-col justify-between hover:shadow-md transition-shadow">

                  {/* Delete button (top right) */}
                  {onDelete && (
                    <button
                      onClick={() => handleDeleteClick(apt.id, hospitalName, formattedDate)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Cancelar cita"
                      aria-label="Cancelar cita">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  {/* Header: Name & Type */}
                  <div className="mb-3 pr-8">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                      {hospitalName}
                    </h3>
                    {userBloodType && (
                      <span className="inline-block px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold border border-red-200 dark:border-red-800/20">
                        {userBloodType}
                      </span>
                    )}
                  </div>

                  {/* Location (like DNI in example) */}
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <span className="font-medium text-gray-400 dark:text-gray-500 uppercase text-xs mr-1">UBICACIÓN:</span>
                    {location}
                  </div>

                  {/* Time (Huge) */}
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {formattedTime}
                  </div>

                  {/* Footer Line */}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{formattedDate}</span>
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-medium">Programada</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Cancelar Cita"
        message={appointmentToDelete
          ? `¿Estás seguro de que deseas cancelar tu cita en ${appointmentToDelete.hospitalName} para el ${appointmentToDelete.date}?`
          : ''
        }
        confirmText="Sí, cancelar cita"
        cancelText="No, mantener cita"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </section>
  );
};
