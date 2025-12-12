import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Globe, Eye, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface WhyPoint {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

const accuracyData = [
  { month: 'Jan', accuracy: 72 },
  { month: 'Feb', accuracy: 75 },
  { month: 'Mar', accuracy: 78 },
  { month: 'Apr', accuracy: 80 },
  { month: 'May', accuracy: 82 },
  { month: 'Jun', accuracy: 85 },
];

export const WhySection = () => {
  const { t } = useTranslation(['landing']);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const whyPoints: WhyPoint[] = [
    {
      icon: <Cpu className="w-6 h-6 text-teal-400" />,
      titleKey: 'landing:why.multiModelEngine.title',
      descriptionKey: 'landing:why.multiModelEngine.description',
    },
    {
      icon: <Globe className="w-6 h-6 text-teal-400" />,
      titleKey: 'landing:why.tadawulSpecific.title',
      descriptionKey: 'landing:why.tadawulSpecific.description',
    },
    {
      icon: <Eye className="w-6 h-6 text-teal-400" />,
      titleKey: 'landing:why.transparentScoring.title',
      descriptionKey: 'landing:why.transparentScoring.description',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-teal-400" />,
      titleKey: 'landing:why.continuousLearning.title',
      descriptionKey: 'landing:why.continuousLearning.description',
    },
  ];

  return (
    <section id="why-dawally" ref={ref} className="relative py-24 bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-gray-950 to-navy-950" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('landing:why.title')}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('landing:why.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {whyPoints.map((point, index) => (
              <motion.div
                key={point.titleKey}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-lg blur-md group-hover:bg-teal-500/30 transition-all" />
                    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 group-hover:border-teal-500/50 transition-all">
                      {point.icon}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {t(point.titleKey)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{t(point.descriptionKey)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-gray-900/50 to-navy-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-teal-500/5 rounded-2xl blur-xl" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{t('landing:why.chart.title')}</h3>
                  <span className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                    85%
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={accuracyData}>
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} domain={[70, 90]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#D1D5DB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#27D3B8"
                      strokeWidth={3}
                      dot={{ fill: '#27D3B8', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-teal-400">3</div>
                    <div className="text-xs text-gray-400 mt-1">{t('landing:why.chart.aiModels')}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-teal-400">{t('landing:why.chart.daily')}</div>
                    <div className="text-xs text-gray-400 mt-1">{t('landing:why.chart.retraining')}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-teal-400">100%</div>
                    <div className="text-xs text-gray-400 mt-1">{t('landing:why.chart.tadawulFocus')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
