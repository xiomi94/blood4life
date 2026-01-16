import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  containerClass?: string;
  labelClass?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  options,
  containerClass = '',
  labelClass = '',
}) => {
  const errorId = `${id}-error`;

  return (
    <div className={`w-full ${containerClass}`}>
      <label htmlFor={id} className={`block font-poppins font-medium text-body-sm md:text-body text-black dark:text-gray-200 mb-1 ${labelClass}`}>
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full appearance-none font-roboto text-body-sm md:text-body px-3 py-2 md:px-4 md:py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 ${value === "" ? "text-gray-400 dark:text-gray-400" : "text-gray-900 dark:text-white"
            } ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="text-gray-900 dark:text-white" hidden={option.value === ""}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error && (
        <p
          id={errorId}
          className="font-roboto text-red-500 text-caption mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;