import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { saudiStocks } from '../data/stocks';
import { scanMarket, ScannerSignal } from '../utils/marketScanner';
import { Button } from '../components/Button';
import { ScannerTabs } from '../components/ScannerTabs';
import { ScannerTable } from '../components/ScannerTable';
import { ScannerSummary } from '../components/ScannerSummary';
import { ScannerFilters } from '../components/ScannerFilters';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useRTL } from '../hooks/useRTL';

type TabType = 'volume' | 'volatility' | 'sentiment';

export const MarketScanner = () => {
  const { t } = useTranslation('scanner');
  const { isRTL } = useRTL();
  const [activeTab, setActiveTab] = useState<TabType>('volume');
  const [scanResults, setScanResults] = useState<{
    volumeSignals: ScannerSignal[];
    sentimentSignals: ScannerSignal[];
    volatilitySignals: ScannerSignal[];
    allSignals: ScannerSignal[];
  }>({ volumeSignals: [], sentimentSignals: [], volatilitySignals: [], allSignals: [] });
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All Risk Levels');

  const performScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = scanMarket(saudiStocks);
      setScanResults(results);
      setLastUpdated(new Date());
      setIsScanning(false);
    }, 800);
  };

  useEffect(() => {
    performScan();
  }, []);

  const getActiveSignals = (): ScannerSignal[] => {
    switch (activeTab) {
      case 'volume':
        return scanResults.volumeSignals;
      case 'volatility':
        return scanResults.volatilitySignals;
      case 'sentiment':
        return scanResults.sentimentSignals;
    }
  };

  const getFilteredSignals = (): ScannerSignal[] => {
    let signals = getActiveSignals();

    if (selectedSector !== 'All Sectors') {
      signals = signals.filter(signal => signal.stock.sector === selectedSector);
    }

    if (selectedRiskLevel !== 'All Risk Levels') {
      const riskMap: { [key: string]: string[] } = {
        'High': ['strong'],
        'Medium': ['moderate'],
        'Low': ['weak']
      };
      const allowedStrengths = riskMap[selectedRiskLevel] || [];
      signals = signals.filter(signal => allowedStrengths.includes(signal.signalStrength));
    }

    return signals;
  };

  const filteredSignals = getFilteredSignals();

  const getAvailableSectors = (): string[] => {
    const activeSignals = getActiveSignals();
    const sectors = new Set(activeSignals.map(signal => signal.stock.sector));
    return ['All Sectors', ...Array.from(sectors).sort()];
  };

  const calculateMarketHeat = (): number => {
    const allSignals = [
      ...scanResults.volumeSignals,
      ...scanResults.volatilitySignals,
      ...scanResults.sentimentSignals
    ];

    if (allSignals.length === 0) return 0;

    const strengthValues = { strong: 3, moderate: 2, weak: 1 };
    const totalStrength = allSignals.reduce(
      (sum, signal) => sum + strengthValues[signal.signalStrength],
      0
    );
    const maxPossible = allSignals.length * 3;

    return (totalStrength / maxPossible) * 100;
  };

  const handleResetFilters = () => {
    setSelectedSector('All Sectors');
    setSelectedRiskLevel('All Risk Levels');
  };

  const getTotalFlagged = () => {
    const uniqueSymbols = new Set([
      ...scanResults.volumeSignals.map(s => s.stock.symbol),
      ...scanResults.volatilitySignals.map(s => s.stock.symbol),
      ...scanResults.sentimentSignals.map(s => s.stock.symbol)
    ]);
    return uniqueSymbols.size;
  };

  return (
    <div className="min-h-screen bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <LandingNav />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="mb-8">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
            <div>
              <h1 className={`text-4xl font-bold text-white mb-2 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-10 h-10 text-teal-400" />
                {t('title')}
              </h1>
              <p className="text-gray-400">
                {t('subtitle')}
              </p>
            </div>
            <Button
              onClick={performScan}
              disabled={isScanning}
              className={`bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isScanning ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  {t('scanning')}
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  {t('rescan')}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1 min-w-0">
            <ScannerTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              volumeCount={scanResults.volumeSignals.length}
              volatilityCount={scanResults.volatilitySignals.length}
              sentimentCount={scanResults.sentimentSignals.length}
            />

            <ScannerFilters
              sectors={getAvailableSectors()}
              selectedSector={selectedSector}
              onSectorChange={setSelectedSector}
              selectedRiskLevel={selectedRiskLevel}
              onRiskLevelChange={setSelectedRiskLevel}
              resultsCount={filteredSignals.length}
              onReset={handleResetFilters}
            />

            {isScanning ? (
              <div className="flex items-center justify-center py-20 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-teal-400 animate-pulse mx-auto mb-4" />
                  <p className="text-xl text-gray-400">{t('scanningMessage')}</p>
                </div>
              </div>
            ) : (
              <ScannerTable signals={filteredSignals} tabType={activeTab} />
            )}
          </div>

          <div className="w-80 flex-shrink-0">
            <ScannerSummary
              totalFlagged={getTotalFlagged()}
              volumeAlerts={scanResults.volumeSignals.length}
              volatilityAlerts={scanResults.volatilitySignals.length}
              sentimentAlerts={scanResults.sentimentSignals.length}
              marketHeat={calculateMarketHeat()}
              lastUpdated={lastUpdated}
              onRescan={performScan}
            />
          </div>
        </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};
