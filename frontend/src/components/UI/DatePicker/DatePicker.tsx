import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { format, getDaysInMonth, startOfMonth, subMonths, addMonths, getYear, setYear, setMonth, isSameDay, isToday, parseISO } from 'date-fns';

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
    // Date used for navigation in the calendar (viewing different months/years)
    const [viewDate, setViewDate] = useState(new Date());

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

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);

        // Pass event-like object to parent handler to match standard input interface
        const dateString = format(newDate, 'yyyy-MM-dd');
        onChange({ target: { name, value: dateString } });

        setIsOpen(false);
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
        const startDay = startOfMonth(viewDate).getDay(); // 0 is Sunday
        const days = [];

        // Empty cells for days before the 1st of the month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        // Days of the month
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

    // Year selection range (100 years back to 10 years forward)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 110 }, (_, i) => currentYear - 100 + i).reverse();

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
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full font-roboto text-body-sm md:text-body px-3 py-2 md:px-4 md:py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between",
                        "bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600",
                        error ? "border-red-500" : "border-gray-300",
                        disabled && "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-70"
                    )}
                    disabled={disabled}
                >
                    <span className={cn("block truncate", !value && "text-gray-400 dark:text-gray-400")}>
                        {value ? format(parseISO(value), "dd/MM/yyyy") : placeholder}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 ml-2 flex-shrink-0" />
                </button>

                {/* Calendar Dropdown - Rendered via Portal */}
                {isOpen && containerRef.current && ReactDOM.createPortal(
                    <div
                        className="fixed p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 w-[320px] animate-in fade-in zoom-in-95 duration-200"
                        style={{
                            zIndex: 9999,
                            top: (() => {
                                const rect = containerRef.current?.getBoundingClientRect();
                                if (!rect) return '50%';
                                const spaceBelow = window.innerHeight - rect.bottom;
                                const spaceAbove = rect.top;
                                const calendarHeight = 400; // approximate

                                // If more space below, position below
                                if (spaceBelow >= calendarHeight || spaceBelow > spaceAbove) {
                                    return `${rect.bottom + window.scrollY + 8}px`;
                                } else {
                                    // Position above
                                    return `${rect.top + window.scrollY - calendarHeight - 8}px`;
                                }
                            })(),
                            left: (() => {
                                const rect = containerRef.current?.getBoundingClientRect();
                                if (!rect) return '50%';
                                const left = rect.left + window.scrollX;
                                const maxLeft = window.innerWidth - 320 - 16; // 320 = calendar width, 16 = padding
                                return `${Math.min(left, maxLeft)}px`;
                            })()
                        }}
                    >
                        {/* Header: Month/Year Nav */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => handleMonthChange(-1)}
                                type="button"
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-2">
                                <select
                                    value={viewDate.getMonth()}
                                    onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                                    className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer outline-none hover:text-red-600 transition-colors appearance-none text-center"
                                    style={{ textAlignLast: 'center' }}
                                >
                                    {MONTHS.map((month, idx) => (
                                        <option key={month} value={idx}>{month}</option>
                                    ))}
                                </select>

                                <select
                                    value={getYear(viewDate)}
                                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                                    className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer outline-none hover:text-red-600 transition-colors appearance-none"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => handleMonthChange(1)}
                                type="button"
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {renderCalendarDays()}
                        </div>

                        {/* Footer: Today Button */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    setViewDate(today);
                                    handleDateSelect(today.getDate());
                                }}
                                className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                            >
                                Seleccionar Hoy
                            </button>
                        </div>
                    </div>,
                    document.body
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
