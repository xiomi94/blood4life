import React, { useState, useEffect, useRef } from 'react';
import { format, getDaysInMonth, startOfMonth, subMonths, addMonths, setYear, setMonth, isSameDay, isToday, parseISO } from 'date-fns';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DatePickerProps {
    label?: string;
    value: string;
    onChange: (e: { target: { name: string; value: string } }) => void;
    name: string;
    id?: string;
    error?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onChange,
    name,
    id,
    error,
    disabled = false,
    minDate,
    maxDate,
    placeholder = 'Selecciona una fecha',
    required = false,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize from value prop
    useEffect(() => {
        if (value) {
            const date = parseISO(value);
            if (!isNaN(date.getTime())) {
                setViewDate(date);
            }
        }
    }, [value]);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateString = format(newDate, 'yyyy-MM-dd');
        onChange({ target: { name, value: dateString } });
        setIsOpen(false);
        setCalendarView('days');
    };

    const handlePrevClick = () => {
        if (calendarView === 'days') {
            setViewDate(subMonths(viewDate, 1));
        } else if (calendarView === 'months') {
            setViewDate(subMonths(viewDate, 12)); // Go back a year
        } else if (calendarView === 'years') {
            setViewDate(subMonths(viewDate, 120)); // Go back a decade
        }
    };

    const handleNextClick = () => {
        if (calendarView === 'days') {
            setViewDate(addMonths(viewDate, 1));
        } else if (calendarView === 'months') {
            setViewDate(addMonths(viewDate, 12)); // Go forward a year
        } else if (calendarView === 'years') {
            setViewDate(addMonths(viewDate, 120)); // Go forward a decade
        }
    };

    const handleMonthSelect = (monthIndex: number) => {
        setViewDate(setMonth(viewDate, monthIndex));
        setCalendarView('days');
    };

    const handleYearSelect = (year: number) => {
        setViewDate(setYear(viewDate, year));
        setCalendarView('months');
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(viewDate);
        const startDay = startOfMonth(viewDate).getDay(); // 0 is Sunday
        const days = [];

        // Empty cells for days before the 1st
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        // Days
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
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                        if (!isDisabled) handleDateSelect(day);
                    }}
                    disabled={isDisabled}
                    type="button"
                    className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors relative",
                        isSelected
                            ? "bg-red-600 text-white hover:bg-red-700 font-medium"
                            : isCurrentDay
                                ? "bg-red-50 text-red-600 font-medium border border-red-200"
                                : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700",
                        isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className={cn("w-full mb-4", className)} ref={containerRef}>
            {label && (
                <label
                    htmlFor={id || name}
                    className="block font-poppins font-medium text-body-sm md:text-body text-black dark:text-gray-200 mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    className={cn(
                        "flex w-full rounded-md shadow-sm border overflow-hidden transition-colors",
                        "bg-white dark:bg-gray-700 dark:border-gray-600",
                        error ? "border-red-500" : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500",
                        disabled && "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-70"
                    )}
                >
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        className={cn(
                            "flex-1 text-left px-3 py-2 md:px-4 md:py-2.5 font-roboto text-body-sm md:text-body bg-transparent focus:outline-none",
                            !value && "text-gray-400 dark:text-gray-400",
                            "dark:text-white"
                        )}
                        disabled={disabled}
                    >
                        {value ? format(parseISO(value), "dd/MM/yyyy") : placeholder}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            !disabled && setIsOpen(!isOpen);
                        }}
                        className={cn(
                            "px-3 flex items-center justify-center border-l border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
                            disabled && "cursor-not-allowed opacity-50"
                        )}
                        disabled={disabled}
                        aria-label="Abrir calendario"
                    >
                        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    </button>
                </div>

                {/* Calendar Dropdown */}
                {isOpen && (
                    <div
                        className="absolute z-50 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 w-[320px] animate-in fade-in zoom-in-95 duration-200"
                        style={{
                            top: '0',
                            left: 'calc(100% + 8px)',
                        }}
                    >
                        {/* Header: Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handlePrevClick}
                                type="button"
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {calendarView === 'days' && (
                                    <>
                                        <button onClick={() => setCalendarView('months')} className="hover:text-red-600 transition-colors">
                                            {MONTHS[viewDate.getMonth()]}
                                        </button>
                                        <button onClick={() => setCalendarView('years')} className="hover:text-red-600 transition-colors">
                                            {viewDate.getFullYear()}
                                        </button>
                                    </>
                                )}
                                {calendarView === 'months' && (
                                    <button onClick={() => setCalendarView('years')} className="hover:text-red-600 transition-colors">
                                        {viewDate.getFullYear()}
                                    </button>
                                )}
                                {calendarView === 'years' && (
                                    <span>
                                        {Math.floor(viewDate.getFullYear() / 10) * 10} - {Math.floor(viewDate.getFullYear() / 10) * 10 + 9}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleNextClick}
                                type="button"
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Views */}
                        {calendarView === 'days' && (
                            <>
                                <div className="grid grid-cols-7 mb-2">
                                    {DAYS.map(day => (
                                        <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 place-items-center">
                                    {renderCalendarDays()}
                                </div>
                            </>
                        )}

                        {calendarView === 'months' && (
                            <div className="grid grid-cols-3 gap-2">
                                {MONTHS.map((month, index) => (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthSelect(index)}
                                        className={cn(
                                            "p-2 rounded-lg text-sm font-medium transition-colors",
                                            viewDate.getMonth() === index
                                                ? "bg-red-600 text-white"
                                                : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        )}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}

                        {calendarView === 'years' && (
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 12 }, (_, i) => {
                                    const startDecade = Math.floor(viewDate.getFullYear() / 10) * 10;
                                    const year = startDecade - 1 + i;
                                    const isCurrentYear = year === viewDate.getFullYear();
                                    const isOutOfRange = i === 0 || i === 11; // Previous/Next decade years

                                    return (
                                        <button
                                            key={year}
                                            onClick={() => handleYearSelect(year)}
                                            className={cn(
                                                "p-2 rounded-lg text-sm font-medium transition-colors",
                                                isCurrentYear
                                                    ? "bg-red-600 text-white"
                                                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600",
                                                isOutOfRange && "opacity-50"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer: Today Button */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    setViewDate(today);
                                    setCalendarView('days');
                                    handleDateSelect(today.getDate());
                                }}
                                className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                            >
                                Seleccionar Hoy
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p
                    className="font-roboto text-red-500 text-caption mt-1"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
