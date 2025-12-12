import { StockData } from '../data/stocks';
import { StockInput, PredictionOutput } from '../types/prediction';
import { getPredictionEngine } from '../lib/predictionEngine';

export const convertStockToInput = (stock: StockData): StockInput => {
  return {
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    currentPrice: stock.price,
    volume: stock.volume,
    marketCap: stock.marketCap
  };
};

export const generatePrediction = async (stock: StockData): Promise<PredictionOutput> => {
  const engine = getPredictionEngine();
  const input = convertStockToInput(stock);
  return await engine.predict(input);
};

export const generateBatchPredictions = async (stocks: StockData[]): Promise<PredictionOutput[]> => {
  const engine = getPredictionEngine();
  const inputs = stocks.map(convertStockToInput);
  return await engine.batchPredict(inputs);
};

export const formatPrediction = (prediction: PredictionOutput) => {
  return {
    stock: prediction.stockSymbol,
    current: `${prediction.currentPrice.toFixed(2)} SAR`,
    predictions: {
      '1D': {
        price: `${prediction.timeframes.oneDay.predictedPrice.toFixed(2)} SAR`,
        change: `${prediction.timeframes.oneDay.changePercent > 0 ? '+' : ''}${prediction.timeframes.oneDay.changePercent.toFixed(2)}%`,
        direction: prediction.timeframes.oneDay.direction,
        confidence: `${prediction.timeframes.oneDay.confidence}%`
      },
      '7D': {
        price: `${prediction.timeframes.sevenDay.predictedPrice.toFixed(2)} SAR`,
        change: `${prediction.timeframes.sevenDay.changePercent > 0 ? '+' : ''}${prediction.timeframes.sevenDay.changePercent.toFixed(2)}%`,
        direction: prediction.timeframes.sevenDay.direction,
        confidence: `${prediction.timeframes.sevenDay.confidence}%`
      },
      '30D': {
        price: `${prediction.timeframes.thirtyDay.predictedPrice.toFixed(2)} SAR`,
        change: `${prediction.timeframes.thirtyDay.changePercent > 0 ? '+' : ''}${prediction.timeframes.thirtyDay.changePercent.toFixed(2)}%`,
        direction: prediction.timeframes.thirtyDay.direction,
        confidence: `${prediction.timeframes.thirtyDay.confidence}%`
      }
    },
    overall: {
      confidence: `${prediction.confidenceScore}%`,
      risk: prediction.riskLevel,
      sentiment: `${prediction.sentimentDirection} (${prediction.sentimentScore.toFixed(2)})`,
      condition: prediction.metadata?.marketCondition || 'Unknown'
    },
    keyFactors: prediction.metadata?.keyFactors || []
  };
};

export const getPredictionColor = (direction: 'Up' | 'Down' | 'Neutral'): string => {
  switch (direction) {
    case 'Up':
      return 'text-emerald-400';
    case 'Down':
      return 'text-red-400';
    case 'Neutral':
      return 'text-gray-400';
  }
};

export const getRiskColor = (risk: 'Low' | 'Medium' | 'High'): string => {
  switch (risk) {
    case 'Low':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'High':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

export const getSentimentColor = (sentiment: 'Bullish' | 'Bearish' | 'Neutral'): string => {
  switch (sentiment) {
    case 'Bullish':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Bearish':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Neutral':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getConfidenceLevel = (score: number): string => {
  if (score >= 80) return 'Very High';
  if (score >= 70) return 'High';
  if (score >= 60) return 'Moderate';
  if (score >= 50) return 'Low';
  return 'Very Low';
};
