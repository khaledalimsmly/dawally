import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useRTL } from '../../hooks/useRTL';
import { useAuth } from '../../contexts/AuthContext';

export const LandingNav = () => {
  const { t } = useTranslation('navigation');
  const { isRTL } = useRTL();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between h-20`}>
          <Link to="/landing" className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} group`}>
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative text-3xl text-teal-400 font-bold">◆</div>
            </div>
            <span className="text-2xl font-bold text-white">DAWALLY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.home')}
            </Link>
            <Link
              to="/search"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.predictions')}
            </Link>
            <Link
              to="/scanner"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.scanner')}
            </Link>
            <Link
              to="/compare-models"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.compareModels')}
            </Link>
            <Link
              to="/docs"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.documentation')}
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
            >
              {t('menu.pricing')}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{displayName}</span>
                </div>
                <Link to="/dashboard">
                  <Button variant="secondary">{t('menu.dashboard')}</Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('menu.signout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">{t('menu.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button className="shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
                    {t('menu.signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link
              to="/"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.home')}
            </Link>
            <Link
              to="/search"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.predictions')}
            </Link>
            <Link
              to="/scanner"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.scanner')}
            </Link>
            <Link
              to="/compare-models"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.compareModels')}
            </Link>
            <Link
              to="/docs"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.documentation')}
            </Link>
            <Link
              to="/pricing"
              className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('menu.pricing')}
            </Link>
            <div className="pt-4 space-y-3">
              <LanguageSwitcher />
              {!loading && user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{displayName}</span>
                  </div>
                  <Link to="/dashboard" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t('menu.dashboard')}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('menu.signout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t('menu.login')}
                    </Button>
                  </Link>
                  <Link to="/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">{t('menu.signup')}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
