import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LandingFooter = () => {
  const { t } = useTranslation('navigation');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-950 border-t border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-gray-950" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/landing" className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400 blur-xl opacity-50" />
                <div className="relative text-3xl text-teal-400 font-bold">◆</div>
              </div>
              <span className="text-2xl font-bold text-white">DAWALLY</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.predictions')}
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.scanner')}
                </Link>
              </li>
              <li>
                <Link to="/compare-models" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.compareModels')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <span className="text-gray-500">{t('footer.apiAccess')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/investors" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.investors')}
                </Link>
              </li>
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <span className="text-gray-500">{t('footer.careers')}</span>
              </li>
              <li>
                <span className="text-gray-500">{t('footer.blog')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  {t('footer.disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 space-y-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 text-xs leading-relaxed text-center">
              {t('footer.investmentDisclaimer')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright')}
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors group"
            >
              <span className="text-sm">{t('footer.backToTop')}</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-teal-500/20 transition-all">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
