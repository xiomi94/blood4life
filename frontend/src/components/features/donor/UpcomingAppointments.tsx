import { useState } from 'react';
import type { Appointment } from '../../../services/appointmentService';
import type { Campaign } from '../../../types/common.types';
import { ConfirmDialog } from '../../common/ui/ConfirmDialog';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  campaigns: Campaign[];
  onDelete?: (appointmentId: number) => void;
}

export const UpcomingAppointments = ({ appointments, campaigns, onDelete }: UpcomingAppointmentsProps) => {
  // Debug: Log appointments to see the data
  console.log('📅 Upcoming Appointments Data:', appointments);

  // State for confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: number;
    hospitalName: string;
    date: string;
  } | null>(null);

  // Helper function to get hospital name
  const getHospitalName = (campaignId: number): string => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.hospitalName || 'Hospital no encontrado';
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
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 min-w-[180px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">No tienes citas programadas</p>
            </div>
          ) : (
            appointments.map(apt => {
              console.log(`Cita #${apt.id} - hourAppointment:`, apt.hourAppointment);
              const hospitalName = getHospitalName(apt.campaignId);
              const formattedDate = new Date(apt.dateAppointment).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

              return (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow min-w-[200px] snap-start relative group">
                  {/* Delete button */}
                  {onDelete && (
                    <button
                      onClick={() => handleDeleteClick(apt.id, hospitalName, formattedDate)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Eliminar cita"
                      aria-label="Eliminar cita">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    {hospitalName}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {formattedDate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Hora: {apt.hourAppointment?.slice(0, 5) || '--:--'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar cita"
        message={appointmentToDelete
          ? `¿Estás seguro de que deseas eliminar la cita en ${appointmentToDelete.hospitalName} el ${appointmentToDelete.date}?`
          : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </section>
  );
};
