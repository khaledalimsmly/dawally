export interface StockInput {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  volume?: string;
  marketCap?: string;
}

export interface PredictionTimeframe {
  targetDate: Date;
  predictedPrice: number;
  changePercent: number;
  direction: 'Up' | 'Down' | 'Neutral';
  confidence: number;
}

export interface PredictionOutput {
  stockSymbol: string;
  currentPrice: number;
  predictionDate: Date;

  timeframes: {
    oneDay: PredictionTimeframe;
    sevenDay: PredictionTimeframe;
    thirtyDay: PredictionTimeframe;
  };

  confidenceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  sentimentScore: number;
  sentimentDirection: 'Bullish' | 'Bearish' | 'Neutral';

  metadata?: {
    volatilityScore?: number;
    trendStrength?: number;
    marketCondition?: string;
    keyFactors?: string[];
  };
}

export interface PredictionEngineConfig {
  volatilityFactor?: number;
  confidenceRange?: { min: number; max: number };
  sentimentWeight?: number;
  randomnessSeed?: number;
}

export interface IPredictionEngine {
  predict(stock: StockInput, config?: PredictionEngineConfig): Promise<PredictionOutput>;
  batchPredict(stocks: StockInput[], config?: PredictionEngineConfig): Promise<PredictionOutput[]>;

  getModelInfo(): {
    name: string;
    version: string;
    type: 'mock' | 'tensorflow' | 'pytorch' | 'onnx';
    status: 'ready' | 'loading' | 'error';
  };
}
