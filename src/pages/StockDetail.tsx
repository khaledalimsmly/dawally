import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Activity, DollarSign, TrendingUp, Sparkles, Target, Brain, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, ConfidenceGauge, TrendIndicator, SentimentBadge, PriceChart, SentimentWidget, ModelBreakdown, PredictionCard } from '../components';
import { getStockBySymbol } from '../data/stocks';
import { getActiveModels, getModelTypeLabel, getModelTypeColor } from '../lib/modelService';
import { useRTL } from '../hooks/useRTL';
import type { Model } from '../types';

export const StockDetail = () => {
  const { t } = useTranslation('stockDetail');
  const { isRTL } = useRTL();
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const stock = symbol ? getStockBySymbol(symbol) : undefined;
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const activeModels = await getActiveModels();
      setModels(activeModels);
      if (activeModels.length > 0) {
        setSelectedModel(activeModels[0]);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="max-w-md w-full text-center">
          <div className="space-y-4">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto" />
            <h2 className="text-2xl font-bold text-white">{t('errors.notFound')}</h2>
            <p className="text-gray-400">
              {t('errors.notFoundDescription', { symbol })}
            </p>
            <Button onClick={() => navigate('/search')}>
              {t('errors.backToSearch')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const mockPredictions = {
    day1: {
      price: stock.price + (stock.price * 0.015),
      change: 1.5,
      direction: 'up' as const,
      confidence: 87
    },
    day7: {
      price: stock.price + (stock.price * 0.035),
      change: 3.5,
      direction: 'up' as const,
      confidence: 78
    },
    day30: {
      price: stock.price + (stock.price * 0.082),
      change: 8.2,
      direction: 'up' as const,
      confidence: 65
    }
  };

  const overallConfidence = 78;
  const riskLevel = stock.changePercent > 2 || stock.changePercent < -2 ? 'high' :
                    stock.changePercent > 1 || stock.changePercent < -1 ? 'medium' : 'low';

  const sentiment: 'bullish' | 'bearish' | 'neutral' =
    stock.changePercent > 1 ? 'bullish' :
    stock.changePercent < -1 ? 'bearish' : 'neutral';

  const chartData = [
    {
      day: t('chart.today'),
      price: stock.price,
      upperBound: stock.price * 1.02,
      lowerBound: stock.price * 0.98
    },
    {
      day: t('chart.day1'),
      price: mockPredictions.day1.price,
      upperBound: mockPredictions.day1.price * 1.03,
      lowerBound: mockPredictions.day1.price * 0.97
    },
    {
      day: t('chart.day7'),
      price: mockPredictions.day7.price,
      upperBound: mockPredictions.day7.price * 1.05,
      lowerBound: mockPredictions.day7.price * 0.95
    },
    {
      day: t('chart.day30'),
      price: mockPredictions.day30.price,
      upperBound: mockPredictions.day30.price * 1.08,
      lowerBound: mockPredictions.day30.price * 0.92
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-7xl">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
          <button
            onClick={() => navigate('/search')}
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-gray-400 hover:text-teal-400 transition-colors`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            {t('backToSearch')}
          </button>

          {!loadingModels && models.length > 0 && selectedModel && (
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-gray-400">{t('aiModel')}</span>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const model = models.find(m => m.id === e.target.value);
                  if (model) setSelectedModel(model);
                }}
                className="px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all cursor-pointer"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {model.accuracy ? `(${model.accuracy}% ${t('accuracy')})` : ''}
                  </option>
                ))}
              </select>
              <div className={`hidden md:flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg`}>
                <span className={`text-xs font-semibold ${getModelTypeColor(selectedModel.type)}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {getModelTypeLabel(selectedModel.type)}
                </span>
              </div>
              <Button
                onClick={() => navigate(`/stock/${symbol}/compare`)}
                variant="secondary"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Brain className="w-4 h-4" />
                {t('compareFor', { symbol })}
              </Button>
              <Button
                onClick={() => navigate('/compare-models')}
                variant="secondary"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Layers className="w-4 h-4" />
                {t('viewAllModels')}
              </Button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} mb-3`}>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{stock.name}</h1>
                <span className="text-2xl font-bold text-teal-400 bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/30">
                  {stock.symbol}
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
                <Badge variant={stock.sector === 'Banking' ? 'low' : stock.sector === 'Energy' ? 'high' : 'medium'}>
                  {stock.sector}
                </Badge>
                <SentimentBadge sentiment={sentiment} score={stock.changePercent} />
              </div>
            </div>

            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700">
              <div className={`text-center ${isRTL ? 'lg:text-left' : 'lg:text-right'}`}>
                <div className="text-gray-400 text-sm mb-1">{t('currentPrice')}</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {stock.price.toFixed(2)} <span className="text-2xl text-gray-400">SAR</span>
                </div>
                <TrendIndicator
                  direction={stock.change >= 0 ? 'up' : 'down'}
                  value={stock.changePercent}
                  size="lg"
                />
              </div>
            </Card>
          </div>
        </div>

        {selectedModel && (
          <Card className="mb-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-gray-800/50 border-cyan-500/30">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-400 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('aiModel')}</h2>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
                  <h3 className="text-lg font-bold text-white">{selectedModel.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getModelTypeColor(selectedModel.type)} bg-gray-900/50`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {getModelTypeLabel(selectedModel.type)}
                  </span>
                  {selectedModel.accuracy && (
                    <span className="px-2 py-1 rounded text-xs font-semibold text-cyan-400 bg-cyan-500/20" dir={isRTL ? 'rtl' : 'ltr'}>
                      {selectedModel.accuracy}% {t('accuracy')}
                    </span>
                  )}
                </div>
                {selectedModel.description && (
                  <p className="text-gray-400 text-sm mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{selectedModel.description}</p>
                )}
                {selectedModel.strengths.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.strengths.map((strength, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-xs text-gray-300"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm font-semibold">{t('metrics.volume')}</div>
                <div className="text-white text-xl font-bold">{stock.volume}</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/30 shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:scale-105">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm font-semibold">{t('metrics.marketCap')}</div>
                <div className="text-white text-xl font-bold">{stock.marketCap}</div>
              </div>
            </div>
          </Card>

          <Card className={`bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-105 ${
            riskLevel === 'high' ? 'from-red-500/10 to-red-600/5 border-red-500/30 hover:shadow-red-500/20' :
            riskLevel === 'medium' ? 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/30 hover:shadow-yellow-500/20' :
            'from-green-500/10 to-green-600/5 border-green-500/30 hover:shadow-green-500/20'
          }`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                riskLevel === 'high' ? 'bg-red-500/20' :
                riskLevel === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
              }`}>
                <Activity className={`w-7 h-7 ${
                  riskLevel === 'high' ? 'text-red-400' :
                  riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`} />
              </div>
              <div>
                <div className="text-gray-400 text-sm font-semibold">{t('metrics.riskLevel')}</div>
                <Badge variant={riskLevel} className="mt-1 text-base">
                  {t(`riskLevels.${riskLevel}`)}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm font-semibold">{t('metrics.aiConfidence')}</div>
                <div className="text-white text-xl font-bold">{overallConfidence}%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-8`}>
                <h2 className={`text-3xl font-bold text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="w-7 h-7 text-teal-400" />
                  {t('chartTitle')}
                </h2>
                <div className="text-sm text-gray-400 font-semibold">
                  {t('chartSubtitle')}
                </div>
              </div>
              <PriceChart data={chartData} showConfidenceBands={true} />
              <div className={`mt-6 flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-center gap-8 text-sm`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50" />
                  <span className="text-gray-300 font-semibold">{t('legend.predictedPrice')}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 rounded-full bg-blue-400/30" />
                  <span className="text-gray-300 font-semibold">{t('legend.confidenceRange')}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
            <h3 className={`text-2xl font-bold text-white mb-8 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-6 h-6 text-teal-400" />
              {t('overallConfidenceTitle')}
            </h3>
            <ConfidenceGauge score={overallConfidence} size="lg" />
            <p className="text-gray-400 text-sm mt-8 text-center max-w-xs leading-relaxed">
              {t('confidenceDescription')}
            </p>
          </Card>
        </div>

        <div className="mb-12">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-8`}>
            <h2 className={`text-3xl font-bold text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-8 h-8 text-teal-400" />
              {t('predictionsTitle')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1">
              <SentimentWidget
                sentiment={sentiment}
                score={stock.changePercent}
                strength={overallConfidence}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-6">
                <PredictionCard
                  timeframe="1-Day"
                  targetPrice={mockPredictions.day1.price}
                  changePercent={mockPredictions.day1.change}
                  confidence={mockPredictions.day1.confidence}
                  riskLevel="low"
                  direction={mockPredictions.day1.direction}
                  delay={0.1}
                />

                <PredictionCard
                  timeframe="7-Day"
                  targetPrice={mockPredictions.day7.price}
                  changePercent={mockPredictions.day7.change}
                  confidence={mockPredictions.day7.confidence}
                  riskLevel="medium"
                  direction={mockPredictions.day7.direction}
                  delay={0.2}
                />

                <PredictionCard
                  timeframe="30-Day"
                  targetPrice={mockPredictions.day30.price}
                  changePercent={mockPredictions.day30.change}
                  confidence={mockPredictions.day30.confidence}
                  riskLevel={riskLevel}
                  direction={mockPredictions.day30.direction}
                  delay={0.3}
                />
              </div>
            </div>
          </div>

          <div className="animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <ModelBreakdown />
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
          `}</style>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
            <h3 className={`text-2xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-6 h-6 text-teal-400" />
              {t('insights.title')}
            </h3>
            <div className="space-y-5">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300`}>
                <div className={`w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-teal-400/50 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    {stock.changePercent > 0
                      ? t('insights.positive')
                      : t('insights.negative')}
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300`}>
                <div className={`w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-teal-400/50 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    {t('insights.prediction', {
                      trend: mockPredictions.day30.change > 0 ? t('sentiments.bullish') : t('sentiments.bearish'),
                      confidence: overallConfidence
                    })}
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300`}>
                <div className={`w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-teal-400/50 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    {t('insights.volume', {
                      level: parseFloat(stock.volume) > 5 ? t('insights.volumeLevels.above') : t('insights.volumeLevels.below'),
                      volume: stock.volume,
                      interest: parseFloat(stock.volume) > 5 ? t('insights.volumeLevels.strong') : t('insights.volumeLevels.moderate')
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
            <h3 className={`text-2xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="w-6 h-6 text-yellow-400" />
              {t('risk.title')}
            </h3>
            <div className="space-y-6">
              <div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-3`}>
                  <span className="text-gray-400 font-semibold text-sm">{t('risk.priceVolatility')}</span>
                  <span className="text-white font-bold">
                    {Math.abs(stock.changePercent) > 2 ? t('riskLevels.high') :
                     Math.abs(stock.changePercent) > 1 ? t('riskLevels.medium') : t('riskLevels.low')}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700/50 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      Math.abs(stock.changePercent) > 2 ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/50' :
                      Math.abs(stock.changePercent) > 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg shadow-yellow-500/50' :
                      'bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50'
                    }`}
                    style={{ width: `${Math.min(Math.abs(stock.changePercent) * 20, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-3`}>
                  <span className="text-gray-400 font-semibold text-sm">{t('risk.predictionAccuracy')}</span>
                  <span className="text-white font-bold">{overallConfidence}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700/50 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-teal-400 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-teal-500/50"
                    style={{ width: `${overallConfidence}%` }}
                  />
                </div>
              </div>

              <div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-3`}>
                  <span className="text-gray-400 font-semibold text-sm">{t('risk.marketSentiment')}</span>
                  <span className="text-white font-bold capitalize">{t(`sentiments.${sentiment}`)}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700/50 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      sentiment === 'bullish' ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50' :
                      sentiment === 'bearish' ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/50' :
                      'bg-gradient-to-r from-gray-500 to-gray-400'
                    }`}
                    style={{ width: '72%' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-cyan-500/10 border-teal-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-8">
            <div className={`flex flex-col sm:flex-row items-center gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-teal-400 animate-pulse" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-white font-bold text-xl mb-2">{t('cta.title')}</p>
                <p className="text-gray-400 text-base mb-4 leading-relaxed">{t('cta.description')}</p>
                <Link to="/signup">
                  <Button size="sm" className="text-base px-6 py-3 shadow-lg hover:shadow-teal-500/30 transition-all">
                    {t('cta.button')}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
