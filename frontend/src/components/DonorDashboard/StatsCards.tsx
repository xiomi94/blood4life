interface StatsCardsProps {
  completedDonationsCount: number;
  canDonateNow: boolean;
  daysUntilNext: number;
  nextAvailableDate: Date;
}

export const StatsCards = ({
  completedDonationsCount,
  canDonateNow,
  daysUntilNext,
  nextAvailableDate
}: StatsCardsProps) => {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Mis donaciones totales</p>
        <p className="text-4xl font-bold text-gray-800">{completedDonationsCount}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Próxima donación disponible</p>
        {canDonateNow ? (
          <p className="text-2xl font-bold text-green-600">Disponible ahora</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-800">En {daysUntilNext} días</p>
            <p className="text-xs text-gray-500 mt-1">
              {nextAvailableDate.toLocaleDateString('es-ES')}
            </p>
          </>
        )}
      </div>
    </section>
  );
};
