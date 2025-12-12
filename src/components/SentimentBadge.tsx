import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score?: number;
}

export const SentimentBadge = ({ sentiment, score }: SentimentBadgeProps) => {
  const getConfig = () => {
    switch (sentiment) {
      case 'bullish':
        return {
          label: 'Bullish',
          icon: <TrendingUp className="w-4 h-4" />,
          className: 'bg-green-500/20 text-green-400 border-green-500/40'
        };
      case 'bearish':
        return {
          label: 'Bearish',
          icon: <TrendingDown className="w-4 h-4" />,
          className: 'bg-red-500/20 text-red-400 border-red-500/40'
        };
      case 'neutral':
        return {
          label: 'Neutral',
          icon: <Minus className="w-4 h-4" />,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/40'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-75">({score > 0 ? '+' : ''}{score.toFixed(1)})</span>
      )}
    </div>
  );
};
