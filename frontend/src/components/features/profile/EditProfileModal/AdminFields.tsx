import { useTranslation } from 'react-i18next';
import { getFieldLabel } from './validationUtils';

interface AdminFieldsProps {
    formData: any;
    errors: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdminFields = ({ formData, errors, onInputChange }: AdminFieldsProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('profile.admin.info')}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getFieldLabel('email')} *
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={onInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                    required
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                {t('profile.admin.note')}
            </div>
        </div>
    );
};
