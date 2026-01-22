import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useModalAnimation } from '../../../../hooks/useModalAnimation';
import { hospitalService } from '../../../../services/hospitalService';
import { campaignService } from '../../../../services/campaignService';
import { appointmentService } from '../../../../services/appointmentService';
import { useAuth } from '../../../../context/AuthContext';
import type { Hospital } from '../../../../models/Hospital';
import type { Campaign } from '../../../../types/common.types';

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateDonationModal: React.FC<CreateDonationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { shouldRender, isVisible } = useModalAnimation(isOpen);

  // Data & Selection State
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  // Appointment State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Constants
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const timeSlots = [];
  for (let i = 8; i <= 18; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 18) timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  // Confirmation State
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load Hospitals on Open and Check Availability
  useEffect(() => {
    if (isOpen) {
      loadHospitals();
      resetState();
      checkDonationEligibility();
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const loadHospitals = async () => {
    setLoadingData(true);
    try {
      const data = await hospitalService.getHospitales();
      setHospitals(data);
    } catch (error) {
      toast.error('Error al cargar hospitales');
    } finally {
      setLoadingData(false);
    }
  };

  const resetState = () => {
    setSelectedHospitalId('');
    setActiveCampaign(null);
    setSelectedDate('');
    setSelectedTime('');
    setCurrentDate(new Date());
    setCalendarView('days');
    setShowConfirmation(false);
  };

  // Check if donor can create a new appointment
  const checkDonationEligibility = async () => {
    if (!user?.id) return;

    try {
      const appointments = await appointmentService.getAppointmentsByDonor(user.id);

      // Check for pending or confirmed appointments (status 1 or 2)
      const upcomingAppointments = appointments.filter(
        apt => (apt.appointmentStatus.id === 1 || apt.appointmentStatus.id === 2) &&
          new Date(apt.dateAppointment) >= new Date()
      );

      if (upcomingAppointments.length > 0) {
        const nextAppointment = upcomingAppointments[0];
        const appointmentDate = new Date(nextAppointment.dateAppointment);
        const waitingPeriod = user.gender === 'Masculino' ? 90 : 120;
        const waitingMonths = user.gender === 'Masculino' ? 3 : 4;
        const availableDate = new Date(appointmentDate);
        availableDate.setDate(availableDate.getDate() + waitingPeriod);

        toast.error(
          `No puedes inscribirte a una nueva campaña porque ya tienes una cita programada. ` +
          `Debes esperar ${waitingMonths} meses entre cada donación. ` +
          `Podrás agendar nuevamente a partir del ${availableDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
          { duration: 8000 }
        );
        onClose();
        return;
      }

      // Check for completed donations (status 3)
      const completedDonations = appointments.filter(apt => apt.appointmentStatus.id === 3);

      if (completedDonations.length > 0) {
        const sortedDonations = completedDonations.sort(
          (a, b) => new Date(b.dateAppointment).getTime() - new Date(a.dateAppointment).getTime()
        );
        const lastDonation = sortedDonations[0];
        const lastDonationDate = new Date(lastDonation.dateAppointment);
        const waitingPeriod = user.gender === 'Masculino' ? 90 : 120;
        const waitingMonths = user.gender === 'Masculino' ? 3 : 4;
        const availableDate = new Date(lastDonationDate);
        availableDate.setDate(availableDate.getDate() + waitingPeriod);

        const now = new Date();
        if (now < availableDate) {
          const daysRemaining = Math.ceil((availableDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          toast.error(
            `No puedes inscribirte a una nueva campaña porque debes respetar el tiempo de espera obligatorio entre donaciones. ` +
            `Como ${user.gender === 'Masculino' ? 'hombre' : 'mujer'}, debes esperar ${waitingMonths} meses (${waitingPeriod} días) entre cada donación. ` +
            `Te quedan ${daysRemaining} días de espera. Podrás donar nuevamente desde el ${availableDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
            { duration: 8000 }
          );
          onClose();
          return;
        }
      }
    } catch (error) {
      console.error('Error checking donation eligibility:', error);
    }
  };

  // Handle Hospital Selection -> Find Active Campaign
  const handleHospitalChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospitalId = e.target.value;
    setSelectedHospitalId(hospitalId);
    setSelectedDate('');
    setSelectedTime('');
    setActiveCampaign(null);

    if (!hospitalId) return;

    // Try to find an active campaign for this hospital to link the appointment to.
    try {
      setLoadingData(true);
      const allCampaigns = await campaignService.getAllCampaigns();
      const campaign = allCampaigns.find(c => c.hospitalId === parseInt(hospitalId));

      if (campaign) {
        setActiveCampaign(campaign);
      } else {
        // Warning but we don't block. We assume we might need a fallback or block submission if backend requires it.
        // For this requirement ("any day available"), we continue.
        // toast.warning('Este hospital no tiene campañas activas, pero puedes solicitar cita.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Start Monday
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const changeYear = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };


  const renderCalendarDays = () => {
    // ... existing implementation ...
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty slots
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay(); // 0 (Sunday) - 6 (Saturday)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let isAvailable = false;
      let statusClass = "text-gray-300 dark:text-gray-600 cursor-not-allowed";

      // Availability Logic: Hospital Selected + Not Weekend + Future/Today
      if (selectedHospitalId) {
        if (date >= today && !isWeekend) {
          isAvailable = true;
          // Available days are neutral gray in dark/light mode (matching dashboard style)
          statusClass = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer";
        }
      }

      const isSelected = dateStr === selectedDate;

      if (isSelected) {
        statusClass = "bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer shadow-md";
      } else if (date.getTime() === today.getTime() && isAvailable) {
        statusClass += " border border-blue-400 font-semibold";
      }

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${statusClass}`}
          onClick={() => isAvailable && setSelectedDate(dateStr)}
        >
          {day}
        </div>
      );
    }
    return days;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedDate || !selectedTime) return;

    if (!activeCampaign) {
      toast.error('No se encontró una campaña activa para asociar la cita.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = async () => {
    if (!user?.id || !activeCampaign) return;

    setLoading(true);
    try {
      const appointmentData = {
        campaignId: activeCampaign.id,
        bloodDonorId: user.id,
        dateAppointment: selectedDate,
        hourAppointment: selectedTime,
        appointmentStatus: { id: 1, name: 'Programada' }
      };

      console.log('🚀 Enviando cita al backend:', appointmentData);

      await appointmentService.createAppointment(appointmentData);

      toast.success('Cita confirmada correctamente');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full p-6 lg:p-8 max-h-[90vh] overflow-y-auto relative z-10 transform transition-all duration-300 scale-100">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          {/* Header Content hidden in confirmation mode for cleaner look or kept? Kept is fine */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {showConfirmation ? 'Confirmación Requerida' : 'Nueva Donación'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {showConfirmation ? 'Por favor revisa la siguiente información' : 'Selecciona un hospital y elige cualquier fecha disponible'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {!showConfirmation ? (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Column: Form & Info */}
            <div className="flex-1 space-y-6">
              {/* Hospital Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Hospital / Centro
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={handleHospitalChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                >
                  <option value="" disabled hidden>Seleccionar hospital...</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                {loadingData && <p className="text-sm text-blue-500 mt-2 animate-pulse">Buscando disponibilidad...</p>}
              </div>

              {/* Selected Date Display */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Fecha seleccionada
                </label>
                <div className={`px-4 py-3 rounded-xl border transition-colors ${selectedDate
                  ? 'bg-white dark:bg-gray-700 border-green-500/50 text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}>
                  {selectedDate ? (
                    <span className="font-medium">
                      {(() => {
                        const dateStr = new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                        return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
                      })()}
                    </span>
                  ) : (
                    <span>Selecciona una fecha en el calendario</span>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hora
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 text-sm rounded-lg border transition-all duration-200 ${selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:text-blue-500'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedDate || !selectedTime || !activeCampaign}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loading ? 'Confirmando...' : 'Confirmar Cita'}
                </button>
              </div>
            </div>

            {/* Right Column: Custom Calendar */}
            <div className="lg:w-[400px] flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">

                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => {
                      if (calendarView === 'days') changeMonth(-1);
                      else if (calendarView === 'months') changeYear(-1);
                      else changeYear(-10);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 font-bold"
                  >
                    &lt;
                  </button>

                  <div className="flex gap-2 items-center">
                    {calendarView === 'days' && (
                      <>
                        <button
                          onClick={() => setCalendarView('months')}
                          className="font-bold text-gray-900 dark:text-white text-lg capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {monthNames[currentDate.getMonth()]}
                        </button>
                        <button
                          onClick={() => setCalendarView('years')}
                          className="font-bold text-gray-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {currentDate.getFullYear()}
                        </button>
                      </>
                    )}
                    {calendarView === 'months' && (
                      <button
                        onClick={() => setCalendarView('years')}
                        className="font-bold text-gray-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {currentDate.getFullYear()}
                      </button>
                    )}
                    {calendarView === 'years' && (
                      <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (calendarView === 'days') changeMonth(1);
                      else if (calendarView === 'months') changeYear(1);
                      else changeYear(10);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 font-bold"
                  >
                    &gt;
                  </button>
                </div>

                {/* Calendar Views */}
                <div className="mb-2">
                  {calendarView === 'days' && (
                    <>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                          <div key={d} className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {renderCalendarDays()}
                      </div>
                    </>
                  )}

                  {calendarView === 'months' && (
                    <div className="grid grid-cols-3 gap-3">
                      {monthNames.map((month, index) => (
                        <button
                          key={month}
                          onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(index);
                            setCurrentDate(newDate);
                            setCalendarView('days');
                          }}
                          className={`p-3 rounded-xl text-sm font-semibold transition-all ${currentDate.getMonth() === index
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}

                  {calendarView === 'years' && (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 12 }, (_, i) => {
                        const startYear = Math.floor(currentDate.getFullYear() / 10) * 10 - 1;
                        const year = startYear + i;
                        const isCurrentDecade = year >= startYear + 1 && year <= startYear + 10;

                        return (
                          <button
                            key={year}
                            onClick={() => {
                              const newDate = new Date(currentDate);
                              newDate.setFullYear(year);
                              setCurrentDate(newDate);
                              setCalendarView('months');
                            }}
                            className={`p-3 rounded-xl text-sm font-semibold transition-all ${currentDate.getFullYear() === year
                              ? 'bg-blue-600 text-white shadow-lg'
                              : isCurrentDecade
                                ? 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                : 'text-gray-400 dark:text-gray-600'
                              }`}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Legend - Outside Calendar */}
              {selectedHospitalId ? (
                <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 opacity-70" aria-hidden="true"></span>
                    <span>Día seleccionado</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Información Importante
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                Una vez programada la cita tendrás un tiempo de espera hasta poder donar de nuevo:
              </p>
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 inline-block text-left">
                <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span><strong>3 meses</strong> para los hombres</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span><strong>4 meses</strong> para las mujeres</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-6">
                ¿Estás de acuerdo con estas condiciones?
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-md pt-2">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmSubmission}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirmando...
                  </>
                ) : (
                  'Sí, acepto'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDonationModal;
