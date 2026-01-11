import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { Campaign } from '../../../services/campaignService';
import { appointmentService } from '../../../services/appointmentService';
import { EnrollCampaignModal } from './EnrollCampaignModal';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Filter campaigns by exact blood type match and search query
  const getFilteredCampaigns = () => {
    let filtered = campaigns;

    // First, filter out campaigns that ended more than 1 week ago
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

    filtered = filtered.filter(campaign => {
      // Keep campaign if it hasn't ended yet OR ended less than 1 week ago
      return campaign.endDate >= oneWeekAgoStr;
    });

    // Apply date filter if selected
    if (selectedDate) {
      filtered = filteredCampaigns.filter(campaign => campaign.endDate >= oneWeekAgoStr);
    } else if (showOnlyCompatible) {
      // Apply blood type compatibility filter
      filtered = filtered.filter(campaign => {
        const donorBloodType = user?.bloodType?.type;
        if (!donorBloodType) return false;

        const requiredTypes = campaign.requiredBloodType
          .split(',')
          .map(t => t.trim().replace(/[\[\]\"]/g, ''));

        return requiredTypes.includes('Universal') || requiredTypes.includes(donorBloodType);
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.hospitalName.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handleEnroll = async (date: string, time?: string) => {
    if (!selectedCampaign || !user) return;

    setEnrollLoading(true);
    try {
      const appointmentData = {
        campaignId: selectedCampaign.id,
        bloodDonorId: user.id,
        dateAppointment: date, // Format: yyyy-MM-dd
        hourAppointment: time ? (time.length === 5 ? `${time}:00` : time) : '09:00:00', // Ensure HH:mm:ss format
        appointmentStatus: {
          id: 1,
          name: 'Programada'
        }
      };

      console.log('Sending appointment data:', appointmentData);

      await appointmentService.createAppointment(appointmentData);

      toast.success('¡Inscripción exitosa! Tu cita ha sido programada.');
      setSelectedCampaign(null);
      // Optionally reload campaigns or update UI
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Give time for toast to be seen
    } catch (error: any) {
      console.error('Error enrolling in campaign:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Error al inscribirse en la campaña: ${error.response?.data?.message || error.message || 'Por favor, intenta de nuevo.'}`);
    } finally {
      setEnrollLoading(false);
    }
  };

  const displayedCampaigns = getFilteredCampaigns();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
      {/* Title and Search bar in same row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {selectedDate ? (
          <>
            <h2 className="text-xl font-bold text-gray-800">Campañas seleccionadas</h2>
            <button
              onClick={onClearFilter}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Limpiar filtro
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800">Progreso de Campañas</h2>
            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o ubicación..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Toggle filter */}
      {!selectedDate && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-600">Visualizando:</span>
          <button
            onClick={() => setShowOnlyCompatible(!showOnlyCompatible)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${showOnlyCompatible
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {showOnlyCompatible ? 'Compatibles conmigo' : 'Todas las campañas'}
          </button>
        </div>
      )}

      <div className="relative h-[400px] w-full">
        <div className="h-full overflow-y-auto pr-2 pt-2 pb-2 space-y-3 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent'
          }}
        >
          {displayedCampaigns.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              {showOnlyCompatible
                ? 'No hay campañas compatibles con tu tipo de sangre'
                : 'No hay campañas disponibles'}
            </div>
          ) : (
            displayedCampaigns
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map(campaign => {
                const progress = campaign.currentDonorCount && campaign.requiredDonorQuantity
                  ? (campaign.currentDonorCount / campaign.requiredDonorQuantity) * 100
                  : 0;

                return (
                  <div key={campaign.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{campaign.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-semibold text-gray-800">
                          {campaign.currentDonorCount || 0} / {campaign.requiredDonorQuantity} donantes
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {campaign.location}
                      </span>
                      <span className="text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                      </span>
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {campaign.requiredBloodType.split(',').map((type, idx) => (
                          <span key={idx} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                            {type.replace(/[\[\]\s"]/g, '')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <div className="mt-4">
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const campaignEnded = campaign.endDate < today;

                        if (campaignEnded) {
                          return (
                            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium rounded-lg text-center border border-gray-300 dark:border-gray-600">
                              <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Campaña finalizada
                              </div>
                            </div>
                          );
                        }

                        return (
                          <button
                            onClick={() => setSelectedCampaign(campaign)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Inscribirse en esta campaña
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })
          )}
        </div>
        {/* Gradient fade effects */}
        {displayedCampaigns.length > 0 && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Enrollment Modal */}
      <EnrollCampaignModal
        campaign={selectedCampaign}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onConfirm={handleEnroll}
        loading={enrollLoading}
      />
    </section>
  );
};
