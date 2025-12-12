import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection = () => {
  const { t } = useTranslation(['landing']);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = t('landing:testimonials.quotes', { returnObjects: true }) as Array<{
    text: string;
    name: string;
    role: string;
    location: string;
    initials: string;
  }>;

  return (
    <section ref={ref} className="relative py-24 bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-navy-950 to-gray-950" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('landing:testimonials.title')}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            {t('landing:testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-teal-500/10 rounded-2xl blur-xl group-hover:bg-teal-500/20 transition-all" />

              <div className="relative bg-gradient-to-br from-gray-900/50 to-navy-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full group-hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-teal-400/50" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.text}"</p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-400 rounded-full blur-md opacity-30" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center font-bold text-white border-2 border-teal-400/30">
                      {testimonial.initials}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}, {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
