import { StockData } from '../data/stocks';

export interface ScannerSignal {
  stock: StockData;
  signalType: 'volume' | 'sentiment' | 'volatility';
  signalStrength: 'strong' | 'moderate' | 'weak';
  signalValue: string;
  score: number;
  metadata: {
    avgVolume?: string;
    sentimentChange?: string;
    volatilityScore?: number;
  };
}

const parseVolume = (volumeStr: string): number => {
  const num = parseFloat(volumeStr);
  if (volumeStr.includes('M')) return num * 1_000_000;
  if (volumeStr.includes('K')) return num * 1_000;
  return num;
};

const calculateUnusualVolume = (stock: StockData): ScannerSignal | null => {
  const currentVolume = parseVolume(stock.volume);
  const avgVolume = currentVolume * (0.6 + Math.random() * 0.3);
  const volumeRatio = currentVolume / avgVolume;

  if (volumeRatio < 1.5) return null;

  const score = Math.min(volumeRatio * 10, 100);
  const signalStrength: 'strong' | 'moderate' | 'weak' =
    volumeRatio > 3 ? 'strong' : volumeRatio > 2 ? 'moderate' : 'weak';

  return {
    stock,
    signalType: 'volume',
    signalStrength,
    signalValue: `${volumeRatio.toFixed(1)}x avg`,
    score,
    metadata: {
      avgVolume: avgVolume > 1_000_000
        ? `${(avgVolume / 1_000_000).toFixed(1)}M`
        : `${(avgVolume / 1_000).toFixed(0)}K`
    }
  };
};

const calculateSentimentSpike = (stock: StockData): ScannerSignal | null => {
  const hash = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sentimentScore = (hash % 30) + 50;
  const baseSentiment = 50 + (stock.changePercent * 2);
  const sentimentChange = sentimentScore - baseSentiment;

  if (Math.abs(sentimentChange) < 15) return null;

  const score = Math.min(Math.abs(sentimentChange) * 2, 100);
  const signalStrength: 'strong' | 'moderate' | 'weak' =
    Math.abs(sentimentChange) > 25 ? 'strong' : Math.abs(sentimentChange) > 20 ? 'moderate' : 'weak';

  return {
    stock,
    signalType: 'sentiment',
    signalStrength,
    signalValue: sentimentChange > 0 ? 'Bullish Surge' : 'Bearish Surge',
    score,
    metadata: {
      sentimentChange: `${sentimentChange > 0 ? '+' : ''}${sentimentChange.toFixed(0)} pts`
    }
  };
};

const calculateVolatility = (stock: StockData): ScannerSignal | null => {
  const priceVolatility = Math.abs(stock.changePercent);
  const volumeVolatility = parseVolume(stock.volume) / (stock.price * 100_000);
  const volatilityScore = (priceVolatility * 0.6 + volumeVolatility * 40) * (1 + Math.random() * 0.5);

  if (volatilityScore < 2) return null;

  const score = Math.min(volatilityScore * 10, 100);
  const signalStrength: 'strong' | 'moderate' | 'weak' =
    volatilityScore > 5 ? 'strong' : volatilityScore > 3 ? 'moderate' : 'weak';

  return {
    stock,
    signalType: 'volatility',
    signalStrength,
    signalValue: volatilityScore > 4 ? 'Extreme' : 'High',
    score,
    metadata: {
      volatilityScore: Math.min(volatilityScore, 10)
    }
  };
};

export const scanMarket = (stocks: StockData[]): {
  volumeSignals: ScannerSignal[];
  sentimentSignals: ScannerSignal[];
  volatilitySignals: ScannerSignal[];
  allSignals: ScannerSignal[];
} => {
  const volumeSignals: ScannerSignal[] = [];
  const sentimentSignals: ScannerSignal[] = [];
  const volatilitySignals: ScannerSignal[] = [];

  stocks.forEach(stock => {
    const volumeSignal = calculateUnusualVolume(stock);
    if (volumeSignal) volumeSignals.push(volumeSignal);

    const sentimentSignal = calculateSentimentSpike(stock);
    if (sentimentSignal) sentimentSignals.push(sentimentSignal);

    const volatilitySignal = calculateVolatility(stock);
    if (volatilitySignal) volatilitySignals.push(volatilitySignal);
  });

  volumeSignals.sort((a, b) => b.score - a.score);
  sentimentSignals.sort((a, b) => b.score - a.score);
  volatilitySignals.sort((a, b) => b.score - a.score);

  const allSignals = [...volumeSignals, ...sentimentSignals, ...volatilitySignals]
    .sort((a, b) => b.score - a.score);

  return {
    volumeSignals: volumeSignals.slice(0, 6),
    sentimentSignals: sentimentSignals.slice(0, 6),
    volatilitySignals: volatilitySignals.slice(0, 6),
    allSignals: allSignals.slice(0, 12)
  };
};
