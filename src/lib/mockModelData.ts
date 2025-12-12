export interface MockModelData {
  id: string;
  name: string;
  code: string;
  type: 'neural_network' | 'ensemble' | 'statistical' | 'hybrid';
  accuracy: number;
  description: string;
  strengths: string[];
  useCases: string[];
  confidenceRange: { min: number; max: number };
  riskLevel: 'Low' | 'Medium' | 'High';
  avgPrediction: number;
  historicalAccuracy: { day: string; accuracy: number }[];
  metrics: {
    speed: number;
    confidence: number;
    riskAdjustedReturn: number;
  };
  notes: string;
}

export const MOCK_MODELS: MockModelData[] = [
  {
    id: 'lstm',
    name: 'LSTM',
    code: 'lstm',
    type: 'neural_network',
    accuracy: 87,
    description: 'Long Short-Term Memory network optimized for sequential price patterns and trend detection.',
    strengths: ['Trend Detection', 'Pattern Recognition', 'Time Series Analysis'],
    useCases: ['Medium-term trends', 'Momentum trading', 'Technical analysis'],
    confidenceRange: { min: 82, max: 91 },
    riskLevel: 'Medium',
    avgPrediction: 3.2,
    historicalAccuracy: [
      { day: 'Mon', accuracy: 85 },
      { day: 'Tue', accuracy: 87 },
      { day: 'Wed', accuracy: 86 },
      { day: 'Thu', accuracy: 88 },
      { day: 'Fri', accuracy: 87 },
      { day: 'Sat', accuracy: 89 },
      { day: 'Sun', accuracy: 87 }
    ],
    metrics: {
      speed: 85,
      confidence: 87,
      riskAdjustedReturn: 82
    },
    notes: 'Best for trending markets with clear momentum signals'
  },
  {
    id: 'transformer',
    name: 'Transformer',
    code: 'transformer',
    type: 'neural_network',
    accuracy: 91,
    description: 'Advanced attention-based model that captures complex market relationships and multi-factor influences.',
    strengths: ['Pattern Complexity', 'Multi-factor Analysis', 'Long-range Dependencies'],
    useCases: ['Complex patterns', 'Multi-asset correlation', 'Long-term forecasting'],
    confidenceRange: { min: 87, max: 94 },
    riskLevel: 'Low',
    avgPrediction: 3.8,
    historicalAccuracy: [
      { day: 'Mon', accuracy: 89 },
      { day: 'Tue', accuracy: 91 },
      { day: 'Wed', accuracy: 90 },
      { day: 'Thu', accuracy: 92 },
      { day: 'Fri', accuracy: 91 },
      { day: 'Sat', accuracy: 93 },
      { day: 'Sun', accuracy: 91 }
    ],
    metrics: {
      speed: 78,
      confidence: 91,
      riskAdjustedReturn: 89
    },
    notes: 'Excels in volatile markets with multiple influencing factors'
  },
  {
    id: 'tft',
    name: 'TFT',
    code: 'tft',
    type: 'hybrid',
    accuracy: 89,
    description: 'Temporal Fusion Transformer combining statistical rigor with deep learning for temporal forecasting.',
    strengths: ['Temporal Analysis', 'Feature Importance', 'Interpretability'],
    useCases: ['Time-based patterns', 'Seasonal trends', 'Event-driven trading'],
    confidenceRange: { min: 85, max: 92 },
    riskLevel: 'Medium',
    avgPrediction: 3.5,
    historicalAccuracy: [
      { day: 'Mon', accuracy: 87 },
      { day: 'Tue', accuracy: 89 },
      { day: 'Wed', accuracy: 88 },
      { day: 'Thu', accuracy: 90 },
      { day: 'Fri', accuracy: 89 },
      { day: 'Sat', accuracy: 91 },
      { day: 'Sun', accuracy: 89 }
    ],
    metrics: {
      speed: 80,
      confidence: 89,
      riskAdjustedReturn: 86
    },
    notes: 'Ideal for understanding temporal dynamics and feature contributions'
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    code: 'xgboost',
    type: 'statistical',
    accuracy: 85,
    description: 'Gradient boosting framework leveraging volume, fundamentals, and technical indicators.',
    strengths: ['Volume Analysis', 'Feature Engineering', 'Robustness'],
    useCases: ['Value investing', 'Fundamental analysis', 'High-volume stocks'],
    confidenceRange: { min: 80, max: 89 },
    riskLevel: 'Medium',
    avgPrediction: 2.9,
    historicalAccuracy: [
      { day: 'Mon', accuracy: 83 },
      { day: 'Tue', accuracy: 85 },
      { day: 'Wed', accuracy: 84 },
      { day: 'Thu', accuracy: 86 },
      { day: 'Fri', accuracy: 85 },
      { day: 'Sat', accuracy: 87 },
      { day: 'Sun', accuracy: 85 }
    ],
    metrics: {
      speed: 92,
      confidence: 85,
      riskAdjustedReturn: 81
    },
    notes: 'Strong performance with fundamental data and volume signals'
  },
  {
    id: 'ensemble',
    name: 'Ensemble',
    code: 'ensemble',
    type: 'hybrid',
    accuracy: 92,
    description: 'Consensus model combining predictions from multiple AI models for maximum reliability and accuracy.',
    strengths: ['Consensus Building', 'Risk Reduction', 'High Accuracy'],
    useCases: ['All market conditions', 'Risk-averse strategies', 'Portfolio optimization'],
    confidenceRange: { min: 88, max: 95 },
    riskLevel: 'Low',
    avgPrediction: 3.6,
    historicalAccuracy: [
      { day: 'Mon', accuracy: 90 },
      { day: 'Tue', accuracy: 92 },
      { day: 'Wed', accuracy: 91 },
      { day: 'Thu', accuracy: 93 },
      { day: 'Fri', accuracy: 92 },
      { day: 'Sat', accuracy: 94 },
      { day: 'Sun', accuracy: 92 }
    ],
    metrics: {
      speed: 75,
      confidence: 92,
      riskAdjustedReturn: 91
    },
    notes: 'Best overall performance through diversified model consensus'
  }
];

export function getBestModel(): MockModelData {
  return MOCK_MODELS.reduce((best, current) =>
    current.accuracy > best.accuracy ? current : best
  );
}

export function getModelById(id: string): MockModelData | undefined {
  return MOCK_MODELS.find(model => model.id === id);
}

export function generateMockPrediction(model: MockModelData, currentPrice: number) {
  const baseMultiplier = 1 + (model.avgPrediction / 100);
  const variance = 0.5;

  return {
    day1: {
      price: currentPrice * (1 + (Math.random() * variance - variance / 2 + 0.5) / 100),
      confidence: model.confidenceRange.min + Math.random() * (model.confidenceRange.max - model.confidenceRange.min)
    },
    day7: {
      price: currentPrice * (1 + (Math.random() * variance - variance / 2 + 2) / 100),
      confidence: model.confidenceRange.min + Math.random() * (model.confidenceRange.max - model.confidenceRange.min) - 3
    },
    day30: {
      price: currentPrice * baseMultiplier,
      confidence: model.confidenceRange.min + Math.random() * (model.confidenceRange.max - model.confidenceRange.min) - 5
    }
  };
}
