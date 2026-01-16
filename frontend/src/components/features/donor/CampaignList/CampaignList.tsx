import { useEffect, useState } from 'react';
import { campaignService, type Campaign } from '../../../../services/campaignService';

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setIsLoading(true);
                const data = await campaignService.getAllCampaigns();
                setCampaigns(data);
                setError(null);
            } catch (err) {
                setError('Error al cargar campañas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (isLoading) return <div role="status">Cargando...</div>;
    if (error) return <div role="alert" className="text-red-500">{error}</div>;

    return (
        <ul aria-label="Lista de campañas">
            {campaigns.map((campaign) => (
                <li key={campaign.id} className="p-4 border-b">
                    <h3 className="font-bold">{campaign.name}</h3>
                    <p>{campaign.location}</p>
                </li>
            ))}
        </ul>
    );
};

export default CampaignList;
