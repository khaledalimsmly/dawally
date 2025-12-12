import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Brain,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { Card, Badge, Button } from '../components';
import { ModelsComparisonTable } from '../components/ModelsComparisonTable';
import { MOCK_MODELS, getBestModel } from '../lib/mockModelData';
import { getModelTypeLabel, getModelTypeColor } from '../lib/modelService';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useRTL } from '../hooks/useRTL';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const ModelsOverview = () => {
  const { t } = useTranslation('models');
  const { isRTL } = useRTL();
  const bestModel = getBestModel();
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const radarData = [
    {
      metric: t('chart.metrics.accuracy'),
      LSTM: 87,
      Transformer: 91,
      TFT: 89,
      XGBoost: 85,
      Ensemble: 92
    },
    {
      metric: t('chart.metrics.speed'),
      LSTM: 85,
      Transformer: 78,
      TFT: 80,
      XGBoost: 92,
      Ensemble: 75
    },
    {
      metric: t('chart.metrics.confidence'),
      LSTM: 87,
      Transformer: 91,
      TFT: 89,
      XGBoost: 85,
      Ensemble: 92
    },
    {
      metric: t('chart.metrics.riskAdjReturn'),
      LSTM: 82,
      Transformer: 89,
      TFT: 86,
      XGBoost: 81,
      Ensemble: 91
    }
  ];

  const modelColors: Record<string, string> = {
    LSTM: '#14b8a6',
    Transformer: '#3b82f6',
    TFT: '#f59e0b',
    XGBoost: '#10b981',
    Ensemble: '#a855f7'
  };

  const modelIcons: Record<string, React.ReactNode> = {
    lstm: <Brain className="w-8 h-8" />,
    transformer: <Sparkles className="w-8 h-8" />,
    tft: <TrendingUp className="w-8 h-8" />,
    xgboost: <Zap className="w-8 h-8" />,
    ensemble: <Trophy className="w-8 h-8" />
  };

  return (
    <div className="min-h-screen bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <LandingNav />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-center gap-3 mb-4`}>
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full p-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        <Card className="mb-12 bg-gradient-to-r from-yellow-500/10 via-teal-500/10 to-cyan-500/10 border-yellow-500/30 overflow-hidden relative">
          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl`} />
          <div className="relative">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''} mb-6`}>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-5">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
                  <h2 className="text-3xl font-bold text-white">{t('bestModel.title')}</h2>
                  <Badge variant="low" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                    {t('bestModel.badge')}
                  </Badge>
                </div>
                <p className="text-gray-400 text-lg mb-4">
                  {t('bestModel.description')}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-2">{t('bestModel.modelName')}</div>
                <div className="text-2xl font-bold text-white mb-1">{bestModel.name}</div>
                <span className={`text-sm font-medium ${getModelTypeColor(bestModel.type)}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {getModelTypeLabel(bestModel.type)}
                </span>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-2">{t('bestModel.accuracyRate')}</div>
                <div className="text-2xl font-bold text-teal-400 mb-2">{bestModel.accuracy}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${bestModel.accuracy}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-2">{t('bestModel.confidenceRange')}</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {bestModel.confidenceRange.min}-{bestModel.confidenceRange.max}%
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-2">{t('bestModel.riskLevel')}</div>
                <Badge variant="low" className="text-lg px-3 py-1">
                  {bestModel.riskLevel}
                </Badge>
              </div>
            </div>

            <div className={`mt-6 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">{t('bestModel.keyStrength')}</div>
                <p className="text-white">{bestModel.strengths[0]}</p>
              </div>
              <Link to="/search">
                <Button className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} shadow-lg shadow-teal-500/30`}>
                  {t('bestModel.useButton')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="mb-12">
          <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-8 h-8 text-cyan-400" />
            {t('allModels.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MODELS.map((model) => (
              <Card
                key={model.id}
                hover
                className="cursor-pointer group"
                onClick={() =>
                  setExpandedModel(expandedModel === model.id ? null : model.id)
                }
              >
                <div className="space-y-4">
                  <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                        style={{ backgroundColor: modelColors[model.name] }}
                      />
                      <div
                        className="relative rounded-xl p-3 flex items-center justify-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${modelColors[model.name]}, ${modelColors[model.name]}dd)`
                        }}
                      >
                        {modelIcons[model.id]}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getModelTypeColor(model.type)}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {getModelTypeLabel(model.type)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                      {model.name}
                    </h3>
                    <p className="text-gray-400 text-sm" dir={isRTL ? 'rtl' : 'ltr'}>{model.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-2`}>
                        <span className="text-sm text-gray-400">{t('card.accuracy')}</span>
                        <span className="text-lg font-bold text-white">{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${model.accuracy}%`,
                            background: `linear-gradient(90deg, ${modelColors[model.name]}, ${modelColors[model.name]}dd)`
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-1">{t('card.confidence')}</div>
                        <div className="text-sm font-semibold text-white">
                          {model.confidenceRange.min}-{model.confidenceRange.max}%
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-1">{t('card.risk')}</div>
                        <Badge
                          variant={
                            model.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'
                          }
                        >
                          {model.riskLevel}
                        </Badge>
                      </div>
                    </div>

                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={model.historicalAccuracy}>
                          <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke={modelColors[model.name]}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {t('card.accuracyTrend')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">{t('card.strengths')}</div>
                    <div className="flex flex-wrap gap-2">
                      {model.strengths.slice(0, 3).map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-xs text-gray-300"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  {expandedModel === model.id && (
                    <div className="pt-4 border-t border-gray-700 space-y-3 animate-in fade-in duration-300">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">{t('card.useCases')}</div>
                        <ul className="space-y-1">
                          {model.useCases.map((useCase, idx) => (
                            <li key={idx} className={`text-sm text-gray-300 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Target className="w-3 h-3 text-teal-400 flex-shrink-0" />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{t('card.notes')}</div>
                        <p className="text-sm text-gray-300">{model.notes}</p>
                      </div>
                    </div>
                  )}

                  <button
                    className="w-full text-center text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedModel(expandedModel === model.id ? null : model.id);
                    }}
                  >
                    {expandedModel === model.id ? t('card.showLess') : t('card.learnMore')}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Shield className="w-8 h-8 text-blue-400" />
            {t('comparison.performanceTitle')}
          </h2>
          <Card>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar
                  name="LSTM"
                  dataKey="LSTM"
                  stroke={modelColors.LSTM}
                  fill={modelColors.LSTM}
                  fillOpacity={0.2}
                />
                <Radar
                  name="Transformer"
                  dataKey="Transformer"
                  stroke={modelColors.Transformer}
                  fill={modelColors.Transformer}
                  fillOpacity={0.2}
                />
                <Radar
                  name="TFT"
                  dataKey="TFT"
                  stroke={modelColors.TFT}
                  fill={modelColors.TFT}
                  fillOpacity={0.2}
                />
                <Radar
                  name="XGBoost"
                  dataKey="XGBoost"
                  stroke={modelColors.XGBoost}
                  fill={modelColors.XGBoost}
                  fillOpacity={0.2}
                />
                <Radar
                  name="Ensemble"
                  dataKey="Ensemble"
                  stroke={modelColors.Ensemble}
                  fill={modelColors.Ensemble}
                  fillOpacity={0.2}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-8 h-8 text-purple-400" />
            {t('comparison.detailedTitle')}
          </h2>
          <ModelsComparisonTable models={MOCK_MODELS} bestModelId={bestModel.id} />
        </div>

        <Card className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border-teal-500/30">
          <div className={`flex flex-col md:flex-row items-center ${isRTL ? 'md:flex-row-reverse' : ''} justify-between gap-6`}>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('cta.title')}
              </h3>
              <p className="text-gray-400">
                {t('cta.description')}
              </p>
            </div>
            <Link to="/search">
              <Button className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} shadow-lg shadow-teal-500/30 whitespace-nowrap`}>
                {t('cta.button')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      </div>
      <LandingFooter />
    </div>
  );
};
