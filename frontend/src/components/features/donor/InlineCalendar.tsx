import { useState, useEffect } from 'react';
import { format, getDaysInMonth, startOfMonth, subMonths, addMonths, getYear, setYear, setMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InlineCalendarProps {
    value: string;
    onChange: (date: string) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
}

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const InlineCalendar = ({
    value,
    onChange,
    minDate,
    maxDate,
    disabled = false
}: InlineCalendarProps) => {
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (value) {
            const date = parseISO(value);
            if (!isNaN(date.getTime())) {
                setViewDate(date);
            }
        }
    }, [value]);

    const handleDateSelect = (day: number) => {
        if (disabled) return;
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateString = format(newDate, 'yyyy-MM-dd');
        onChange(dateString);
    };

    const handleMonthChange = (offset: number) => {
        setViewDate(prev => offset > 0 ? addMonths(prev, offset) : subMonths(prev, Math.abs(offset)));
    };

    const handleYearChange = (year: number) => {
        setViewDate(prev => setYear(prev, year));
    };

    const handleMonthSelect = (monthIndex: number) => {
        setViewDate(prev => setMonth(prev, monthIndex));
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(viewDate);
        const startDay = startOfMonth(viewDate).getDay();
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty - ${i} `} className="w-9 h-9"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const isSelected = value && isSameDay(date, parseISO(value));
            const isCurrentDay = isToday(date);

            let isDisabled = false;
            if (minDate && date < minDate) isDisabled = true;
            if (maxDate && date > maxDate) isDisabled = true;

            days.push(
                <button
                    key={day}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled || disabled}
                    type="button"
                    className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors relative",
                        isSelected
                            ? "bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                            : isCurrentDay
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-2 border-blue-200 dark:border-blue-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
                        isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 110 }, (_, i) => currentYear - 100 + i).reverse();

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Header: Month/Year Nav */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => handleMonthChange(-1)}
                    type="button"
                    disabled={disabled}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                    <select
                        value={viewDate.getMonth()}
                        onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                        disabled={disabled}
                        className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer outline-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors appearance-none text-center px-2 disabled:opacity-50"
                        style={{ textAlignLast: 'center' }}
                    >
                        {MONTHS.map((month, idx) => (
                            <option key={month} value={idx}>{month}</option>
                        ))}
                    </select>

                    <select
                        value={getYear(viewDate)}
                        onChange={(e) => handleYearChange(parseInt(e.target.value))}
                        disabled={disabled}
                        className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer outline-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors appearance-none disabled:opacity-50"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => handleMonthChange(1)}
                    type="button"
                    disabled={disabled}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 place-items-center mb-4">
                {renderCalendarDays()}
            </div>

            {/* Footer: Today Button */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button
                    type="button"
                    onClick={() => {
                        const today = new Date();
                        setViewDate(today);
                        handleDateSelect(today.getDate());
                    }}
                    disabled={disabled}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                    Seleccionar Hoy
                </button>
            </div>
        </div>
    );
};
