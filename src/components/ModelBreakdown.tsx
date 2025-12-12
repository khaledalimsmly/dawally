import { Brain, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from './Badge';
import { useRTL } from '../hooks/useRTL';

interface ModelContribution {
  name: string;
  type: 'neural_network' | 'ensemble' | 'statistical' | 'hybrid';
  confidence: number;
  color: string;
}

interface ModelBreakdownProps {
  models?: ModelContribution[];
}

const defaultModels: ModelContribution[] = [
  { name: 'LSTM Neural Net', type: 'neural_network', confidence: 87, color: '#14B8A6' },
  { name: 'Transformer', type: 'neural_network', confidence: 85, color: '#3B82F6' },
  { name: 'Temporal Fusion', type: 'hybrid', confidence: 82, color: '#8B5CF6' },
  { name: 'XGBoost Ensemble', type: 'ensemble', confidence: 79, color: '#F59E0B' },
  { name: 'Statistical ARIMA', type: 'statistical', confidence: 73, color: '#6B7280' }
];

const getModelTypeBadgeVariant = (type: string): 'low' | 'medium' | 'high' => {
  switch (type) {
    case 'neural_network': return 'low';
    case 'hybrid': return 'medium';
    case 'ensemble': return 'medium';
    default: return 'high';
  }
};

export const ModelBreakdown = ({ models = defaultModels }: ModelBreakdownProps) => {
  const { t } = useTranslation('predictions');
  const { isRTL } = useRTL();

  const weightedAvg = (models.reduce((sum, m) => sum + m.confidence, 0) / models.length).toFixed(1);

  const getModelTypeLabel = (type: string): string => {
    return t(`modelTypes.${type}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white" dir={isRTL ? 'rtl' : 'ltr'}>{t('modelBreakdown.title')}</h3>
            <p className="text-sm text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>{t('modelBreakdown.subtitle')}</p>
          </div>
        </div>
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <div className="text-xs text-gray-400 mb-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('modelBreakdown.weightedAverage')}</div>
          <div className="text-3xl font-bold text-cyan-400">{weightedAvg}%</div>
        </div>
      </div>

      <div className="space-y-5">
        {models.map((model, index) => (
          <div
            key={model.name}
            className="group animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-2`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} flex-1`}>
                <Brain className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors" dir={isRTL ? 'rtl' : 'ltr'}>
                  {model.name}
                </span>
                <Badge variant={getModelTypeBadgeVariant(model.type)} className="text-xs">
                  <span dir={isRTL ? 'rtl' : 'ltr'}>{getModelTypeLabel(model.type)}</span>
                </Badge>
              </div>
              <span className={`text-lg font-bold text-white ${isRTL ? 'mr-4' : 'ml-4'}`}>{model.confidence}%</span>
            </div>

            <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden group-hover:shadow-lg transition-all">
              <div
                className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                style={{
                  width: `${model.confidence}%`,
                  backgroundColor: model.color,
                  boxShadow: `0 0 12px ${model.color}60`
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${model.color}40, transparent)`,
                    animation: 'shimmer 2s infinite'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''} p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg`}>
          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
          <p className="text-xs text-gray-400 leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
            {t('modelBreakdown.explanation')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
