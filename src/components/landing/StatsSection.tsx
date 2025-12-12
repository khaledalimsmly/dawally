import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Stat {
  value: number;
  suffix: string;
  labelKey: string;
}

const Counter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsSection = () => {
  const { t } = useTranslation(['landing']);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats: Stat[] = [
    { value: 91, suffix: '%', labelKey: 'landing:stats.avgAccuracy' },
    { value: 4, suffix: '', labelKey: 'landing:stats.aiModels' },
    { value: 200, suffix: '+', labelKey: 'landing:stats.tadawulStocks' },
    { value: 24, suffix: '/7', labelKey: 'landing:stats.realTimeAnalysis' },
  ];

  return (
    <section ref={ref} className="relative py-20 bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-navy-950 to-gray-950" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-teal-500/10 rounded-2xl blur-xl group-hover:bg-teal-500/20 transition-all" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 group-hover:border-teal-500/50 transition-all">
                  <Counter value={stat.value} suffix={stat.suffix} inView={isInView} />
                </div>
              </div>
              <p className="text-gray-400 text-sm md:text-base font-medium">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
