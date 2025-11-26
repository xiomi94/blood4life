import React from 'react';

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
  return (
    <div className={`w-full ${containerClass}`}>
      <label htmlFor={id} className={`block font-poppins font-medium text-body-sm md:text-body text-black mb-1 ${labelClass}`}>
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full font-roboto text-body-sm md:text-body px-3 py-2 md:px-4 md:py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white drop-shadow ${error ? 'border-red-500' : 'border-gray-300'
          }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="font-roboto text-red-500 text-caption mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;