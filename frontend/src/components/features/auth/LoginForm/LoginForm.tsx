import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/ui/Button/Button';
import FormField from '../../../common/forms/FormField/FormField';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '../../../../services/authService';
import { useAuth } from '../../../../context/AuthContext';
import { useFormPersistence } from '../../../../hooks/useFormPersistence';
import { detectUserTypeFromEmail } from '../../../../utils/userTypeDetector';
import { logError } from '../../../../utils/errorHandler';
import { ROUTES } from '../../../../constants/app.constants';
import type { UserType } from '../../../../types/common.types';

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'bloodDonor' as UserType
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persist form data in localStorage (excluding password for security)
  const { clearPersistedData } = useFormPersistence(
    'loginForm',
    formData,
    setFormData,
    ['password'] // Exclude password from persistence
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'username') {
      const detectedUserType = detectUserTypeFromEmail(value, formData.userType);
      setFormData(prev => ({
        ...prev,
        username: value,
        userType: detectedUserType
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUserTypeChange = (userType: UserType) => {
    setFormData(prev => ({
      ...prev,
      userType
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(formData.username, formData.password, formData.userType);
      login(formData.userType);
      clearPersistedData();
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage = t('auth.login.error');
      setError(errorMessage);
      toast.error(errorMessage);
      logError(error, 'LoginForm.handleSubmit', {
        email: formData.username,
        userType: formData.userType
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-6 md:px-0">
      <form
        className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 gap-4 sm:gap-6"
        onSubmit={handleSubmit}
        aria-busy={isLoading}
      >
        <h2 className="font-poppins font-bold text-h3 sm:text-h2 text-gray-800 dark:text-white text-center mb-4">
          {t('auth.login.title')}
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span>{error}</span>
          </div>
        )}

        <fieldset className="mb-2">
          <legend className="sr-only">{t('auth.login.userType')}</legend>
          <div className="flex justify-center gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="userType"
                value="bloodDonor"
                checked={formData.userType === 'bloodDonor'}
                onChange={() => handleUserTypeChange('bloodDonor')}
                disabled={formData.username.endsWith('@admin.es')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">{t('auth.login.donor')}</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="userType"
                value="hospital"
                checked={formData.userType === 'hospital'}
                onChange={() => handleUserTypeChange('hospital')}
                disabled={formData.username.endsWith('@admin.es')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">{t('auth.login.hospital')}</span>
            </label>
          </div>
        </fieldset>

        <FormField
          type="email"
          id="username"
          name="username"
          label={t('auth.login.email')}
          value={formData.username}
          onChange={handleInputChange}
          required
          placeholder={t('auth.login.emailPlaceholder')}
          containerClass="mb-2"
          labelClass="text-sm sm:text-base"
          autoComplete="email"
          aria-invalid={!!error}
        />

        <FormField
          type="password"
          id="password"
          name="password"
          label={t('auth.login.password')}
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder={t('auth.login.passwordPlaceholder')}
          containerClass="mb-4"
          labelClass="text-sm sm:text-base"
          showPasswordToggle={true}
          isPasswordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          autoComplete="current-password"
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-6 sm:px-8 py-2 sm:py-3 text-body w-full sm:w-auto sm:max-w-64 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
          </Button>
        </div>

        <div className="text-center mt-2">
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-200">
            {t('auth.login.noAccount')}{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              {t('auth.login.here')}
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
