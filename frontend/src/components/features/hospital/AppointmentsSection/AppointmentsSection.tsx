import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { appointmentService } from '../../../../services/appointmentService';
import type { AppointmentWithDonor } from '../../../../services/appointmentService';
import { useAuth } from '../../../../context/AuthContext';
import ViewDonorModal from '../ViewDonorModal/ViewDonorModal';

interface AppointmentsSectionProps {
    appointments: AppointmentWithDonor[];
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ appointments }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showNextModal, setShowNextModal] = useState(false);
    const [nextAppointment, setNextAppointment] = useState<AppointmentWithDonor | null>(null);
    const [loadingNext, setLoadingNext] = useState(false);

    // State for viewing donor profile
    const [showDonorProfile, setShowDonorProfile] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<any>(null);

    const handleViewNext = async () => {
        if (!user?.id) return;
        setLoadingNext(true);
        try {
            const next = await appointmentService.getNextAppointment(user.id);
            setNextAppointment(next);
            setShowNextModal(true);
        } catch (error) {
            console.error(error);
            toast.error(t('dashboard.appointments.noNextAppointment') || 'No se encontró una próxima cita');
        } finally {
            setLoadingNext(false);
        }
    };

    const handleOpenDonorProfile = (donor: any) => {
        setSelectedDonor(donor);
        setShowDonorProfile(true);
    };

    return (
        <section className="mb-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {t('dashboard.appointments.title')}
                </h2>
                <button
                    onClick={handleViewNext}
                    disabled={loadingNext}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                    {loadingNext ? t('common.loading') : t('dashboard.appointments.viewNext')}
                </button>
            </div>

            {/* Contenedor limitado en ancho */}
            <div className="w-full overflow-hidden">
                <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 custom-scrollbar">
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
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow min-w-[220px] snap-start relative group"
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        {appointment.bloodDonor
                                            ? `${appointment.bloodDonor.firstName} ${appointment.bloodDonor.lastName} `
                                            : t('dashboard.appointments.unknownDonor')}
                                    </p>

                                    {appointment.bloodDonor && (
                                        <p className="text-xs text-red-500 font-semibold mb-1">
                                            {typeof appointment.bloodDonor.bloodType === 'string'
                                                ? appointment.bloodDonor.bloodType
                                                : (appointment.bloodDonor.bloodType as any)?.type || 'N/A'}
                                        </p>
                                    )}

                                    {appointment.bloodDonor?.dni && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                                            {t('dashboard.appointments.dniLabel')}: {appointment.bloodDonor.dni}
                                        </p>
                                    )}
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                        {appointment.hourAppointment || t('dashboard.appointments.noTime')}
                                    </p>
                                    {/* Display Completed Donations if available */}
                                    {appointment.donorCompletedAppointments !== undefined && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                            <p className="text-xs text-gray-500">
                                                {t('dashboard.appointments.donationsLabel')} <span className="font-semibold text-gray-700 dark:text-gray-300">{appointment.donorCompletedAppointments}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Button to view profile on card hover (optional/nice to have) */}
                                    {appointment.bloodDonor && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDonorProfile(appointment.bloodDonor);
                                            }}
                                            className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title={t('dashboard.appointments.viewProfile')}
                                        >
                                            <span className="text-lg">👤</span>
                                        </button>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </div>

            {/* Modal Next Appointment */}
            {showNextModal && nextAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowNextModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('dashboard.appointments.nextAppointmentTitle')}
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('dashboard.appointments.dateTimeLabel')}</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {nextAppointment.dateAppointment} <span className="text-lg text-gray-600 dark:text-gray-300">{t('dashboard.appointments.at')} {nextAppointment.hourAppointment}</span>
                                </p>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{t('dashboard.appointments.donorLabel')}</p>
                                    <p className="font-semibold text-lg text-gray-800 dark:text-white">
                                        {nextAppointment.bloodDonor?.firstName} {nextAppointment.bloodDonor?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {t('dashboard.appointments.typeLabel')} {
                                            typeof nextAppointment.bloodDonor?.bloodType === 'string'
                                                ? nextAppointment.bloodDonor?.bloodType
                                                : (nextAppointment.bloodDonor?.bloodType as any)?.type || 'N/A'
                                        }
                                    </p>
                                </div>
                                {nextAppointment.bloodDonor && (
                                    <button
                                        onClick={() => handleOpenDonorProfile(nextAppointment.bloodDonor)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline mt-1"
                                    >
                                        {t('dashboard.appointments.viewProfile')}
                                    </button>
                                )}
                            </div>

                            {nextAppointment.donorCompletedAppointments !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {t('dashboard.appointments.historyLabel')} <span className="font-bold">{nextAppointment.donorCompletedAppointments}</span> {t('dashboard.appointments.completedDonations')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowNextModal(false)}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium transition-colors"
                            >
                                {t('dashboard.appointments.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Donor Profile Modal */}
            {showDonorProfile && selectedDonor && (
                <ViewDonorModal
                    donor={selectedDonor}
                    onClose={() => setShowDonorProfile(false)}
                />
            )}
        </section>
    );
};

export default AppointmentsSection;
