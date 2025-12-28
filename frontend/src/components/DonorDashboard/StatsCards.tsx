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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Mis donaciones totales</p>
        <p className="text-4xl font-bold text-gray-800 dark:text-white">{completedDonationsCount}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Próxima donación disponible</p>
        {canDonateNow ? (
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">Disponible ahora</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">En {daysUntilNext} días</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {nextAvailableDate.toLocaleDateString('es-ES')}
            </p>
          </>
        )}
      </div>
    </section>
  );
};
