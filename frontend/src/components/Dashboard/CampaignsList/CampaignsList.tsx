import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Campaign } from '../../../services/campaignService';

interface CampaignsListProps {
    campaigns: Campaign[];
    searchTerm: string;
    selectedDate: string | null;
    onEditCampaign: (campaign: Campaign) => void;
    onDeleteCampaign: (campaign: Campaign) => void;
}

const CampaignsList: React.FC<CampaignsListProps> = ({
    campaigns,
    searchTerm,
    selectedDate,
    onEditCampaign,
    onDeleteCampaign
}) => {
    const { t } = useTranslation();

    const filteredCampaigns = searchTerm
        ? campaigns.filter(campaign =>
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : campaigns;

    if (filteredCampaigns.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                {searchTerm
                    ? 'No se encontraron campañas con ese criterio'
                    : selectedDate
                        ? 'No hay campañas en esta fecha'
                        : 'No hay campañas activas'}
            </div>
        );
    }

    return (
        <>
            {filteredCampaigns
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map(campaign => (
                    <div key={campaign.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-row items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{campaign.name}</h3>
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                    {t('dashboard.campaigns.goalLabel')}: {campaign.currentDonorCount || 0}/{campaign.requiredDonorQuantity} {t('dashboard.campaigns.donors')}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {campaign.location}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEditCampaign(campaign)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                    title={t('dashboard.campaigns.editButton')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDeleteCampaign(campaign)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    title={t('dashboard.campaigns.deleteButton')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-base text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{campaign.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div>
                                <span className="font-semibold block mb-1">{t('dashboard.campaigns.datesLabel')}:</span>
                                {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                            </div>
                            <div>
                                <span className="font-semibold block mb-1">{t('dashboard.campaigns.bloodTypesLabel')}:</span>
                                <div className="flex flex-wrap gap-1">
                                    {campaign.requiredBloodType.split(',').map((type, idx) => (
                                        <span key={idx} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                            {type.replace(/[\[\]\s"]/g, '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export default CampaignsList;
