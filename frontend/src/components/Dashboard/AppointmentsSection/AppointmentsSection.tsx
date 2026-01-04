import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AppointmentWithDonor } from '../../../services/appointmentService';

interface AppointmentsSectionProps {
    appointments: AppointmentWithDonor[];
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ appointments }) => {
    const { t } = useTranslation();

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t('dashboard.appointments.title')}
            </h2>

            {/* Contenedor limitado en ancho */}
            <div className="w-full overflow-hidden">
                <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                    {appointments.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 min-w-[280px]">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                {t('dashboard.appointments.noAppointments')}
                            </p>
                        </div>
                    ) : (
                        appointments
                            .sort((a, b) => {
                                const timeA = a.hourAppointment || '00:00';
                                const timeB = b.hourAppointment || '00:00';
                                return timeA.localeCompare(timeB);
                            })
                            .map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow min-w-[180px] snap-start"
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        {appointment.bloodDonor
                                            ? `${appointment.bloodDonor.firstName} ${appointment.bloodDonor.lastName} (${appointment.bloodDonor.bloodType})`
                                            : t('dashboard.appointments.unknownDonor')}
                                    </p>
                                    {appointment.bloodDonor?.dni && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                                            {t('dashboard.appointments.dniLabel')}: {appointment.bloodDonor.dni}
                                        </p>
                                    )}
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {appointment.hourAppointment || t('dashboard.appointments.noTime')}
                                    </p>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default AppointmentsSection;
