import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { appointmentService } from '../../../../services/appointmentService';
import type { AppointmentWithDonor } from '../../../../services/appointmentService';
import { useAuth } from '../../../../context/AuthContext';
import ViewDonorModal from '../ViewDonorModal/ViewDonorModal';
import { useModalAnimation } from '../../../../hooks/useModalAnimation';

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

    // Animation for inline modal
    const { shouldRender: showNextRender, isVisible: nextVisible } = useModalAnimation(showNextModal);

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
        <section className="mb-4 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {t('dashboard.appointments.title')}
                </h2>
                <button
                    onClick={handleViewNext}
                    disabled={loadingNext}
                    className="px-4 py-2 bg-[#E7000B] hover:bg-[#c40009] dark:bg-[#E7000B]/20 dark:hover:bg-[#E7000B]/30 text-white dark:text-[#ff8080] dark:border dark:border-[#E7000B]/20 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                    {loadingNext ? t('common.loading') : t('dashboard.appointments.viewNext')}
                </button>
            </div>

            {/* Contenedor limitado en ancho */}
            <div className="w-full overflow-hidden">
                <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-4 pr-4 pb-4 custom-scrollbar">
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
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 pt-4 pb-2 hover:shadow-md transition-shadow min-w-[220px] snap-start relative group"
                                >
                                    <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight mb-1 pr-6">
                                        {appointment.bloodDonor
                                            ? `${appointment.bloodDonor.firstName} ${appointment.bloodDonor.lastName} `
                                            : t('dashboard.appointments.unknownDonor')}
                                    </p>

                                    {appointment.bloodDonor && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                {typeof appointment.bloodDonor.bloodType === 'string'
                                                    ? appointment.bloodDonor.bloodType
                                                    : (appointment.bloodDonor.bloodType as any)?.type || 'N/A'}
                                            </span>
                                        </div>
                                    )}

                                    {appointment.bloodDonor?.dni && (
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                            <span className="text-gray-400 dark:text-gray-500 font-normal mr-1">{t('dashboard.appointments.dniLabel')}:</span>
                                            {appointment.bloodDonor.dni}
                                        </p>
                                    )}
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                                        {appointment.hourAppointment?.substring(0, 5) || t('dashboard.appointments.noTime')}
                                    </p>
                                    {/* Display Completed Donations if available */}
                                    {appointment.donorCompletedAppointments !== undefined && (
                                        <div className="pt-1 border-t border-gray-300 dark:border-gray-600 mt-1">
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
                                            className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 z-10"
                                            title={t('dashboard.appointments.viewProfile')}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </div>

            {/* Modal Next Appointment */}
            {showNextRender && nextAppointment && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ${nextVisible ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setShowNextModal(false)}
                >
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative transition-all duration-200 transform ${nextVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                    {new Date(nextAppointment.dateAppointment).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} <span className="text-lg text-gray-600 dark:text-gray-300">{t('dashboard.appointments.at')} {nextAppointment.hourAppointment?.substring(0, 5)}</span>
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
            {selectedDonor && (
                <ViewDonorModal
                    isOpen={showDonorProfile}
                    donor={selectedDonor}
                    onClose={() => setShowDonorProfile(false)}
                />
            )}
        </section>
    );
};

export default AppointmentsSection;
