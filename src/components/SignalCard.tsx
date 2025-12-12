import { TrendingUp, TrendingDown, Volume2, Zap, Activity } from 'lucide-react';
import { Card } from './Card';

type SignalType = 'volume' | 'sentiment' | 'volatility';
type SignalStrength = 'strong' | 'moderate' | 'weak';

interface SignalCardProps {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  signalType: SignalType;
  signalStrength: SignalStrength;
  signalValue: string;
  metadata?: {
    avgVolume?: string;
    sentimentChange?: string;
    volatilityScore?: number;
  };
}

export const SignalCard = ({
  symbol,
  name,
  sector,
  price,
  change,
  changePercent,
  signalType,
  signalStrength,
  signalValue,
  metadata
}: SignalCardProps) => {
  const getSignalColor = () => {
    switch (signalStrength) {
      case 'strong':
        return 'from-red-500/20 to-orange-500/20 border-red-500/40';
      case 'moderate':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/40';
      case 'weak':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40';
    }
  };

  const getSignalIcon = () => {
    switch (signalType) {
      case 'volume':
        return <Volume2 className="w-5 h-5" />;
      case 'sentiment':
        return <Zap className="w-5 h-5" />;
      case 'volatility':
        return <Activity className="w-5 h-5" />;
    }
  };

  const getSignalLabel = () => {
    switch (signalType) {
      case 'volume':
        return 'Unusual Volume';
      case 'sentiment':
        return 'Sentiment Spike';
      case 'volatility':
        return 'High Volatility';
    }
  };

  const getSignalBadgeColor = () => {
    switch (signalStrength) {
      case 'strong':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'weak':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getSignalColor()} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-white">{symbol}</span>
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <p className="text-sm text-gray-400">{name}</p>
          <p className="text-xs text-gray-500">{sector}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getSignalBadgeColor()} mb-3`}>
        {getSignalIcon()}
        <span className="text-sm font-medium">{getSignalLabel()}</span>
        <span className="ml-auto text-sm font-bold">{signalValue}</span>
      </div>

      {metadata && (
        <div className="text-xs text-gray-400 space-y-1">
          {metadata.avgVolume && (
            <div className="flex justify-between">
              <span>Avg Volume:</span>
              <span className="text-gray-300">{metadata.avgVolume}</span>
            </div>
          )}
          {metadata.sentimentChange && (
            <div className="flex justify-between">
              <span>Sentiment Change:</span>
              <span className="text-gray-300">{metadata.sentimentChange}</span>
            </div>
          )}
          {metadata.volatilityScore !== undefined && (
            <div className="flex justify-between">
              <span>Volatility Score:</span>
              <span className="text-gray-300">{metadata.volatilityScore.toFixed(1)}/10</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
