import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Target, BarChart3, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Button, TrendIndicator } from '../components';
import { getStockBySymbol } from '../data/stocks';
import { getActiveModels, getModelTypeLabel, getModelTypeColor } from '../lib/modelService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRTL } from '../hooks/useRTL';
import type { Model } from '../types';

interface ModelPrediction {
  model: Model;
  predictions: {
    day1: { price: number; change: number; confidence: number };
    day7: { price: number; change: number; confidence: number };
    day30: { price: number; change: number; confidence: number };
  };
  riskLevel: 'Low' | 'Medium' | 'High';
  sentiment: number;
}

export const CompareModels = () => {
  const { t } = useTranslation('compareModels');
  const { isRTL } = useRTL();
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const stock = symbol ? getStockBySymbol(symbol) : undefined;
  const [models, setModels] = useState<Model[]>([]);
  const [modelPredictions, setModelPredictions] = useState<ModelPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelsAndPredictions();
  }, [symbol]);

  const loadModelsAndPredictions = async () => {
    try {
      const activeModels = await getActiveModels();
      setModels(activeModels);

      if (stock) {
        const predictions = generateMockPredictions(activeModels, stock);
        setModelPredictions(predictions);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = (models: Model[], stockData: any): ModelPrediction[] => {
    return models.map((model, idx) => {
      const baseMultiplier = 1 + (idx * 0.005);
      const accuracyFactor = (model.accuracy || 85) / 100;

      return {
        model,
        predictions: {
          day1: {
            price: stockData.price * (1 + (0.012 * baseMultiplier)),
            change: 1.2 * baseMultiplier,
            confidence: Math.min(95, (model.accuracy || 85) + (idx * 2))
          },
          day7: {
            price: stockData.price * (1 + (0.035 * baseMultiplier)),
            change: 3.5 * baseMultiplier,
            confidence: Math.min(92, (model.accuracy || 85) - 3 + (idx * 2))
          },
          day30: {
            price: stockData.price * (1 + (0.082 * baseMultiplier * accuracyFactor)),
            change: 8.2 * baseMultiplier * accuracyFactor,
            confidence: Math.min(88, (model.accuracy || 85) - 8 + (idx * 2))
          }
        },
        riskLevel: model.type === 'hybrid' ? 'Low' : model.type === 'statistical' ? 'Medium' : 'High',
        sentiment: 0.6 + (idx * 0.1)
      };
    });
  };

  const prepareChartData = () => {
    if (!stock || modelPredictions.length === 0) return [];

    return [
      {
        day: t('chart.today'),
        ...modelPredictions.reduce((acc, mp) => {
          acc[mp.model.name] = stock.price;
          return acc;
        }, {} as any)
      },
      {
        day: t('chart.day1'),
        ...modelPredictions.reduce((acc, mp) => {
          acc[mp.model.name] = mp.predictions.day1.price;
          return acc;
        }, {} as any)
      },
      {
        day: t('chart.day7'),
        ...modelPredictions.reduce((acc, mp) => {
          acc[mp.model.name] = mp.predictions.day7.price;
          return acc;
        }, {} as any)
      },
      {
        day: t('chart.day30'),
        ...modelPredictions.reduce((acc, mp) => {
          acc[mp.model.name] = mp.predictions.day30.price;
          return acc;
        }, {} as any)
      }
    ];
  };

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="max-w-md w-full text-center">
          <div className="space-y-4">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto" />
            <h2 className="text-2xl font-bold text-white">{t('errors.notFound')}</h2>
            <p className="text-gray-400">{t('errors.notFoundDescription', { symbol })}</p>
            <Button onClick={() => navigate('/search')}>{t('errors.backToSearch')}</Button>
          </div>
        </Card>
      </div>
    );
  }

  const chartData = prepareChartData();
  const colors = ['#14b8a6', '#3b82f6', '#a855f7', '#f59e0b'];

  return (
    <div className="min-h-screen py-8 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-7xl">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
          <button
            onClick={() => navigate(`/stock/${symbol}`)}
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-gray-400 hover:text-teal-400 transition-colors`}
          >
            <ArrowLeft className={isRTL ? 'rotate-180' : ''} />
            {t('backToStock', { symbol: stock.symbol })}
          </button>
        </div>

        <div className="mb-8">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} mb-3`}>
            <h1 className="text-4xl font-bold text-white">{t('title')}</h1>
          </div>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xl text-gray-400">{stock.name}</span>
            <span className="text-xl font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/30">
              {stock.symbol}
            </span>
            <div className="text-2xl font-bold text-white">
              {stock.price.toFixed(2)} <span className="text-lg text-gray-400">SAR</span>
            </div>
          </div>
        </div>

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
              <p className="text-gray-400 mt-4">{t('loading')}</p>
            </div>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <h2 className={`text-2xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Activity className="w-6 h-6 text-teal-400" />
                {t('chartTitle')}
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)} SAR`, '']}
                  />
                  <Legend />
                  {modelPredictions.map((mp, idx) => (
                    <Line
                      key={mp.model.id}
                      type="monotone"
                      dataKey={mp.model.name}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={3}
                      dot={{ r: 6, fill: colors[idx % colors.length] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                {modelPredictions.map((mp, idx) => (
                  <div key={mp.model.id} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    />
                    <span className="text-gray-300">{mp.model.name}</span>
                    <span className={`text-xs ${getModelTypeColor(mp.model.type)}`}>
                      ({getModelTypeLabel(mp.model.type)})
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mb-8">
              <h2 className={`text-2xl font-bold text-white mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Brain className="w-6 h-6 text-cyan-400" />
                {t('analysisTitle')}
              </h2>
              <div className="grid gap-6">
                {modelPredictions.map((mp) => (
                  <Card
                    key={mp.model.id}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80"
                  >
                    <div className="mb-6">
                      <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-4`}>
                        <div className="flex-1">
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
                            <h3 className="text-2xl font-bold text-white" dir={isRTL ? 'rtl' : 'ltr'}>{mp.model.name}</h3>
                            <span
                              className={`px-3 py-1 rounded text-sm font-semibold ${getModelTypeColor(mp.model.type)} bg-gray-900/50`}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            >
                              {getModelTypeLabel(mp.model.type)}
                            </span>
                            {mp.model.accuracy && (
                              <span className="px-3 py-1 rounded text-sm font-semibold text-teal-400 bg-teal-500/20" dir={isRTL ? 'rtl' : 'ltr'}>
                                {mp.model.accuracy}% {t('accuracy')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{mp.model.description}</p>
                          {mp.model.strengths.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {mp.model.strengths.map((strength, idx) => (
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

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('predictions.day1')}</div>
                          <div className="text-2xl font-bold text-white mb-2">
                            {mp.predictions.day1.price.toFixed(2)} SAR
                          </div>
                          <TrendIndicator
                            direction={mp.predictions.day1.change >= 0 ? 'up' : 'down'}
                            value={mp.predictions.day1.change}
                            size="sm"
                          />
                          <div className={`mt-3 flex ${isRTL ? 'flex-row-reverse' : ''} justify-between text-xs`}>
                            <span className="text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{t('confidence')}</span>
                            <span className="text-teal-400 font-bold">
                              {mp.predictions.day1.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('predictions.day7')}</div>
                          <div className="text-2xl font-bold text-white mb-2">
                            {mp.predictions.day7.price.toFixed(2)} SAR
                          </div>
                          <TrendIndicator
                            direction={mp.predictions.day7.change >= 0 ? 'up' : 'down'}
                            value={mp.predictions.day7.change}
                            size="sm"
                          />
                          <div className={`mt-3 flex ${isRTL ? 'flex-row-reverse' : ''} justify-between text-xs`}>
                            <span className="text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{t('confidence')}</span>
                            <span className="text-blue-400 font-bold">
                              {mp.predictions.day7.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('predictions.day30')}</div>
                          <div className="text-2xl font-bold text-white mb-2">
                            {mp.predictions.day30.price.toFixed(2)} SAR
                          </div>
                          <TrendIndicator
                            direction={mp.predictions.day30.change >= 0 ? 'up' : 'down'}
                            value={mp.predictions.day30.change}
                            size="sm"
                          />
                          <div className={`mt-3 flex ${isRTL ? 'flex-row-reverse' : ''} justify-between text-xs`}>
                            <span className="text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{t('confidence')}</span>
                            <span className="text-purple-400 font-bold">
                              {mp.predictions.day30.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3">
                          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                            <span className="text-sm text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>{t('riskLevel')}</span>
                            <Badge variant={mp.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'}>
                              {mp.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3">
                          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                            <span className="text-sm text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>{t('trendDirection')}</span>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {mp.predictions.day30.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-400" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-400" />
                              )}
                              <span
                                className={`text-sm font-bold ${
                                  mp.predictions.day30.change >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              >
                                {mp.predictions.day30.change >= 0 ? t('bullish') : t('bearish')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('recommendation.title')}</h3>
                  <p className="text-gray-400 text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t('recommendation.description', {
                      count: modelPredictions.length,
                      sentiment: modelPredictions.filter(mp => mp.predictions.day30.change > 0).length >
                        modelPredictions.length / 2 ? t('bullish') : t('bearish'),
                      symbol: stock.symbol
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
