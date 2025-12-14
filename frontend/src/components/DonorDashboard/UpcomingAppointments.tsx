import type { Appointment } from '../../services/appointmentService';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Mis próximas citas de donación
      </h2>

      <div className="w-full overflow-hidden">
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-w-[180px]">
              <p className="text-sm text-gray-500">No tienes citas programadas</p>
            </div>
          ) : (
            appointments.map(apt => (
              <div
                key={apt.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow min-w-[200px] snap-start">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Campaña #{apt.campaignId}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Date(apt.dateAppointment).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {apt.hourAppointment || '10:00 AM'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
