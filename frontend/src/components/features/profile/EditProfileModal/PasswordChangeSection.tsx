import { useTranslation } from 'react-i18next';
import type { PasswordData } from './validationUtils';

interface PasswordChangeSectionProps {
    showPasswordFields: boolean;
    passwordData: PasswordData;
    passwordErrors: Partial<Record<keyof PasswordData, string>>;
    onToggle: () => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Component for password change section
 * - Expandable/collapsible section
 * - Three password fields with validation
 * - 100% shared between donor and hospital
 */
export const PasswordChangeSection: React.FC<PasswordChangeSectionProps> = ({
    showPasswordFields,
    passwordData,
    passwordErrors,
    onToggle,
    onPasswordChange
}) => {
    const { t } = useTranslation();

    return (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
                type="button"
                onClick={onToggle}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2"
            >
                <svg
                    className={`w-4 h-4 transition-transform ${showPasswordFields ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                {t('profile.password.changeButton')}
            </button>

            <div
                className={`grid grid-cols-1 gap-4 mt-4 overflow-hidden transition-all duration-500 ease-in-out ${showPasswordFields ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.password.current')}</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={onPasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder={t('profile.password.currentPlaceholder')}
                    />
                    {passwordErrors.currentPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.password.new')}</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={onPasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder={t('profile.password.newPlaceholder')}
                    />
                    {passwordErrors.newPassword ? (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {t('profile.password.hint')}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.password.confirm')}</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={onPasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder={t('profile.password.confirmPlaceholder')}
                    />
                    {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
