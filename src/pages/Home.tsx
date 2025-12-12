import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Sparkles, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../components';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

export const Home = () => {
  const { t } = useTranslation('home');

  return (
    <div className="min-h-screen bg-gray-950">
      <LandingNav />
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50 animate-pulse" />
                <div className="relative text-7xl text-teal-400 font-bold">◆</div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
                {t('hero.title')}
              </span>
            </h1>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('hero.subtitle')}
              <span className="block mt-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                {t('hero.subtitleHighlight')}
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link to="/search">
                <Button className="group">
                  {t('hero.viewPredictions')}
                  <ArrowRight className="inline-block ms-2 w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary">
                  {t('hero.createAccount')}
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <span>{t('hero.securePlatform')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>{t('hero.aiPowered')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <span>{t('hero.realTimeData')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card hover className="group">
            <div className="space-y-4">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-teal-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl w-16 h-16 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                {t('features.prediction.title')}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {t('features.prediction.description')}
              </p>

              <div className="flex items-center text-teal-400 font-semibold pt-4">
                <span>{t('features.prediction.badge')}</span>
                <ArrowRight className="ms-2 w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </div>
            </div>
          </Card>

          <Card hover className="group">
            <div className="space-y-4">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl w-16 h-16 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                {t('features.confidence.title')}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {t('features.confidence.description')}
              </p>

              <div className="flex items-center text-teal-400 font-semibold pt-4">
                <span>{t('features.confidence.badge')}</span>
                <ArrowRight className="ms-2 w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </div>
            </div>
          </Card>

          <Card hover className="group">
            <div className="space-y-4">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                {t('features.scanner.title')}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {t('features.scanner.description')}
              </p>

              <Link to="/scanner" className="flex items-center text-teal-400 font-semibold pt-4 hover:text-teal-300 transition-colors">
                <span>{t('features.scanner.badge')}</span>
                <ArrowRight className="ms-2 w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="relative px-8 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {t('cta.title')}
              </h2>

              <p className="text-xl text-gray-300">
                {t('cta.description')}
              </p>

              <div className="pt-6">
                <Link to="/signup">
                  <Button className="text-lg px-8 py-4">
                    {t('cta.button')}
                    <ArrowRight className="inline-block ms-2 w-5 h-5 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-400">
                {t('cta.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};
