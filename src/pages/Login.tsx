import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useRTL } from '../hooks/useRTL';

export const Login = () => {
  const { t } = useTranslation('auth');
  const { isRTL } = useRTL();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.errorFailed'));
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50 animate-pulse" />
            <span className="relative text-7xl text-teal-400 font-bold animate-pulse">◆</span>
          </div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50" />
              <span className="relative text-5xl text-teal-400 font-bold">◆</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('login.title')}</h1>
          <p className="text-gray-400">{t('login.subtitle')}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                  {t('login.passwordLabel')}
                </label>
                <Link to="/forgot-password" className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                placeholder={t('login.passwordPlaceholder')}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('login.signInButton')}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-800/50 text-gray-400">{t('login.newToApp')}</span>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            {t('login.noAccount')}{' '}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-semibold">
              {t('login.createAccount')}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          {t('login.termsText')}
        </p>
      </div>
    </div>
  );
};
