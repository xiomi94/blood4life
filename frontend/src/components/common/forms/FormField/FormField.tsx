import React from 'react';

interface FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date';
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  containerClass?: string;
  labelClass?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: string;
  'aria-invalid'?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  placeholder,
  containerClass = '',
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  autoComplete,
  'aria-invalid': ariaInvalid,
}) => {
  const inputType = showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type;
  const errorId = `${id}-error`;

  return (
    <div className={`w-full ${containerClass}`}>
      <label htmlFor={id} className={`block font-poppins font-medium text-body-sm md:text-body text-black dark:text-gray-200 mb-1`}>
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={ariaInvalid || !!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full font-roboto text-body-sm md:text-body px-3 py-2 md:px-4 md:py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${error ? 'border-red-500' : 'border-gray-300'
            } ${showPasswordToggle ? 'pr-10' : ''}`}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />

        {showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={onTogglePassword}
              aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {isPasswordVisible ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        )}
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

export default FormField;