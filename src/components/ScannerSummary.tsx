import { Card } from './Card';
import { MarketHeatGauge } from './MarketHeatGauge';
import { Volume2, Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { useRTL } from '../hooks/useRTL';

interface ScannerSummaryProps {
  totalFlagged: number;
  volumeAlerts: number;
  volatilityAlerts: number;
  sentimentAlerts: number;
  marketHeat: number;
  lastUpdated: Date;
  onRescan: () => void;
}

export const ScannerSummary = ({
  totalFlagged,
  volumeAlerts,
  volatilityAlerts,
  sentimentAlerts,
  marketHeat,
  lastUpdated,
  onRescan
}: ScannerSummaryProps) => {
  const { t } = useTranslation('scanner');
  const { isRTL } = useRTL();

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-bold text-white mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-5 h-5 text-teal-400" />
              {t('summary.title')}
            </h3>

            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-lg p-4 mb-4">
              <p className="text-gray-400 text-sm mb-1">{t('summary.totalFlagged')}</p>
              <p className="text-4xl font-bold text-white">{totalFlagged}</p>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between p-3 bg-gray-800/50 rounded-lg`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Volume2 className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-gray-300">{t('summary.volumeAlerts')}</span>
                </div>
                <span className="text-lg font-bold text-white">{volumeAlerts}</span>
              </div>

              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between p-3 bg-gray-800/50 rounded-lg`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{t('summary.volatilityAlerts')}</span>
                </div>
                <span className="text-lg font-bold text-white">{volatilityAlerts}</span>
              </div>

              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between p-3 bg-gray-800/50 rounded-lg`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">{t('summary.sentimentAlerts')}</span>
                </div>
                <span className="text-lg font-bold text-white">{sentimentAlerts}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <MarketHeatGauge heatLevel={marketHeat} />
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-gray-400 text-sm mb-4`}>
              <Clock className="w-4 h-4" />
              <span>{t('summary.lastUpdated')}</span>
            </div>
            <p className="text-white font-mono text-sm">{formatTime(lastUpdated)}</p>
          </div>

          <div className="pt-4 border-t border-gray-700 space-y-2">
            <Button
              onClick={onRescan}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
            >
              {t('summary.rescanButton')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
