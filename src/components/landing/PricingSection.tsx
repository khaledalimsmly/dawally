import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

const features = [
  'Unlimited stock predictions',
  'All timeframes (1D, 7D, 30D)',
  'Confidence scores & risk analysis',
  'AI Market Scanner access',
  'Real-time data updates',
  'Email alerts & notifications',
];

export const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" ref={ref} className="relative py-24 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-gray-950 to-gray-950" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start Free. Scale When Ready.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

            <div className="relative bg-gradient-to-br from-gray-900/80 to-navy-900/80 backdrop-blur-sm border-2 border-teal-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-teal-400">MVP Access</span>
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Free During Beta</h3>
                <p className="text-gray-400">Full access to all features</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/signup" className="block">
                <Button className="w-full text-lg py-4 shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all">
                  Get Started Free
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Button>
              </Link>

              <p className="text-center text-sm text-gray-500 mt-6">
                Paid plans coming Q2 2025 with advanced features
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Trading?</h3>
            <p className="text-gray-400 text-lg mb-6">
              Join hundreds of investors using AI to trade smarter in the Saudi market
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
