import { Link } from 'react-router-dom';
import { TrendingUp, Search, BarChart3, LogOut, User, Settings, Brain, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card } from '../components';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useRTL } from '../hooks/useRTL';

export const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const { isRTL } = useRTL();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
            <Link to="/" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl text-teal-400 font-bold">◆</span>
              <span className="text-xl font-bold text-white">DAWALLY</span>
            </Link>

            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to="/admin">
                <Button variant="secondary" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Settings className="w-4 h-4" />
                  {t('nav.admin')}
                </Button>
              </Link>
              <LanguageSwitcher />
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700`}>
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{user?.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <LogOut className="w-4 h-4" />
                {t('nav.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('welcome', { name: user?.user_metadata?.full_name || t('defaultName') })}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/search">
            <Card hover className="group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-teal-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl w-16 h-16 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {t('cards.searchStocks.title')}
                </h3>

                <p className="text-gray-400">
                  {t('cards.searchStocks.description')}
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/scanner">
            <Card hover className="group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {t('cards.marketScanner.title')}
                </h3>

                <p className="text-gray-400">
                  {t('cards.marketScanner.description')}
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/compare-models">
            <Card hover className="group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl w-16 h-16 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {t('cards.compareModels.title')}
                </h3>

                <p className="text-gray-400">
                  {t('cards.compareModels.description')}
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/prediction-demo">
            <Card hover className="group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-orange-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl w-16 h-16 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {t('cards.predictionEngine.title')}
                </h3>

                <p className="text-gray-400">
                  {t('cards.predictionEngine.description')}
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">{t('activity.title')}</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <p>{t('activity.empty')}</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-white mb-4">{t('stats.title')}</h3>
            <div className="space-y-4">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                <span className="text-gray-400">{t('stats.accountCreated')}</span>
                <span className="text-white font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('stats.today')}
                </span>
              </div>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                <span className="text-gray-400">{t('stats.predictionsViewed')}</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                <span className="text-gray-400">{t('stats.stocksAnalyzed')}</span>
                <span className="text-white font-semibold">0</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
