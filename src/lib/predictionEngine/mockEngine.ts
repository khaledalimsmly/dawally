import {
  StockInput,
  PredictionOutput,
  PredictionTimeframe,
  PredictionEngineConfig,
  IPredictionEngine
} from '../../types/prediction';

export class MockPredictionEngine implements IPredictionEngine {
  private modelInfo = {
    name: 'Mock AI Prediction Engine',
    version: '1.0.0',
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

    const volatility = this.calculateVolatility(stock, config);
    const sentimentScore = this.calculateSentiment(stock);
    const trendStrength = this.calculateTrendStrength(stock);

    const oneDay = this.predictTimeframe(stock.currentPrice, 1, volatility, sentimentScore, trendStrength, config);
    const sevenDay = this.predictTimeframe(stock.currentPrice, 7, volatility, sentimentScore, trendStrength, config);
    const thirtyDay = this.predictTimeframe(stock.currentPrice, 30, volatility, sentimentScore, trendStrength, config);

    const avgConfidence = (oneDay.confidence + sevenDay.confidence + thirtyDay.confidence) / 3;
    const confidenceScore = this.normalizeConfidence(avgConfidence, config);
    const riskLevel = this.calculateRiskLevel(volatility, confidenceScore);
    const sentimentDirection = this.getSentimentDirection(sentimentScore);

    return {
      stockSymbol: stock.symbol,
      currentPrice: stock.currentPrice,
      predictionDate: new Date(),
      timeframes: {
        oneDay,
        sevenDay,
        thirtyDay
      },
      confidenceScore,
      riskLevel,
      sentimentScore,
      sentimentDirection,
      metadata: {
        volatilityScore: volatility,
        trendStrength,
        marketCondition: this.getMarketCondition(sentimentScore, volatility),
        keyFactors: this.generateKeyFactors(stock, sentimentScore, volatility)
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

  private predictTimeframe(
    currentPrice: number,
    daysAhead: number,
    volatility: number,
    sentiment: number,
    trendStrength: number,
    config?: PredictionEngineConfig
  ): PredictionTimeframe {
    const baseChange = this.calculateBaseChange(daysAhead, sentiment, trendStrength);
    const volatilityAdjustment = this.random(-volatility, volatility) * (config?.volatilityFactor || 1);
    const totalChangePercent = baseChange + volatilityAdjustment;

    const predictedPrice = currentPrice * (1 + totalChangePercent / 100);

    const direction = totalChangePercent > 0.5 ? 'Up' : totalChangePercent < -0.5 ? 'Down' : 'Neutral';

    const baseConfidence = 85 - (volatility * 5) - (daysAhead * 0.5);
    const sentimentBoost = Math.abs(sentiment) * 10;
    const confidence = Math.max(45, Math.min(95, baseConfidence + sentimentBoost + this.random(-5, 5)));

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return {
      targetDate,
      predictedPrice: Number(predictedPrice.toFixed(2)),
      changePercent: Number(totalChangePercent.toFixed(2)),
      direction,
      confidence: Number(confidence.toFixed(1))
    };
  }

  private calculateVolatility(stock: StockInput, config?: PredictionEngineConfig): number {
    const sectorVolatility: Record<string, number> = {
      'Energy': 8.5,
      'Banking': 4.5,
      'Chemicals': 6.0,
      'Telecommunications': 3.5,
      'Construction': 7.0,
      'Food & Beverages': 3.0,
      'Retail': 5.5,
      'Transportation': 6.5,
      'Healthcare': 4.0,
      'Investment': 7.5
    };

    const baseVolatility = sectorVolatility[stock.sector] || 5.0;
    const priceVolatility = (stock.currentPrice / 100) * 0.5;
    const randomFactor = this.random(0.8, 1.2);

    return Number((baseVolatility + priceVolatility) * randomFactor * (config?.volatilityFactor || 1)).toFixed(2) as unknown as number;
  }

  private calculateSentiment(stock: StockInput): number {
    const hash = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseSentiment = ((hash % 200) - 100) / 100;

    const sectorSentiment: Record<string, number> = {
      'Energy': 0.15,
      'Banking': 0.05,
      'Chemicals': -0.05,
      'Telecommunications': 0.20,
      'Construction': 0.10,
      'Food & Beverages': 0.08,
      'Retail': -0.10,
      'Transportation': 0.05,
      'Healthcare': 0.25,
      'Investment': 0.00
    };

    const sectorWeight = sectorSentiment[stock.sector] || 0;
    const sentiment = (baseSentiment * 0.7 + sectorWeight * 0.3);

    return Number(Math.max(-1, Math.min(1, sentiment)).toFixed(2));
  }

  private calculateTrendStrength(stock: StockInput): number {
    const priceLevel = stock.currentPrice;
    const strength = (priceLevel % 10) / 10;
    return Number((strength * 0.8 + this.random(0.2, 0.4)).toFixed(2));
  }

  private calculateBaseChange(daysAhead: number, sentiment: number, trendStrength: number): number {
    const sentimentImpact = sentiment * 2;
    const trendImpact = (trendStrength - 0.5) * 1.5;
    const timeDecay = Math.sqrt(daysAhead) * 0.3;

    return (sentimentImpact + trendImpact) * timeDecay;
  }

  private normalizeConfidence(
    rawConfidence: number,
    config?: PredictionEngineConfig
  ): number {
    const min = config?.confidenceRange?.min || 45;
    const max = config?.confidenceRange?.max || 95;
    const normalized = Math.max(min, Math.min(max, rawConfidence));
    return Number(normalized.toFixed(0));
  }

  private calculateRiskLevel(
    volatility: number,
    confidence: number
  ): 'Low' | 'Medium' | 'High' {
    const riskScore = volatility * 10 - confidence / 10;

    if (riskScore > 50) return 'High';
    if (riskScore > 25) return 'Medium';
    return 'Low';
  }

  private getSentimentDirection(
    sentimentScore: number
  ): 'Bullish' | 'Bearish' | 'Neutral' {
    if (sentimentScore > 0.15) return 'Bullish';
    if (sentimentScore < -0.15) return 'Bearish';
    return 'Neutral';
  }

  private getMarketCondition(sentiment: number, volatility: number): string {
    if (volatility > 7) {
      return sentiment > 0 ? 'Volatile Bullish' : 'Volatile Bearish';
    }
    if (volatility < 4) {
      return 'Stable';
    }
    return sentiment > 0 ? 'Moderately Bullish' : 'Moderately Bearish';
  }

  private generateKeyFactors(
    stock: StockInput,
    sentiment: number,
    volatility: number
  ): string[] {
    const factors: string[] = [];

    if (sentiment > 0.2) {
      factors.push('Strong positive market sentiment');
    } else if (sentiment < -0.2) {
      factors.push('Negative market sentiment');
    }

    if (volatility > 7) {
      factors.push('High sector volatility');
    } else if (volatility < 4) {
      factors.push('Low volatility environment');
    }

    const sectorFactors: Record<string, string[]> = {
      'Energy': ['Oil price trends', 'OPEC production levels'],
      'Banking': ['Interest rate environment', 'Credit growth'],
      'Chemicals': ['Commodity prices', 'Industrial demand'],
      'Telecommunications': ['5G rollout', 'Competition dynamics'],
      'Construction': ['Government spending', 'Real estate market'],
      'Healthcare': ['Demographics', 'Healthcare spending'],
      'Retail': ['Consumer confidence', 'E-commerce growth']
    };

    const sectorSpecific = sectorFactors[stock.sector];
    if (sectorSpecific) {
      factors.push(...sectorSpecific.slice(0, 2));
    }

    factors.push('Historical price patterns', 'Technical indicators');

    return factors.slice(0, 5);
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private async simulateProcessingDelay(): Promise<void> {
    const delay = 100 + Math.random() * 200;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const mockPredictionEngine = new MockPredictionEngine();
