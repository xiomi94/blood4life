import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useModalAnimation } from '../../../../hooks/useModalAnimation';
import { hospitalService } from '../../../../services/hospitalService';
import { campaignService } from '../../../../services/campaignService';
import { appointmentService } from '../../../../services/appointmentService';
import { useAuth } from '../../../../context/AuthContext';
import type { Hospital } from '../../../../models/Hospital';
import type { Campaign } from '../../../../types/common.types';
import { DonationConfirmation } from './DonationConfirmation';
import { DonationCalendar } from './DonationCalendar';

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


  // Generate time slots based on active campaign hours or default 08:00-18:00
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];

    // Default hours if no campaign
    let startHour = 8;
    let endHour = 18;

    // Use campaign hours if available
    if (activeCampaign?.startTime && activeCampaign?.endTime) {
      const [startH] = activeCampaign.startTime.split(':').map(Number);
      const [endH] = activeCampaign.endTime.split(':').map(Number);
      startHour = startH;
      endHour = endH;
    }

    // Generate slots from start to end hour
    for (let i = startHour; i <= endHour; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      if (i !== endHour) {
        slots.push(`${i.toString().padStart(2, '0')}:30`);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Helper: Check if a time slot is in the past for today's date AND within campaign hours
  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (!selectedDate) return true;

    // Check if time is within campaign's hours
    if (activeCampaign?.startTime && activeCampaign?.endTime) {
      if (timeSlot < activeCampaign.startTime || timeSlot > activeCampaign.endTime) {
        return false;
      }
    }

    // Robust date parsing using local components
    const [y, m, d] = selectedDate.split('-').map(Number);
    const selectedDateObj = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If selected date is not today check if it's future
    if (selectedDateObj.getTime() > today.getTime()) return true;

    // If selected date is in the past (shouldn't happen due to calendar logic but safety check)
    if (selectedDateObj.getTime() < today.getTime()) return false;

    // If it's today, check if time has passed with 1 hour buffer
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    // Add 1 hour buffer - appointments must be at least 1 hour in the future
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return slotTime >= oneHourFromNow;
  };

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
    setShowConfirmation(false);
  };

  // Clear selected time if it's no longer available (e.g., time has passed)
  useEffect(() => {
    if (selectedTime && !isTimeSlotAvailable(selectedTime)) {
      setSelectedTime('');
      toast.info('La hora seleccionada ya no está disponible. Por favor, selecciona otra hora.');
    }
  }, [selectedDate, selectedTime]);

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

    // Validate that selected date and time are not in the past
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);

    // Create date strictly from components to match local string YYYY-MM-DD
    const [y, m, d] = selectedDate.split('-').map(Number);
    const appointmentDateTime = new Date(y, m - 1, d);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    if (appointmentDateTime < now) {
      toast.error('No puedes agendar una cita en una fecha u hora pasada. Por favor, selecciona una fecha y hora futuras.');
      return;
    }

    // Additional check: appointment must be at least 1 hour in the future
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (appointmentDateTime < oneHourFromNow) {
      toast.error('La cita debe programarse con al menos 1 hora de antelación.');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        campaignId: activeCampaign.id,
        bloodDonorId: user.id,
        dateAppointment: selectedDate,
        hourAppointment: selectedTime,
        appointmentStatus: { id: 1, name: 'Programada' }
      };

      // console.log('🚀 Enviando cita al backend:', appointmentData);

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
              <DonationCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                isHospitalSelected={!!selectedHospitalId}
              />
            </div>
          </div>
        ) : (
          <DonationConfirmation
            onConfirm={handleConfirmSubmission}
            onCancel={() => setShowConfirmation(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CreateDonationModal;
