import { useState } from 'react';
import type { Campaign } from '../../../services/campaignService';

interface EnrollCampaignModalProps {
    campaign: Campaign | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: string, time?: string) => void;
    loading?: boolean;
}

export const EnrollCampaignModal = ({
    campaign,
    isOpen,
    onClose,
    onConfirm,
    loading = false
}: EnrollCampaignModalProps) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

    const timeSlots = [];
    for (let i = 8; i <= 18; i++) {
        timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
        if (i !== 18) timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
    }

    if (!isOpen || !campaign) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            onConfirm(selectedDate, selectedTime);
        }
    };

    const handleClose = () => {
        setSelectedDate('');
        setSelectedTime('');
        setCurrentDate(new Date());
        setCalendarView('days');
        onClose();
    };

    // Helpers del calendario
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // Ajuste para empezar en Lunes (0)
        return day === 0 ? 6 : day - 1;
    };

    const changeMonth = (increment: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    };

    const changeYear = (increment: number) => {
        setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
    };

    const selectMonth = (monthIndex: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setCalendarView('days');
    };

    const selectYear = (year: number) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        setCalendarView('months');
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getFirstDayOfMonth(year, month);
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Días vacíos del mes anterior (relleno)
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Días del mes con lógica de inscripción
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            // Verificamos si podemos inscribirnos
            const isInCampaignRange = dateStr >= campaign.startDate && dateStr <= campaign.endDate;
            const isPast = date < today;
            // Solo disponible si está en rango y no es pasado
            const isAvailable = isInCampaignRange && !isPast;

            const isSelected = dateStr === selectedDate;
            const isToday = date.toDateString() === new Date().toDateString();

            let statusClass = "text-gray-400 dark:text-gray-600 cursor-not-allowed";

            if (isAvailable) {
                statusClass = "bg-green-500 text-white font-medium hover:bg-green-600 cursor-pointer";
            }

            if (isSelected) {
                statusClass = "bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer ring-2 ring-blue-400";
            }

            // Marcamos hoy
            if (isToday && isAvailable && !isSelected) {
                statusClass = "bg-green-400 text-white font-bold hover:bg-green-500 cursor-pointer border-2 border-white";
            }

            days.push(
                <div
                    key={day}
                    className={`p-2 rounded flex items-center justify-center text-sm relative ${statusClass} ${isAvailable ? 'cursor-pointer' : ''}`}
                    onClick={() => isAvailable && setSelectedDate(dateStr)}
                    title={isAvailable ? 'Click para seleccionar esta fecha' : (isPast ? 'Fecha pasada' : 'Fuera del rango de la campaña')}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Inscribirse en Campaña
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left side: Campaign info and form */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                                {campaign.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {campaign.description}
                            </p>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {campaign.location}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha seleccionada
                                </label>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                    {selectedDate ? (
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                                            {new Date(selectedDate).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Selecciona una fecha en el calendario →
                                        </p>
                                    )}
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Hora disponible
                                    </label>
                                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-2 px-1 text-sm rounded-lg border transition-colors ${selectedTime === time
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedDate || !selectedTime}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Inscribiendo...
                                        </>
                                    ) : (
                                        'Confirmar Inscripción'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right side: Calendar */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Selecciona tu fecha</h3>

                            {/* Calendar Navigation */}
                            <div className="flex justify-between items-center mb-4 px-2">
                                <button
                                    onClick={() => calendarView === 'days' ? changeMonth(-1) : changeYear(-1)}
                                    disabled={loading}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50"
                                >
                                    &lt;
                                </button>
                                <div className="flex gap-2">
                                    {calendarView === 'days' && (
                                        <>
                                            <button
                                                onClick={() => setCalendarView('months')}
                                                disabled={loading}
                                                className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                                            >
                                                {monthNames[currentDate.getMonth()]}
                                            </button>
                                            <button
                                                onClick={() => setCalendarView('years')}
                                                disabled={loading}
                                                className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                                            >
                                                {currentDate.getFullYear()}
                                            </button>
                                        </>
                                    )}
                                    {calendarView === 'months' && (
                                        <button
                                            onClick={() => setCalendarView('years')}
                                            disabled={loading}
                                            className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                                        >
                                            {currentDate.getFullYear()}
                                        </button>
                                    )}
                                    {calendarView === 'years' && (
                                        <h3 className="font-semibold text-gray-800 dark:text-white">
                                            {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                                        </h3>
                                    )}
                                </div>
                                <button
                                    onClick={() => calendarView === 'days' ? changeMonth(1) : changeYear(1)}
                                    disabled={loading}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50"
                                >
                                    &gt;
                                </button>
                            </div>

                            {/* Calendar Days View */}
                            {calendarView === 'days' && (
                                <>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        <div>L</div>
                                        <div>M</div>
                                        <div>M</div>
                                        <div>J</div>
                                        <div>V</div>
                                        <div>S</div>
                                        <div>D</div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                        {renderCalendarDays()}
                                    </div>
                                </>
                            )}

                            {/* Calendar Months View */}
                            {calendarView === 'months' && (
                                <div className="grid grid-cols-3 gap-2">
                                    {monthNames.map((month, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectMonth(index)}
                                            disabled={loading}
                                            className={`p-3 rounded-lg text-sm font-medium ${currentDate.getMonth() === index
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                } disabled:opacity-50`}
                                        >
                                            {month}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Calendar Years View */}
                            {calendarView === 'years' && (
                                <div className="grid grid-cols-3 gap-2">
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const startDecade = Math.floor(currentDate.getFullYear() / 10) * 10;
                                        const year = startDecade + i - 1;
                                        const isCurrentYear = year === currentDate.getFullYear();
                                        const isOutOfRange = i === 0 || i === 11;
                                        return (
                                            <button
                                                key={year}
                                                onClick={() => selectYear(year)}
                                                disabled={loading}
                                                className={`p-3 rounded-lg text-sm font-medium ${isCurrentYear
                                                    ? 'bg-blue-500 text-white'
                                                    : isOutOfRange
                                                        ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    } disabled:opacity-50`}
                                            >
                                                {year}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Legend */}
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span>Disponible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                    <span>Seleccionada</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <span>No disponible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
