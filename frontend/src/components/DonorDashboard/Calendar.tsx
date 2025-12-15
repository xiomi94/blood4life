import type { Campaign } from '../../services/campaignService';

interface CalendarProps {
  currentDate: Date;
  allCampaigns: Campaign[];
  onMonthChange: (increment: number) => void;
  onDayClick: (dateStr: string, campaigns: Campaign[]) => void;
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

export const Calendar = ({ currentDate, allCampaigns, onMonthChange, onDayClick }: CalendarProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Empty cells for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const nowStr = new Date().toISOString().split('T')[0];

    const campaignsOnDay = allCampaigns.filter(c =>
      dateStr >= c.startDate && dateStr <= c.endDate
    );

    let statusClass = "hover:bg-gray-100 cursor-pointer";

    if (campaignsOnDay.length > 0) {
      const isPast = campaignsOnDay.every(c => c.endDate < nowStr);
      const isFuture = campaignsOnDay.every(c => c.startDate > nowStr);
      const isActive = campaignsOnDay.some(c => c.startDate <= nowStr && c.endDate >= nowStr);

      if (isActive) {
        statusClass = "bg-green-500 text-white font-medium hover:bg-green-600 cursor-pointer relative";
      } else if (isFuture) {
        statusClass = "bg-blue-400 text-white font-medium hover:bg-blue-500 cursor-pointer relative";
      } else if (isPast) {
        statusClass = "bg-red-500 text-white font-medium hover:bg-red-600 cursor-pointer relative";
      }
    }

    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    if (isToday && campaignsOnDay.length === 0) {
      statusClass = "bg-blue-100 text-blue-800 font-bold border border-blue-300";
    }

    days.push(
      <div
        key={day}
        className={`p-2 rounded flex items-center justify-center text-sm transition-colors relative ${statusClass} ${campaignsOnDay.length > 0 ? 'cursor-pointer' : ''}`}
        title={campaignsOnDay.map(c => c.name).join(', ')}
        onClick={() => onDayClick(dateStr, campaignsOnDay)}
      >
        {day}
        {campaignsOnDay.length >= 2 && (
          <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-black bg-white/80 rounded-full w-3.5 h-3.5 flex items-center justify-center">
            {campaignsOnDay.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendario</h2>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={() => onMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
            &lt;
          </button>
          <h3 className="font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          <button onClick={() => onMonthChange(1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
          <div>Lu</div>
          <div>Ma</div>
          <div>Mi</div>
          <div>Ju</div>
          <div>Vi</div>
          <div>Sa</div>
          <div>Do</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {days}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs justify-center text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Realizadas</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Activas</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div> Futuras</div>
        </div>
      </div>
    </section>
  );
};
