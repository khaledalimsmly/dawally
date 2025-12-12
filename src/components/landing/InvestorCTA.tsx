import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Terminal, Building2, ArrowRight, TrendingUp, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Card } from '../Card';

export const InvestorCTA = () => {
  const { t } = useTranslation(['landing']);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-gray-950 to-navy-950" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('landing:cta.title')}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            {t('landing:cta.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full relative overflow-hidden group hover:shadow-2xl hover:shadow-teal-500/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all" />

              <div className="relative space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-teal-500 rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <Terminal className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {t('landing:cta.explore.title')}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {t('landing:cta.explore.description')}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    <span>{t('landing:cta.explore.liveData')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>{t('landing:cta.explore.freeAccess')}</span>
                  </div>
                </div>

                <Link to="/search" className="block">
                  <Button className="w-full text-lg py-4 group-hover:scale-[1.02] transition-transform">
                    {t('landing:cta.explore.button')}
                    <ArrowRight className="inline-block ms-2 w-5 h-5 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />

              <div className="relative space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {t('landing:cta.enterprise.title')}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {t('landing:cta.enterprise.description')}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>{t('landing:cta.enterprise.customIntegration')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>{t('landing:cta.enterprise.dedicatedSupport')}</span>
                  </div>
                </div>

                <Link to="/signup" className="block">
                  <Button variant="secondary" className="w-full text-lg py-4 group-hover:scale-[1.02] transition-transform">
                    {t('landing:cta.enterprise.button')}
                    <ArrowRight className="inline-block ms-2 w-5 h-5 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
