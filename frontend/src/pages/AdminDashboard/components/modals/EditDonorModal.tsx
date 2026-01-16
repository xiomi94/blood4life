import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BloodDonor } from '../../../../services/adminService';

interface EditDonorModalProps {
    donor: BloodDonor;
    onSave: (donor: BloodDonor) => Promise<boolean>;
    onClose: () => void;
}

export const EditDonorModal = ({ donor, onSave, onClose }: EditDonorModalProps) => {
    const { t } = useTranslation();
    const [editingDonor, setEditingDonor] = useState(donor);
    const [loading, setLoading] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await onSave(editingDonor);
            if (success) {
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 transition-colors";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            {/* Backdrop - click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-20">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {t('dashboard.admin.modals.editDonor')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                        type="button"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.firstName')} *
                            </label>
                            <input
                                type="text"
                                value={editingDonor.firstName}
                                onChange={(e) => setEditingDonor({ ...editingDonor, firstName: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.lastName')} *
                            </label>
                            <input
                                type="text"
                                value={editingDonor.lastName}
                                onChange={(e) => setEditingDonor({ ...editingDonor, lastName: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {/* DNI */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.dni')} *
                            </label>
                            <input
                                type="text"
                                value={editingDonor.dni}
                                onChange={(e) => setEditingDonor({ ...editingDonor, dni: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.gender')} *
                            </label>
                            <select
                                value={editingDonor.gender}
                                onChange={(e) => setEditingDonor({ ...editingDonor, gender: e.target.value })}
                                className={inputClasses}
                                required
                            >
                                <option value="M">{t('dashboard.admin.table.male')}</option>
                                <option value="F">{t('dashboard.admin.table.female')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>
                            {t('dashboard.admin.modals.email')} *
                        </label>
                        <input
                            type="email"
                            value={editingDonor.email}
                            onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.phone')}
                            </label>
                            <input
                                type="tel"
                                value={editingDonor.phoneNumber || ''}
                                onChange={(e) => setEditingDonor({ ...editingDonor, phoneNumber: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.birthDate')}
                            </label>
                            <input
                                type="date"
                                value={editingDonor.dateOfBirth || ''}
                                onChange={(e) => setEditingDonor({ ...editingDonor, dateOfBirth: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* Blood Type */}
                        <div className="md:col-span-2">
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.bloodType')}
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'].map((type) => {
                                    // Mapear string a ID asumiendo la lista estática (o usar otra lógica si IDs cambiantes)
                                    // El código original usaba IDs 1-8. Mantenemos esa lógica pero con mejor UI.
                                    const typeMap: { [key: string]: number } = { 'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4, 'AB+': 5, 'AB-': 6, '0+': 7, '0-': 8 };
                                    const currentId = editingDonor.bloodType?.id;
                                    const isSelected = currentId === typeMap[type];

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setEditingDonor({
                                                ...editingDonor,
                                                bloodType: { id: typeMap[type], type: type }
                                            })}
                                            className={`px-4 py-2 rounded-lg border font-medium transition-all ${isSelected
                                                    ? 'bg-red-600 text-white border-red-600 shadow-sm transform scale-105'
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:text-red-500'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            disabled={loading}
                        >
                            {t('dashboard.admin.modals.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            disabled={loading}
                        >
                            {loading ? t('common.loading') : t('dashboard.admin.modals.saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
