import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SentimentWidgetProps {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  strength: number;
}

export const SentimentWidget = ({ sentiment, score, strength }: SentimentWidgetProps) => {
  const mockSparklineData = Array.from({ length: 7 }, (_, i) => ({
    value: sentiment === 'bullish'
      ? 50 + Math.random() * 30 + i * 2
      : sentiment === 'bearish'
      ? 30 - Math.random() * 20 - i * 1.5
      : 45 + Math.random() * 10
  }));

  const getConfig = () => {
    switch (sentiment) {
      case 'bullish':
        return {
          label: 'Bullish',
          icon: <TrendingUp className="w-5 h-5" />,
          bgClass: 'from-green-500/20 via-green-500/10 to-transparent',
          borderClass: 'border-green-500/40',
          textClass: 'text-green-400',
          glowClass: 'shadow-green-500/20',
          lineColor: '#10B981'
        };
      case 'bearish':
        return {
          label: 'Bearish',
          icon: <TrendingDown className="w-5 h-5" />,
          bgClass: 'from-red-500/20 via-red-500/10 to-transparent',
          borderClass: 'border-red-500/40',
          textClass: 'text-red-400',
          glowClass: 'shadow-red-500/20',
          lineColor: '#EF4444'
        };
      case 'neutral':
        return {
          label: 'Neutral',
          icon: <Minus className="w-5 h-5" />,
          bgClass: 'from-gray-500/20 via-gray-500/10 to-transparent',
          borderClass: 'border-gray-500/40',
          textClass: 'text-gray-400',
          glowClass: 'shadow-gray-500/20',
          lineColor: '#6B7280'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.bgClass} backdrop-blur-sm border ${config.borderClass} rounded-2xl p-6 shadow-xl ${config.glowClass} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Market Sentiment</span>
          </div>
          <div className={`flex items-center gap-3 ${config.textClass}`}>
            <div className={`p-2 rounded-xl bg-gray-900/50 ${sentiment === 'bullish' ? 'animate-pulse' : ''}`}>
              {config.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{config.label}</div>
              <div className="text-xs opacity-75">
                {score > 0 ? '+' : ''}{score.toFixed(1)}% change
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Strength</div>
          <div className={`text-3xl font-bold ${config.textClass}`}>{strength}%</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2">7-Day Trend</div>
        <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.lineColor}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <span className="text-xs text-gray-500">Confidence Level</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.textClass} transition-all duration-1000 ease-out`}
              style={{
                width: `${strength}%`,
                backgroundColor: config.lineColor,
                boxShadow: `0 0 8px ${config.lineColor}40`
              }}
            />
          </div>
          <span className={`text-xs font-bold ${config.textClass}`}>{strength}%</span>
        </div>
      </div>
    </div>
  );
};
