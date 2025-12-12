import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { InvestorCTA } from '../components/landing/InvestorCTA';
import { WhySection } from '../components/landing/WhySection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useRTL } from '../hooks/useRTL';

export const Landing = () => {
  const { isRTL } = useRTL();

  return (
    <div className="min-h-screen bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <InvestorCTA />
      <WhySection />
      <TestimonialsSection />
      <PricingSection />
      <LandingFooter />
    </div>
  );
};
