import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Campaign } from '../../../../services/campaignService';
import { useModalAnimation } from '../../../../hooks/useModalAnimation';

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
    const { shouldRender, isVisible } = useModalAnimation(isOpen);

    if (!shouldRender || !campaign) return null;

    // Verificamos si podemos borrar (sólo si escribió el nombre exacto)
    const isConfirmEnabled = confirmText === campaign.name;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onCancel}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 transition-all duration-200 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.modal.delete.title')}</h3>

                <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {t('dashboard.modal.delete.confirmMessage', { campaignName: campaign.name })}
                    </p>
                    <p className="text-[#E7000B] font-semibold mb-4">
                        {t('dashboard.modal.delete.warning')}
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => onConfirmTextChange(e.target.value)}
                        placeholder={campaign.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E7000B] focus:border-[#E7000B] outline-none"
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
                            ? 'bg-[#E7000B] hover:bg-[#c40009] text-white'
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
