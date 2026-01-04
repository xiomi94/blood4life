import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Campaign } from '../../../services/campaignService';

interface DeleteCampaignModalProps {
    isOpen: boolean;
    campaign: Campaign | null;
    confirmText: string;
    onConfirmTextChange: (text: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteCampaignModal: React.FC<DeleteCampaignModalProps> = ({
    isOpen,
    campaign,
    confirmText,
    onConfirmTextChange,
    onConfirm,
    onCancel
}) => {
    const { t } = useTranslation();
    if (!isOpen || !campaign) return null;

    const isConfirmEnabled = confirmText === campaign.name;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.modal.delete.title')}</h3>

                <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {t('dashboard.modal.delete.confirmMessage', { campaignName: campaign.name })}
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
                        {t('dashboard.modal.delete.warning')}
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => onConfirmTextChange(e.target.value)}
                        placeholder={campaign.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!isConfirmEnabled}
                        className={`px-4 py-2 rounded-lg transition-colors ${isConfirmEnabled
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCampaignModal;
