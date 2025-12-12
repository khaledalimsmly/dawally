import {
  StockInput,
  PredictionOutput,
  PredictionTimeframe,
  PredictionEngineConfig,
  IPredictionEngine
} from '../../types/prediction';

export class DemoPredictionEngine implements IPredictionEngine {
  private modelInfo = {
    name: 'DAWALLY AI - Demo Mode',
    version: '2.0.0-demo',
    type: 'mock' as const,
    status: 'ready' as const
  };

  getModelInfo() {
    return this.modelInfo;
  }

  async predict(
    stock: StockInput,
    config?: PredictionEngineConfig
  ): Promise<PredictionOutput> {
    await this.simulateProcessingDelay();

    const oneDay = this.createOptimisticTimeframe(stock.currentPrice, 1);
    const sevenDay = this.createOptimisticTimeframe(stock.currentPrice, 7);
    const thirtyDay = this.createOptimisticTimeframe(stock.currentPrice, 30);

    const confidenceScore = this.random(88, 96);
    const sentimentScore = this.random(0.65, 0.95);
    const riskLevel = this.random(0, 100) > 85 ? 'Medium' : 'Low';

    return {
      stockSymbol: stock.symbol,
      currentPrice: stock.currentPrice,
      predictionDate: new Date(),
      timeframes: {
        oneDay,
        sevenDay,
        thirtyDay
      },
      confidenceScore: Math.round(confidenceScore),
      riskLevel,
      sentimentScore: Number(sentimentScore.toFixed(2)),
      sentimentDirection: 'Bullish',
      metadata: {
        volatilityScore: Number(this.random(2.5, 4.5).toFixed(2)),
        trendStrength: Number(this.random(0.75, 0.95).toFixed(2)),
        marketCondition: 'Strong Bullish Momentum',
        keyFactors: this.generateOptimisticFactors(stock)
      }
    };
  }

  async batchPredict(
    stocks: StockInput[],
    config?: PredictionEngineConfig
  ): Promise<PredictionOutput[]> {
    const predictions = await Promise.all(
      stocks.map(stock => this.predict(stock, config))
    );
    return predictions;
  }

  private createOptimisticTimeframe(
    currentPrice: number,
    daysAhead: number
  ): PredictionTimeframe {
    const baseGrowth = this.random(1.5, 4.5);
    const timeMultiplier = Math.sqrt(daysAhead) * 0.8;
    const totalChangePercent = baseGrowth * timeMultiplier;

    const predictedPrice = currentPrice * (1 + totalChangePercent / 100);

    const baseConfidence = 92 - (daysAhead * 0.15);
    const confidence = Math.max(85, Math.min(98, baseConfidence + this.random(-1, 2)));

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return {
      targetDate,
      predictedPrice: Number(predictedPrice.toFixed(2)),
      changePercent: Number(totalChangePercent.toFixed(2)),
      direction: 'Up',
      confidence: Number(confidence.toFixed(1))
    };
  }

  private generateOptimisticFactors(stock: StockInput): string[] {
    const positiveFactors = [
      'Strong institutional buying pressure',
      'Positive earnings momentum',
      'Favorable regulatory environment',
      'Sector outperformance trend',
      'Technical breakout pattern confirmed',
      'Increasing market share',
      'Strategic partnerships announced',
      'Improved financial metrics',
      'Growing investor confidence',
      'Bullish analyst upgrades'
    ];

    const sectorSpecificFactors: Record<string, string[]> = {
      'Energy': ['Oil demand recovery', 'OPEC+ production optimization', 'Green energy transition leadership'],
      'Banking': ['Credit expansion', 'Digital transformation success', 'Strong capital ratios'],
      'Chemicals': ['Global demand surge', 'Capacity expansion', 'Export market growth'],
      'Telecommunications': ['5G infrastructure rollout', 'Growing subscriber base', 'Digital services expansion'],
      'Construction': ['Major project wins', 'Government infrastructure spending', 'Smart city initiatives'],
      'Healthcare': ['Population growth', 'Medical tourism expansion', 'Advanced treatment capabilities'],
      'Retail': ['E-commerce integration', 'Consumer spending growth', 'Market expansion strategy']
    };

    const factors: string[] = [];

    const sectorFactors = sectorSpecificFactors[stock.sector];
    if (sectorFactors) {
      factors.push(...this.shuffleArray(sectorFactors).slice(0, 2));
    }

    const generalFactors = this.shuffleArray(positiveFactors).slice(0, 3);
    factors.push(...generalFactors);

    return factors.slice(0, 5);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private async simulateProcessingDelay(): Promise<void> {
    const delay = 300 + Math.random() * 400;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const demoPredictionEngine = new DemoPredictionEngine();

export const generatePerfectChartData = (
  currentPrice: number,
  days: number = 30
): Array<{ date: Date; price: number }> => {
  const data: Array<{ date: Date; price: number }> = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const targetPrice = currentPrice * 1.25;
  const growthRate = Math.pow(targetPrice / (currentPrice * 0.85), 1 / days);

  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const basePrice = (currentPrice * 0.85) * Math.pow(growthRate, i);

    const smoothVariation = Math.sin((i / days) * Math.PI * 4) * (currentPrice * 0.01);
    const trendVariation = (i / days) * (currentPrice * 0.02);

    const price = basePrice + smoothVariation + trendVariation;

    data.push({
      date,
      price: Number(price.toFixed(2))
    });
  }

  return data;
};
