'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  headline: string;
  description: string;
  onWatchVideo: () => void;
}

export function HeroSection({ headline, description, onWatchVideo }: HeroSectionProps) {
  const t = useTranslations('HomePage.hero');

  const handleScrollToPhases = () => {
    const phasesSection = document.getElementById('phases-timeline');
    if (phasesSection) {
      phasesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0063AF] via-[#004a8a] to-[#003d73] rounded-3xl mx-4 my-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Hero Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {headline}
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            onClick={handleScrollToPhases}
            className="bg-white text-red-600 hover:bg-red-50 px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:scale-105"
          >
            {t('startJourney')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onWatchVideo}
            className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-6 text-lg font-semibold transition-all hover:scale-105"
          >
            {t('watchVideo')}
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-block cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={handleScrollToPhases}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>

        {/* Partnership Tagline */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
        >
          <p className="text-sm text-blue-100 text-center">
            Created by FiftyFifty and UN Women to make political participation more accessible, practical, and achievable for every woman.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

