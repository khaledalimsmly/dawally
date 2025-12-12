import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, TrendingUp, Zap, Crown, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Button } from '../components/Button';
import { useRTL } from '../hooks/useRTL';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  cta: string;
  ctaVariant?: 'primary' | 'secondary';
}

export const Pricing = () => {
  const { t } = useTranslation('pricing');
  const { isRTL } = useRTL();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: t('tiers.free.name'),
      icon: <TrendingUp className="w-6 h-6" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: t('tiers.free.description'),
      features: [
        { name: t('tiers.free.features.predictions'), included: true },
        { name: t('tiers.free.features.charts'), included: true },
        { name: t('tiers.free.features.support'), included: true },
        { name: t('tiers.free.features.scanner'), included: false },
        { name: t('tiers.free.features.alerts'), included: false },
        { name: t('tiers.free.features.analytics'), included: false },
        { name: t('tiers.free.features.api'), included: false },
        { name: t('tiers.free.features.prioritySupport'), included: false },
      ],
      cta: t('tiers.free.cta'),
      ctaVariant: 'secondary',
    },
    {
      id: 'standard',
      name: t('tiers.standard.name'),
      icon: <Zap className="w-6 h-6" />,
      monthlyPrice: 199,
      yearlyPrice: 1910,
      description: t('tiers.standard.description'),
      features: [
        { name: t('tiers.standard.features.predictions'), included: true },
        { name: t('tiers.standard.features.charts'), included: true },
        { name: t('tiers.standard.features.scanner'), included: true },
        { name: t('tiers.standard.features.alerts'), included: true },
        { name: t('tiers.standard.features.support'), included: true },
        { name: t('tiers.standard.features.analytics'), included: false },
        { name: t('tiers.standard.features.api'), included: false },
        { name: t('tiers.standard.features.prioritySupport'), included: false },
      ],
      cta: t('tiers.standard.cta'),
    },
    {
      id: 'pro',
      name: t('tiers.pro.name'),
      icon: <Crown className="w-6 h-6" />,
      monthlyPrice: 499,
      yearlyPrice: 4790,
      description: t('tiers.pro.description'),
      features: [
        { name: t('tiers.pro.features.predictions'), included: true },
        { name: t('tiers.pro.features.charts'), included: true },
        { name: t('tiers.pro.features.scanner'), included: true },
        { name: t('tiers.pro.features.alerts'), included: true },
        { name: t('tiers.pro.features.analytics'), included: true },
        { name: t('tiers.pro.features.comparison'), included: true },
        { name: t('tiers.pro.features.support'), included: true },
        { name: t('tiers.pro.features.api'), included: false },
      ],
      popular: true,
      cta: t('tiers.pro.cta'),
    },
    {
      id: 'enterprise',
      name: t('tiers.enterprise.name'),
      icon: <Building2 className="w-6 h-6" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: t('tiers.enterprise.description'),
      features: [
        { name: t('tiers.enterprise.features.everything'), included: true },
        { name: t('tiers.enterprise.features.api'), included: true },
        { name: t('tiers.enterprise.features.training'), included: true },
        { name: t('tiers.enterprise.features.manager'), included: true },
        { name: t('tiers.enterprise.features.whiteLabel'), included: true },
        { name: t('tiers.enterprise.features.integrations'), included: true },
        { name: t('tiers.enterprise.features.phone'), included: true },
        { name: t('tiers.enterprise.features.sla'), included: true },
      ],
      cta: t('tiers.enterprise.cta'),
      ctaVariant: 'secondary',
    },
  ];

  const formatPrice = (tier: PricingTier) => {
    if (tier.id === 'enterprise') {
      return t('tiers.enterprise.price');
    }
    if (tier.monthlyPrice === 0) {
      return t('tiers.free.price');
    }
    const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    const currency = isRTL ? 'ر.س' : 'SAR';
    return isRTL ? `${currency} ${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  };

  const getPriceSubtext = (tier: PricingTier) => {
    if (tier.id === 'enterprise') {
      return t('tiers.enterprise.period');
    }
    if (tier.monthlyPrice === 0) {
      return t('tiers.free.period');
    }
    return billingCycle === 'monthly' ? t('billing.monthPeriod', { defaultValue: '/month' }) : t('billing.yearPeriod', { defaultValue: '/year' });
  };

  const getCtaLink = (tier: PricingTier) => {
    if (tier.id === 'enterprise') {
      return '/signup?plan=enterprise';
    }
    return `/signup?plan=${tier.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-navy-950 to-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <LandingNav />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-4 h-4" />
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              {t('hero.subtitle')}
            </p>

            <div className="inline-flex items-center gap-4 p-2 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('billing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('billing.yearly')}
                <span className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg`}>
                  {t('billing.savePercent')}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`relative group ${
                  tier.popular ? 'lg:-mt-4 lg:mb-4' : ''
                }`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-teal-500/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Crown className="w-4 h-4" />
                      {t('tiers.pro.badge')}
                    </span>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl p-8 transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-b from-teal-950/50 to-gray-900/50 border-2 border-teal-500/50 shadow-2xl shadow-teal-500/20'
                      : 'bg-gray-900/30 border border-gray-800/50 hover:border-gray-700/50'
                  } backdrop-blur-sm group-hover:transform group-hover:scale-105 group-hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative">
                    <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} mb-6`}>
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${
                        tier.popular
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30'
                          : 'bg-gray-800 border border-gray-700'
                      }`}>
                        <div className={tier.popular ? 'text-white' : 'text-gray-400'}>
                          {tier.icon}
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-2xl font-bold text-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{tier.name}</h3>
                    <p className={`text-gray-400 text-sm mb-6 min-h-[40px] ${isRTL ? 'text-right' : 'text-left'}`}>{tier.description}</p>

                    <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-baseline gap-2 mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-4xl font-bold text-white">
                          {formatPrice(tier)}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {getPriceSubtext(tier)}
                      </span>
                    </div>

                    <Link to={getCtaLink(tier)} className="block mb-8">
                      <Button
                        className={`w-full ${
                          tier.popular
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30'
                            : tier.ctaVariant === 'secondary'
                            ? ''
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                        variant={tier.ctaVariant}
                      >
                        {tier.cta}
                      </Button>
                    </Link>

                    <div className="space-y-4">
                      {tier.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            feature.included
                              ? 'bg-teal-500/20 text-teal-400'
                              : 'bg-gray-800 text-gray-600'
                          }`}>
                            {feature.included ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </div>
                          <span className={`flex-1 text-sm ${
                            feature.included ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/20 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('notSure.title')}
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                {t('notSure.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup?plan=free">
                  <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30">
                    {t('notSure.startTrial')}
                  </Button>
                </Link>
                <Link to="/signup?plan=enterprise">
                  <Button variant="secondary">
                    {t('notSure.contactSales')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t('faq.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {t('faq.changePlans.question')}
                </h3>
                <p className="text-gray-400">
                  {t('faq.changePlans.answer')}
                </p>
              </div>
              <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {t('faq.payment.question')}
                </h3>
                <p className="text-gray-400">
                  {t('faq.payment.answer')}
                </p>
              </div>
              <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {t('faq.trial.question')}
                </h3>
                <p className="text-gray-400">
                  {t('faq.trial.answer')}
                </p>
              </div>
              <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {t('faq.refund.question')}
                </h3>
                <p className="text-gray-400">
                  {t('faq.refund.answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
