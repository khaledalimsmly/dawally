import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'neutral';
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrendIndicator = ({ direction, value, size = 'md' }: TrendIndicatorProps) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getColorClass = () => {
    if (direction === 'up') return 'text-green-400';
    if (direction === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getIcon = () => {
    const className = iconSizes[size];
    if (direction === 'up') return <TrendingUp className={className} />;
    if (direction === 'down') return <TrendingDown className={className} />;
    return <Minus className={className} />;
  };

  const getBgClass = () => {
    if (direction === 'up') return 'bg-green-500/10 border-green-500/30';
    if (direction === 'down') return 'bg-red-500/10 border-red-500/30';
    return 'bg-gray-500/10 border-gray-500/30';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getBgClass()} ${getColorClass()}`}>
      {getIcon()}
      <span className={`font-semibold ${textSizes[size]}`}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
};
