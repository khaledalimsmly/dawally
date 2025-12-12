export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  risk_preference: 'conservative' | 'moderate' | 'aggressive';
  created_at: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  current_price: string;
  created_at: string;
}

export interface Prediction {
  id: string;
  stock_id: string;
  model_id?: string;
  price_1d: string;
  change_1d_percent: string;
  direction_1d: 'Up' | 'Down' | 'Neutral';
  price_7d: string;
  change_7d_percent: string;
  direction_7d: 'Up' | 'Down' | 'Neutral';
  price_30d: string;
  change_30d_percent: string;
  direction_30d: 'Up' | 'Down' | 'Neutral';
  confidence_score: string;
  risk_level: 'Low' | 'Medium' | 'High';
  sentiment_score: string;
  last_updated: string;
}

export interface MarketScannerData {
  id: string;
  stock_id: string;
  volume_today: string;
  volume_avg: string;
  volatility_score: string;
  sentiment_classification: 'Bullish' | 'Bearish' | 'Neutral';
  last_updated: string;
}

export interface StockWithPrediction extends Stock {
  prediction?: Prediction;
}

export type ModelType = 'neural_network' | 'ensemble' | 'statistical' | 'hybrid';

export interface Model {
  id: string;
  name: string;
  code: string;
  description: string | null;
  type: ModelType;
  accuracy: number | null;
  strengths: string[];
  use_cases: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
