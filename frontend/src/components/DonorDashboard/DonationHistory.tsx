import type { Appointment } from '../../services/appointmentService';

interface DonationHistoryProps {
  donations: Appointment[];
}

export const DonationHistory = ({ donations }: DonationHistoryProps) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Mis donaciones</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Historial de tus donaciones de sangre.</p>

      <div className="space-y-3">
        {donations.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            No tienes donaciones registradas
          </div>
        ) : (
          donations.slice(0, 5).map(donation => (
            <div
              key={donation.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Completado
                </span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Campaña #{donation.campaignId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{donation.hospitalComment || 'Donación completada'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800 dark:text-white">
                  {new Date(donation.dateAppointment).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
