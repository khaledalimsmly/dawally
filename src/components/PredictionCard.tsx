import { TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from './Badge';
import { useRTL } from '../hooks/useRTL';

interface PredictionCardProps {
  timeframe: string;
  targetPrice: number;
  changePercent: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  direction: 'up' | 'down';
  currency?: string;
  delay?: number;
}

export const PredictionCard = ({
  timeframe,
  targetPrice,
  changePercent,
  confidence,
  riskLevel,
  direction,
  currency = 'SAR',
  delay = 0
}: PredictionCardProps) => {
  const { t } = useTranslation('predictions');
  const { isRTL } = useRTL();

  const getDirectionConfig = () => {
    if (direction === 'up') {
      return {
        icon: <TrendingUp className="w-8 h-8" />,
        bgClass: 'from-green-500/20 via-green-500/10 to-transparent',
        borderClass: 'border-green-500/40',
        textClass: 'text-green-400',
        iconBgClass: 'bg-green-500/20',
        glowClass: 'shadow-green-500/20'
      };
    }
    return {
      icon: <TrendingDown className="w-8 h-8" />,
      bgClass: 'from-red-500/20 via-red-500/10 to-transparent',
      borderClass: 'border-red-500/40',
      textClass: 'text-red-400',
      iconBgClass: 'bg-red-500/20',
      glowClass: 'shadow-red-500/20'
    };
  };

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'from-teal-500 to-teal-400';
    if (confidence >= 60) return 'from-blue-500 to-blue-400';
    return 'from-yellow-500 to-yellow-400';
  };

  const config = getDirectionConfig();

  return (
    <div
      className={`relative group overflow-hidden bg-gradient-to-br ${config.bgClass} backdrop-blur-sm border-2 ${config.borderClass} rounded-2xl p-6 shadow-xl ${config.glowClass} transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideUp`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`absolute top-0 ${isRTL ? 'left-0 -ml-16' : 'right-0 -mr-16'} w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="text-xl font-bold text-white tracking-wide" dir={isRTL ? 'rtl' : 'ltr'}>{t('timeframes.' + timeframe.toLowerCase())}</h3>
        </div>
        <div className={`p-3 ${config.iconBgClass} rounded-xl ${config.textClass} group-hover:scale-110 transition-transform duration-300`}>
          {config.icon}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm text-gray-400 mb-2 font-semibold uppercase tracking-wider" dir={isRTL ? 'rtl' : 'ltr'}>{t('targetPrice')}</div>
        <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-5xl font-bold text-white tracking-tight">
            {targetPrice.toFixed(2)}
          </span>
          <span className="text-xl text-gray-400 font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{currency}</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} px-4 py-2.5 rounded-xl ${config.iconBgClass} border ${config.borderClass} mb-5`}>
        {direction === 'up' ? (
          <TrendingUp className={`w-5 h-5 ${config.textClass}`} />
        ) : (
          <TrendingDown className={`w-5 h-5 ${config.textClass}`} />
        )}
        <span className={`text-2xl font-bold ${config.textClass}`}>
          {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>

      <div className="space-y-4 pt-5 border-t border-gray-700/50">
        <div>
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mb-2`}>
            <span className="text-sm text-gray-400 font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>{t('confidenceScore')}</span>
            <span className="text-lg font-bold text-teal-400">{confidence}%</span>
          </div>
          <div className="relative w-full h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50">
            <div
              className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} bg-gradient-to-r ${getConfidenceColor()} rounded-full transition-all duration-1000 ease-out shadow-lg`}
              style={{
                width: `${confidence}%`,
                boxShadow: confidence >= 80 ? '0 0 12px rgba(20, 184, 166, 0.6)' : undefined
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>{t('riskLevel')}</span>
          </div>
          <Badge variant={riskLevel} className="text-sm px-3 py-1 font-bold uppercase">
            <span dir={isRTL ? 'rtl' : 'ltr'}>{t(`riskLevels.${riskLevel}`)}</span>
          </Badge>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};
