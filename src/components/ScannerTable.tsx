import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ScannerSignal } from '../utils/marketScanner';
import { Link } from 'react-router-dom';
import { useRTL } from '../hooks/useRTL';

type TabType = 'volume' | 'volatility' | 'sentiment';

interface ScannerTableProps {
  signals: ScannerSignal[];
  tabType: TabType;
}

export const ScannerTable = ({ signals, tabType }: ScannerTableProps) => {
  const { t } = useTranslation('scanner');
  const { isRTL } = useRTL();

  const calculateVolumeChangePercent = (signalValue: string): string => {
    const match = signalValue.match(/(\d+\.?\d*)x/);
    if (match) {
      const multiplier = parseFloat(match[1]);
      return `+${((multiplier - 1) * 100).toFixed(0)}%`;
    }
    return 'N/A';
  };

  const calculateSentimentScore = (stock: ScannerSignal['stock']): number => {
    if (stock.changePercent > 2) return 75 + Math.random() * 15;
    if (stock.changePercent > 0) return 60 + Math.random() * 10;
    if (stock.changePercent > -2) return 40 + Math.random() * 10;
    return 20 + Math.random() * 15;
  };

  const renderVolumeColumns = (signal: ScannerSignal) => (
    <>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-blue-400 font-semibold">
          {calculateVolumeChangePercent(signal.signalValue)}
        </span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-gray-300">{signal.signalValue}</span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-gray-300">{calculateSentimentScore(signal.stock).toFixed(0)}</span>
      </td>
    </>
  );

  const renderVolatilityColumns = (signal: ScannerSignal) => (
    <>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className={`font-semibold ${signal.stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {signal.stock.changePercent >= 0 ? '+' : ''}{signal.stock.changePercent.toFixed(2)}%
        </span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-orange-400 font-semibold">
          {signal.metadata?.volatilityScore?.toFixed(1) || 'N/A'}/10
        </span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-gray-300">{calculateSentimentScore(signal.stock).toFixed(0)}</span>
      </td>
    </>
  );

  const renderSentimentColumns = (signal: ScannerSignal) => (
    <>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} px-3 py-1 rounded-full text-sm font-medium ${
          signal.signalValue.includes('Bullish')
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {signal.signalValue.includes('Bullish') ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {signal.signalValue}
        </span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-blue-400 font-semibold">
          {signal.metadata?.sentimentChange || 'N/A'}
        </span>
      </td>
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <span className="text-gray-300">
          {calculateVolumeChangePercent(signal.signalValue)}
        </span>
      </td>
    </>
  );

  const getTableHeaders = () => {
    const baseHeaders = [
      t('table.symbol'),
      t('table.stockName'),
      t('table.price')
    ];

    switch (tabType) {
      case 'volume':
        return [...baseHeaders, t('table.volumeChange'), t('table.volumeRatio'), t('table.sentiment')];
      case 'volatility':
        return [...baseHeaders, t('table.priceChange'), t('table.volatilityScore'), t('table.sentiment')];
      case 'sentiment':
        return [...baseHeaders, t('table.direction'), t('table.sentimentChange'), t('table.volumeChange')];
    }
  };

  if (signals.length === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-lg">{t('table.noSignals')}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700">
              {getTableHeaders().map((header, index) => (
                <th
                  key={header}
                  className={`px-4 py-4 text-sm font-semibold text-gray-300 ${
                    index < 3 ? (isRTL ? 'text-right' : 'text-left') : (isRTL ? 'text-left' : 'text-right')
                  }`}
                >
                  {header}
                </th>
              ))}
              <th className={`px-4 py-4 text-sm font-semibold text-gray-300 ${isRTL ? 'text-left' : 'text-right'}`}>
                {t('table.action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => (
              <tr
                key={`${signal.stock.symbol}-${index}`}
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <span className="text-teal-400 font-bold text-lg">
                    {signal.stock.symbol}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-white font-medium">{signal.stock.name}</p>
                    <p className="text-gray-500 text-sm">{signal.stock.sector}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-white font-semibold">
                      {signal.stock.price.toFixed(2)} SAR
                    </p>
                    <p className={`text-sm ${
                      signal.stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {signal.stock.change >= 0 ? '+' : ''}{signal.stock.change.toFixed(2)}
                    </p>
                  </div>
                </td>
                {tabType === 'volume' && renderVolumeColumns(signal)}
                {tabType === 'volatility' && renderVolatilityColumns(signal)}
                {tabType === 'sentiment' && renderSentimentColumns(signal)}
                <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                  <Link
                    to={`/stock/${signal.stock.symbol}`}
                    className={`inline-flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} text-teal-400 hover:text-teal-300 transition-colors`}
                  >
                    <span className="text-sm font-medium">{t('table.view')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
