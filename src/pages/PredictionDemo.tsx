import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Brain, TrendingUp, ArrowLeft, Sparkles, Loader, Zap } from 'lucide-react';
import { Button, Card } from '../components';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { saudiStocks } from '../data/stocks';
import { generatePrediction } from '../utils/predictionHelpers';
import { PredictionOutput } from '../types/prediction';
import { getPredictionEngine, predictionEngineFactory, generatePerfectChartData } from '../lib/predictionEngine';
import { useDemoMode } from '../contexts/DemoModeContext';
import { useRTL } from '../hooks/useRTL';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const PredictionDemo = () => {
  const { t } = useTranslation('demo');
  const { isRTL } = useRTL();
  const [selectedStock, setSelectedStock] = useState('');
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  useEffect(() => {
    predictionEngineFactory.setDemoMode(isDemoMode);
  }, [isDemoMode]);

  const engine = getPredictionEngine();
  const modelInfo = engine.getModelInfo();

  const handlePredict = async () => {
    if (!selectedStock) return;

    setLoading(true);
    setPrediction(null);

    const stock = saudiStocks.find(s => s.symbol === selectedStock);
    if (stock) {
      try {
        const result = await generatePrediction(stock);
        setPrediction(result);
      } catch (error) {
        console.error('Prediction error:', error);
      }
    }

    setLoading(false);
  };

  const chartData = prediction && isDemoMode
    ? generatePerfectChartData(prediction.currentPrice, 30).map(d => ({
        date: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: d.price
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
          <Link to="/dashboard" className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-teal-400 hover:text-teal-300 transition-colors`}>
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('backToDashboard')}
          </Link>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
                isDemoMode
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Zap className={`w-4 h-4 ${isDemoMode ? 'animate-pulse' : ''}`} />
              {isDemoMode ? t('demoMode.active') : t('demoMode.enable')}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className={`text-4xl font-bold text-white mb-2 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Brain className="w-10 h-10 text-teal-400" />
            {t('title')}
          </h1>
          <p className="text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {isDemoMode && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg animate-pulse">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">{t('demoMode.banner.title')}</p>
                <p className="text-sm text-yellow-200/80">
                  {t('demoMode.banner.description')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={isDemoMode ? 'ring-2 ring-yellow-500/50' : ''}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-white">{t('status.title')}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                <span className="text-gray-400">{t('status.name')}:</span>
                <span className="text-white text-xs">{modelInfo.name}</span>
              </div>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                <span className="text-gray-400">{t('status.version')}:</span>
                <span className="text-white">{modelInfo.version}</span>
              </div>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                <span className="text-gray-400">{t('status.type')}:</span>
                <span className="text-teal-400 uppercase">{modelInfo.type}</span>
              </div>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                <span className="text-gray-400">{t('status.status')}:</span>
                <span className={`${modelInfo.status === 'ready' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {modelInfo.status}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">{t('features.title')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                {t('features.multiTimeframe')}
              </li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                {t('features.confidenceScoring')}
              </li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                {t('features.riskAssessment')}
              </li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                {t('features.sentimentAnalysis')}
              </li>
            </ul>
          </Card>

          <Card>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} mb-2`}>
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">{t('ready.title')}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {t('ready.description')}
            </p>
          </Card>
        </div>

        <Card className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">{t('generate.title')}</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('generate.selectStock')}
              </label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
              >
                <option value="">{t('generate.chooseStock')}</option>
                {saudiStocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name} ({stock.sector})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handlePredict}
                disabled={!selectedStock || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                    {t('generate.generating')}
                  </>
                ) : (
                  <>
                    <Brain className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('generate.button')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {prediction && (
          <div className="space-y-6">
            <Card className={isDemoMode ? 'animate-slideIn' : ''}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-6`}>
                <div>
                  <h3 className="text-2xl font-bold text-white">{prediction.stockSymbol}</h3>
                  <p className="text-gray-400">{t('results.currentPrice')}: {prediction.currentPrice.toFixed(2)} SAR</p>
                </div>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-sm text-gray-400 mb-1">{t('results.overallConfidence')}</p>
                  <div className={`text-3xl font-bold text-teal-400 ${isDemoMode ? 'animate-pulse' : ''}`}>
                    {prediction.confidenceScore}%
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700 ${isDemoMode ? 'animate-fadeIn' : ''}`} style={{ animationDelay: '0.1s' }}>
                  <p className="text-xs text-gray-400 mb-2">{t('results.riskLevel')}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    prediction.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                    prediction.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {prediction.riskLevel}
                  </span>
                </div>

                <div className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700 ${isDemoMode ? 'animate-fadeIn' : ''}`} style={{ animationDelay: '0.2s' }}>
                  <p className="text-xs text-gray-400 mb-2">{t('results.sentiment')}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    prediction.sentimentDirection === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                    prediction.sentimentDirection === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {prediction.sentimentDirection}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{t('results.score')}: {prediction.sentimentScore.toFixed(2)}</p>
                </div>

                <div className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700 ${isDemoMode ? 'animate-fadeIn' : ''}`} style={{ animationDelay: '0.3s' }}>
                  <p className="text-xs text-gray-400 mb-2">{t('results.marketCondition')}</p>
                  <p className="text-sm text-white font-semibold">{prediction.metadata?.marketCondition}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <TimeframePrediction
                  label={t('results.timeframes.oneDay')}
                  timeframe={prediction.timeframes.oneDay}
                  isDemoMode={isDemoMode}
                  delay={0.4}
                  isRTL={isRTL}
                />
                <TimeframePrediction
                  label={t('results.timeframes.sevenDay')}
                  timeframe={prediction.timeframes.sevenDay}
                  isDemoMode={isDemoMode}
                  delay={0.5}
                  isRTL={isRTL}
                />
                <TimeframePrediction
                  label={t('results.timeframes.thirtyDay')}
                  timeframe={prediction.timeframes.thirtyDay}
                  isDemoMode={isDemoMode}
                  delay={0.6}
                  isRTL={isRTL}
                />
              </div>
            </Card>

            {isDemoMode && chartData.length > 0 && (
              <Card className="animate-slideUp">
                <h3 className="text-xl font-bold text-white mb-4">{t('chart.title')}</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#14B8A6"
                        strokeWidth={3}
                        dot={false}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {t('chart.description')}
                </p>
              </Card>
            )}

            {prediction.metadata?.keyFactors && prediction.metadata.keyFactors.length > 0 && (
              <Card className={isDemoMode ? 'animate-fadeIn' : ''}>
                <h3 className="text-xl font-bold text-white mb-4">{t('keyFactors.title')}</h3>
                <ul className="space-y-2">
                  {prediction.metadata.keyFactors.map((factor, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-gray-300 ${isDemoMode ? 'animate-slideIn' : ''}`}
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2"></span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TimeframePrediction = ({
  label,
  timeframe,
  isDemoMode,
  delay,
  isRTL
}: {
  label: string;
  timeframe: any;
  isDemoMode: boolean;
  delay: number;
  isRTL: boolean;
}) => {
  const { t } = useTranslation('demo');

  return (
    <div
      className={`p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 ${isDemoMode ? 'animate-fadeIn' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <h4 className="text-sm font-semibold text-gray-400 mb-3">{label}</h4>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">{t('timeframe.predictedPrice')}</p>
        <p className="text-2xl font-bold text-white">{timeframe.predictedPrice.toFixed(2)} SAR</p>
      </div>

      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between mb-3`}>
        <div>
          <p className="text-xs text-gray-500 mb-1">{t('timeframe.change')}</p>
          <p className={`text-lg font-semibold ${
            timeframe.changePercent > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {timeframe.changePercent > 0 ? '+' : ''}{timeframe.changePercent.toFixed(2)}%
          </p>
        </div>
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <p className="text-xs text-gray-500 mb-1">{t('timeframe.direction')}</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            timeframe.direction === 'Up' ? 'bg-emerald-500/20 text-emerald-400' :
            timeframe.direction === 'Down' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {timeframe.direction}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
          <span className="text-xs text-gray-500">{t('timeframe.confidence')}</span>
          <span className="text-sm font-semibold text-teal-400">{timeframe.confidence}%</span>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`bg-teal-400 h-1.5 rounded-full transition-all ${isDemoMode ? 'animate-progress' : ''}`}
            style={{ width: `${timeframe.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
