import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Hospital } from '../../../../services/adminService';

interface EditHospitalModalProps {
    hospital: Hospital;
    onSave: (hospital: Hospital) => Promise<boolean>;
    onClose: () => void;
}

export const EditHospitalModal = ({ hospital, onSave, onClose }: EditHospitalModalProps) => {
    const { t } = useTranslation();
    const [editingHospital, setEditingHospital] = useState(hospital);
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
            const success = await onSave(editingHospital);
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
                        {t('dashboard.admin.modals.editHospital')}
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
                    <div>
                        <label className={labelClasses}>
                            {t('dashboard.admin.modals.name')} *
                        </label>
                        <input
                            type="text"
                            value={editingHospital.name}
                            onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>
                            {t('dashboard.admin.modals.email')} *
                        </label>
                        <input
                            type="email"
                            value={editingHospital.email}
                            onChange={(e) => setEditingHospital({ ...editingHospital, email: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.phone')}
                            </label>
                            <input
                                type="tel"
                                value={editingHospital.phoneNumber || ''}
                                onChange={(e) => setEditingHospital({ ...editingHospital, phoneNumber: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>
                                {t('dashboard.admin.modals.address')}
                            </label>
                            <input
                                type="text"
                                value={editingHospital.address || ''}
                                onChange={(e) => setEditingHospital({ ...editingHospital, address: e.target.value })}
                                className={inputClasses}
                            />
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
