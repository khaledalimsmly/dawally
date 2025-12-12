import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components';
import { validateResetToken, resetPassword } from '../lib/email';
import { useToast } from '../contexts/ToastContext';
import { useRTL } from '../hooks/useRTL';

export const ResetPassword = () => {
  const { t } = useTranslation('auth');
  const { isRTL } = useRTL();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationError(t('resetPassword.errors.invalidLink'));
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(token);

        if (result.valid) {
          setIsValid(true);
        } else {
          setValidationError(result.error || t('resetPassword.errors.invalidOrExpired'));
        }
      } catch (err) {
        setValidationError(t('resetPassword.errors.validationFailed'));
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, t]);

  const validatePasswords = (): boolean => {
    if (newPassword.length < 6) {
      setPasswordError(t('resetPassword.errors.passwordTooShort'));
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('resetPassword.errors.passwordMismatch'));
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords() || !token) return;

    setIsLoading(true);

    try {
      const result = await resetPassword(token, newPassword);

      if (result.success) {
        setResetSuccess(true);
        success(t('resetPassword.success'));

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        showError(result.error || t('resetPassword.errors.resetFailed'));
      }
    } catch (err) {
      showError(t('resetPassword.errors.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): {
    strength: number;
    label: string;
    color: string;
  } => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: t('resetPassword.passwordStrength.weak'), color: 'bg-red-500' };
    if (password.length < 10) return { strength: 50, label: t('resetPassword.passwordStrength.fair'), color: 'bg-yellow-500' };
    if (password.length < 14) return { strength: 75, label: t('resetPassword.passwordStrength.good'), color: 'bg-blue-500' };
    return { strength: 100, label: t('resetPassword.passwordStrength.strong'), color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('resetPassword.validating')}</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-500/20">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('resetPassword.invalidTitle')}</h1>
            <p className="text-gray-400">{validationError}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-300">
                  {t('resetPassword.expiryInfo')}
                </p>
              </div>

              <Link to="/forgot-password" className="block">
                <Button className="w-full">{t('resetPassword.requestNewLink')}</Button>
              </Link>

              <Link to="/login" className="block">
                <Button variant="secondary" className="w-full">
                  {t('resetPassword.backToLogin')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('resetPassword.successTitle')}</h1>
            <p className="text-gray-400">{t('resetPassword.successMessage')}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl text-center">
            <p className="text-gray-300 mb-6">{t('resetPassword.canSignIn')}</p>
            <p className="text-sm text-gray-500">{t('resetPassword.redirecting')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50" />
              <span className="relative text-5xl text-teal-400 font-bold">◆</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('resetPassword.title')}</h1>
          <p className="text-gray-400">{t('resetPassword.subtitle')}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                {t('resetPassword.newPassword')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'end-4' : 'start-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full ${isRTL ? 'pe-12 ps-4' : 'ps-12 pe-4'} py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all`}
                  placeholder={t('resetPassword.newPasswordPlaceholder')}
                  required
                  minLength={6}
                />
              </div>

              {newPassword && (
                <div className="mt-2">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between text-xs mb-1`}>
                    <span className="text-gray-500">{t('resetPassword.passwordStrength.label')}</span>
                    <span className={`font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                {t('resetPassword.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'end-4' : 'start-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full ${isRTL ? 'pe-12 ps-4' : 'ps-12 pe-4'} py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all`}
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {passwordError}
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-xs text-blue-300 mb-2 font-semibold">{t('resetPassword.requirements.title')}</p>
              <ul className={`text-xs text-blue-200 space-y-1 ${isRTL ? 'list-disc-rtl' : ''}`}>
                <li>{t('resetPassword.requirements.minLength')}</li>
                <li>{t('resetPassword.requirements.complexity')}</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLoading ? (
                <>
                  <Loader className={`w-4 h-4 ${isRTL ? 'ms-2' : 'me-2'} animate-spin`} />
                  {t('resetPassword.resetting')}
                </>
              ) : (
                t('resetPassword.submitButton')
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-teal-400 hover:text-teal-300">
            {t('resetPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};
