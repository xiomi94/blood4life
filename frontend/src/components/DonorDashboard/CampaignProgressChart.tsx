import { Bar } from 'react-chartjs-2';
import type { Campaign } from '../../services/campaignService';

interface CampaignProgressChartProps {
  campaigns: Campaign[];
  selectedDate: string | null;
  filteredCampaigns: Campaign[];
  onClearFilter: () => void;
}

export const CampaignProgressChart = ({
  campaigns,
  selectedDate,
  filteredCampaigns,
  onClearFilter
}: CampaignProgressChartProps) => {
  const campaignsChartData = {
    labels: campaigns.map(c => c.name),
    datasets: [
      {
        label: 'Meta de Donantes',
        data: campaigns.map(c => c.requiredDonorQuantity),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Donantes Inscritos',
        data: campaigns.map(c => c.currentDonorCount || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const campaignsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Progreso de Donantes por Campaña',
        font: {
          size: 14,
          family: "'Roboto', sans-serif",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Número de Donantes',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        {selectedDate ? (
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Campañas seleccionadas</h2>
            <button
              onClick={onClearFilter}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Limpiar filtro
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-bold text-gray-800">Progreso de Campañas</h2>
        )}
      </div>

      {!selectedDate && (
        <div className="relative h-[350px] w-full">
          <Bar data={campaignsChartData} options={campaignsOptions} />
        </div>
      )}

      {selectedDate && (
        <div className="relative h-[350px] w-full overflow-y-auto pr-2 space-y-3">
          {filteredCampaigns.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No hay campañas en esta fecha
            </div>
          ) : (
            filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                <div className="text-xs text-gray-500">
                  {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
