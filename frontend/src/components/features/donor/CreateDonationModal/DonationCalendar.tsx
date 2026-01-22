import React, { useState } from 'react';

interface DonationCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  isHospitalSelected: boolean;
}

export const DonationCalendar: React.FC<DonationCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isHospitalSelected
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

      if (isHospitalSelected) {
        if (date >= today && !isWeekend) {
          isAvailable = true;
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
          onClick={() => isAvailable && onDateSelect(dateStr)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
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

      {isHospitalSelected ? (
        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 opacity-70" aria-hidden="true"></span>
            <span>Día seleccionado</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
