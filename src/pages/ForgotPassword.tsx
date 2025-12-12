import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components';
import { requestPasswordReset } from '../lib/email';
import { useToast } from '../contexts/ToastContext';
import { useRTL } from '../hooks/useRTL';

export const ForgotPassword = () => {
  const { t } = useTranslation('auth');
  const { isRTL } = useRTL();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError(t('forgotPassword.errors.emailRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSubmitted(true);
        success(t('forgotPassword.success'));
      } else {
        showError(result.error || t('forgotPassword.errors.sendFailed'));
      }
    } catch (err) {
      showError(t('forgotPassword.errors.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t('forgotPassword.backToLogin')}
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50" />
              <span className="relative text-5xl text-teal-400 font-bold">◆</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('forgotPassword.title')}</h1>
          <p className="text-gray-400">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                  {t('forgotPassword.emailLabel')}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'end-4' : 'start-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isRTL ? 'pe-12 ps-4' : 'ps-12 pe-4'} py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all`}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t('forgotPassword.emailHelper')}
                </p>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className={`w-4 h-4 ${isRTL ? 'ms-2' : 'me-2'} animate-spin`} />
                    {t('forgotPassword.sending')}
                  </>
                ) : (
                  t('forgotPassword.submitButton')
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {t('forgotPassword.rememberPassword')}{' '}
                  <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
                    {t('forgotPassword.signIn')}
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('forgotPassword.checkEmailTitle')}</h3>
              <p className="text-gray-400 mb-6">
                {t('forgotPassword.checkEmailMessage')} <br />
                <span className="text-teal-400 font-semibold">{email}</span>
              </p>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  {t('forgotPassword.expiryNotice')}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">{t('forgotPassword.didntReceive')}</p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="secondary"
                  className="w-full"
                >
                  {t('forgotPassword.tryAgain')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          {t('forgotPassword.securityNotice')}
        </p>
      </div>
    </div>
  );
};
