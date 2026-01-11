import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Campaign } from '../../../../services/campaignService';

interface CalendarSectionProps {
    campaigns: Campaign[];
    onDayClick: (dateStr: string, campaignsOnDay: Campaign[]) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ campaigns, onDayClick }) => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

    const monthNames = [
        t('dashboard.calendar.months.january'),
        t('dashboard.calendar.months.february'),
        t('dashboard.calendar.months.march'),
        t('dashboard.calendar.months.april'),
        t('dashboard.calendar.months.may'),
        t('dashboard.calendar.months.june'),
        t('dashboard.calendar.months.july'),
        t('dashboard.calendar.months.august'),
        t('dashboard.calendar.months.september'),
        t('dashboard.calendar.months.october'),
        t('dashboard.calendar.months.november'),
        t('dashboard.calendar.months.december')
    ];

    // Función para saber cuántos días tiene un mes
    const getDaysInMonth = (year: number, month: number) => {
        // Al poner día 0 del mes siguiente, nos da el último del actual
        return new Date(year, month + 1, 0).getDate();
    };

    // Función para saber en qué día de la semana empieza el mes (0=Domingo, 1=Lunes...)
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // Ajustamos para que la semana empiece en Lunes (0) en lugar de Domingo
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
        const nowStr = new Date().toISOString().split('T')[0];

        // Espacios vacíos del principio (días del mes anterior)
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            // Creamos string de fecha YYYY-MM-DD
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Buscamos si hay campañas en este día
            const campaignsOnDay = campaigns.filter(c =>
                dateStr >= c.startDate && dateStr <= c.endDate
            );

            // Decidimos el color según el estado
            let statusClass = "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white";

            if (campaignsOnDay.length > 0) {
                // Comprobamos fechas de la primera campaña (o todas)
                const isPast = campaignsOnDay.every(c => c.endDate < nowStr);
                const isFuture = campaignsOnDay.every(c => c.startDate > nowStr);
                const isActive = campaignsOnDay.some(c => c.startDate <= nowStr && c.endDate >= nowStr);

                if (isActive) {
                    statusClass = "bg-green-500 text-white font-medium hover:bg-green-600 cursor-pointer relative";
                } else if (isFuture) {
                    statusClass = "bg-blue-400 text-white font-medium hover:bg-blue-500 cursor-pointer relative";
                } else if (isPast) {
                    statusClass = "bg-red-500 text-white font-medium hover:bg-red-600 cursor-pointer relative";
                }
            }

            // Marcamos el día de hoy
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            if (isToday && campaignsOnDay.length === 0) {
                statusClass = "bg-blue-100 text-blue-800 font-bold border border-blue-300";
            }

            days.push(
                <div
                    key={day}
                    className={`p-2 rounded flex items-center justify-center text-sm relative ${statusClass} ${campaignsOnDay.length > 0 ? 'cursor-pointer' : ''}`}
                    title={campaignsOnDay.map(c => c.name).join(', ')}
                    onClick={() => onDayClick(dateStr, campaignsOnDay)}
                >
                    {/* Start Date Marker (Top-Left) */}
                    {campaignsOnDay.some(c => c.startDate === dateStr) && (
                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-black dark:border-t-white border-r-transparent"></div>
                    )}

                    {day}

                    {/* End Date Marker (Bottom-Right) */}
                    {campaignsOnDay.some(c => c.endDate === dateStr) && (
                        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[10px] border-l-[10px] border-b-black dark:border-b-white border-l-transparent"></div>
                    )}

                    {campaignsOnDay.length >= 2 && (
                        <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-black dark:text-gray-900 bg-white/80 dark:bg-gray-100/90 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                            {campaignsOnDay.length}
                        </span>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dashboard.calendar.title')}</h2>

            <div className="mb-3">
                <div className="flex justify-between items-center mb-4 px-2">
                    <button
                        onClick={() => calendarView === 'days' ? changeMonth(-1) : changeYear(-1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                    >
                        &lt;
                    </button>
                    <div className="flex gap-2">
                        {calendarView === 'days' && (
                            <>
                                <button
                                    onClick={() => setCalendarView('months')}
                                    className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    {monthNames[currentDate.getMonth()]}
                                </button>
                                <button
                                    onClick={() => setCalendarView('years')}
                                    className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    {currentDate.getFullYear()}
                                </button>
                            </>
                        )}
                        {calendarView === 'months' && (
                            <button
                                onClick={() => setCalendarView('years')}
                                className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
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
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                    >
                        &gt;
                    </button>
                </div>

                {calendarView === 'days' && (
                    <>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            <div>{t('dashboard.calendar.days.monday')}</div>
                            <div>{t('dashboard.calendar.days.tuesday')}</div>
                            <div>{t('dashboard.calendar.days.wednesday')}</div>
                            <div>{t('dashboard.calendar.days.thursday')}</div>
                            <div>{t('dashboard.calendar.days.friday')}</div>
                            <div>{t('dashboard.calendar.days.saturday')}</div>
                            <div>{t('dashboard.calendar.days.sunday')}</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {renderCalendarDays()}
                        </div>
                    </>
                )}

                {calendarView === 'months' && (
                    <div className="grid grid-cols-3 gap-2">
                        {monthNames.map((month, index) => (
                            <button
                                key={index}
                                onClick={() => selectMonth(index)}
                                className={`p-3 rounded-lg text-sm font-medium ${currentDate.getMonth() === index
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                )}

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
                                    className={`p-3 rounded-lg text-sm font-medium ${isCurrentYear
                                        ? 'bg-blue-500 text-white'
                                        : isOutOfRange
                                            ? 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 text-xs justify-center text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> {t('dashboard.calendar.legend.completed')}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> {t('dashboard.calendar.legend.active')}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div> {t('dashboard.calendar.legend.upcoming')}</div>
                </div>
            </div>
        </section>
    );
};

export default CalendarSection;
