import { Thermometer } from 'lucide-react';

interface MarketHeatGaugeProps {
  heatLevel: number;
}

export const MarketHeatGauge = ({ heatLevel }: MarketHeatGaugeProps) => {
  const getHeatStatus = () => {
    if (heatLevel < 33) return { label: 'Cold', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' };
    if (heatLevel < 67) return { label: 'Warm', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-400' };
    return { label: 'Hot', color: 'from-orange-500 to-red-500', textColor: 'text-red-400' };
  };

  const status = getHeatStatus();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className={`w-5 h-5 ${status.textColor}`} />
          <span className="text-sm font-medium text-gray-400">Market Heat</span>
        </div>
        <span className={`text-lg font-bold ${status.textColor}`}>
          {status.label}
        </span>
      </div>

      <div className="relative">
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${status.color} transition-all duration-500`}
            style={{ width: `${heatLevel}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-2xl font-bold text-white">{heatLevel.toFixed(0)}%</span>
        <p className="text-xs text-gray-500 mt-1">Activity Level</p>
      </div>
    </div>
  );
};
