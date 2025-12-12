import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  iconGlow: string;
  titleKey: string;
  descriptionKey: string;
  badgeKey: string;
}

export const FeaturesSection = () => {
  const { t } = useTranslation(['landing']);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features: Feature[] = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      iconBg: 'from-teal-500 to-teal-600',
      iconGlow: 'bg-teal-500',
      titleKey: 'landing:features.multiModel.title',
      descriptionKey: 'landing:features.multiModel.description',
      badgeKey: 'landing:features.multiModel.badge',
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      iconBg: 'from-yellow-500 to-yellow-600',
      iconGlow: 'bg-yellow-500',
      titleKey: 'landing:features.confidence.title',
      descriptionKey: 'landing:features.confidence.description',
      badgeKey: 'landing:features.confidence.badge',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      iconBg: 'from-blue-500 to-blue-600',
      iconGlow: 'bg-blue-500',
      titleKey: 'landing:features.scanner.title',
      descriptionKey: 'landing:features.scanner.description',
      badgeKey: 'landing:features.scanner.badge',
    },
  ];

  return (
    <section id="features" ref={ref} className="relative py-24 bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-navy-950 to-gray-950" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('landing:features.title')}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            {t('landing:features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card hover className="h-full group relative overflow-hidden">
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">
                    {t(feature.badgeKey)}
                  </span>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="relative w-16 h-16">
                    <div
                      className={`absolute inset-0 ${feature.iconGlow} rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity`}
                    />
                    <div
                      className={`relative bg-gradient-to-br ${feature.iconBg} rounded-xl w-16 h-16 flex items-center justify-center shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                    {t(feature.titleKey)}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">{t(feature.descriptionKey)}</p>

                  <div className="flex items-center text-teal-400 font-semibold pt-2 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
                    <span>{t('landing:features.learnMore')}</span>
                    <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
