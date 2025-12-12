import { Link } from 'react-router-dom';
import { Users, Building2, Landmark, Network, Code, TrendingUp, Brain, Layers, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Card } from '../components/Card';
import { useRTL } from '../hooks/useRTL';

export const Docs = () => {
  const { t } = useTranslation('docs');
  const { isRTL } = useRTL();

  return (
    <div className="min-h-screen bg-gray-950">
      <LandingNav />

      <div className="pt-32 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-400">
                {t('subtitle')}
              </p>
            </div>

            <div className="space-y-20">
              <section>
                <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                  {t('whatIsDawally.title')}
                </h2>
                <div className={`prose prose-lg prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-lg text-gray-300 leading-relaxed mb-4">
                    {t('whatIsDawally.paragraph1')}
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {t('whatIsDawally.paragraph2')}
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-800" />

              <section>
                <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                  <Brain className="w-8 h-8 text-teal-400" />
                  {t('howPredictions.title')}
                </h2>
                <div className="space-y-6">
                  <p className={`text-lg text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('howPredictions.intro')}
                  </p>

                  <Card className="bg-gray-900/50 border-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {!isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">1</span>
                          </div>
                        )}
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <h3 className="text-xl font-semibold text-white mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('howPredictions.steps.step1.title')}</h3>
                          <p className="text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
                            {t('howPredictions.steps.step1.description')}
                          </p>
                        </div>
                        {isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">1</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        {!isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">2</span>
                          </div>
                        )}
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <h3 className="text-xl font-semibold text-white mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('howPredictions.steps.step2.title')}</h3>
                          <p className="text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
                            {t('howPredictions.steps.step2.description')}
                          </p>
                        </div>
                        {isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">2</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        {!isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">3</span>
                          </div>
                        )}
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <h3 className="text-xl font-semibold text-white mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('howPredictions.steps.step3.title')}</h3>
                          <p className="text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
                            {t('howPredictions.steps.step3.description')}
                          </p>
                        </div>
                        {isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">3</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        {!isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">4</span>
                          </div>
                        )}
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <h3 className="text-xl font-semibold text-white mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('howPredictions.steps.step4.title')}</h3>
                          <p className="text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
                            {t('howPredictions.steps.step4.description')}
                          </p>
                        </div>
                        {isRTL && (
                          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-teal-400 font-bold">4</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <div className={`bg-gray-900/30 border border-teal-500/20 rounded-xl p-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <p className="text-gray-300 leading-relaxed">
                      <span className="text-teal-400 font-semibold">{t('howPredictions.result.label')}</span> {t('howPredictions.result.text')}
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-800" />

              <section>
                <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                  <Layers className="w-8 h-8 text-teal-400" />
                  {t('multiModel.title')}
                </h2>
                <div className="space-y-6">
                  <p className={`text-lg text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('multiModel.intro')}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className={`bg-gray-900/50 border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <h3 className="text-xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.diversity.title')}</h3>
                      <p className="text-gray-400 mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('multiModel.diversity.subtitle')}
                      </p>
                      <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.diversity.deepLearning')}</span>
                        </li>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.diversity.gradientBoosting')}</span>
                        </li>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.diversity.timeSeries')}</span>
                        </li>
                      </ul>
                    </Card>

                    <Card className={`bg-gray-900/50 border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <h3 className="text-xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.adaptive.title')}</h3>
                      <p className="text-gray-400 mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                        {t('multiModel.adaptive.subtitle')}
                      </p>
                      <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.adaptive.performance')}</span>
                        </li>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.adaptive.marketRegime')}</span>
                        </li>
                        <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('multiModel.adaptive.confidence')}</span>
                        </li>
                      </ul>
                    </Card>
                  </div>

                  <p className={`text-lg text-gray-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('multiModel.conclusion')}
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-800" />

              <section>
                <h2 className={`text-3xl font-bold text-white mb-6 w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('useCases.title')}
                </h2>
                <div className="space-y-8">
                  <Card className={`bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-teal-400" />
                      </div>
                      <div className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
                        <h3 className="text-2xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2c.title')}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                          {t('useCases.b2c.description')}
                        </p>
                        <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-teal-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2c.features.predictions')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-teal-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2c.features.confidence')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-teal-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2c.features.scanner')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-teal-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2c.features.mobile')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className={`bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
                        <h3 className="text-2xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b.title')}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                          {t('useCases.b2b.description')}
                        </p>
                        <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-blue-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b.features.api')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-blue-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b.features.bulk')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-blue-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b.features.custom')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-blue-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b.features.sla')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className={`bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Landmark className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
                        <h3 className="text-2xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2g.title')}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                          {t('useCases.b2g.description')}
                        </p>
                        <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-purple-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2g.features.risk')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-purple-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2g.features.anomaly')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-purple-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2g.features.predictive')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-purple-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2g.features.deployment')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className={`bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Network className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
                        <h3 className="text-2xl font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b2c.title')}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                          {t('useCases.b2b2c.description')}
                        </p>
                        <ul className={`space-y-2 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-orange-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b2c.features.branding')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-orange-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b2c.features.widgets')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-orange-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b2c.features.revenue')}</span>
                          </li>
                          <li className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <ArrowRight className={`w-4 h-4 text-orange-400 mt-1 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('useCases.b2b2c.features.support')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              <div className="border-t border-gray-800" />

              <section>
                <h2 className={`text-3xl font-bold text-white mb-6 flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                  <Code className="w-8 h-8 text-teal-400" />
                  {t('api.title')}
                </h2>
                <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 ${isRTL ? 'text-right' : 'text-center'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className={`py-8 ${isRTL ? 'text-right' : 'text-center'}`}>
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                      <Code className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('api.comingSoon')}</h3>
                    <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
                      {t('api.description')}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg border border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-400">{t('api.interested')}</span>
                      <Link to="/landing" className="text-teal-400 hover:text-teal-300 font-medium">
                        {t('api.contact')}
                      </Link>
                    </div>
                  </div>
                </Card>

                <div className={`mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <h4 className="text-lg font-semibold text-white mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.title')}</h4>
                  <div className={`grid md:grid-cols-2 gap-4 text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.rest')}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.websocket')}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.oauth')}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.rateLimit')}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.sdks')}</span>
                    </div>
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('api.plannedFeatures.docs')}</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-12 text-center">
                <Link to="/signup">
                  <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all">
                    {t('cta')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};
