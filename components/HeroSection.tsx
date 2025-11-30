'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Play } from 'lucide-react';

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

  // Symmetrical orb positions - 6 orbs in balanced arrangement
  const orbPositions = [
    { left: 10, top: 20, size: 120, delay: 0 },
    { left: 85, top: 25, size: 100, delay: 0.5 },
    { left: 8, top: 70, size: 80, delay: 1 },
    { left: 88, top: 65, size: 90, delay: 1.5 },
    { left: 25, top: 85, size: 60, delay: 2 },
    { left: 75, top: 80, size: 70, delay: 2.5 },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0041A8] via-[#0063AF] to-[#007BFF] rounded-2xl mx-4 my-8">
      {/* Subtle Gradient Glow - Single unified background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Symmetrical Floating Orbs - Reduced to 6 balanced positions */}
      <div className="absolute inset-0 overflow-hidden">
        {orbPositions.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.size,
              height: orb.size,
              filter: 'blur(40px)',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: orb.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        {/* Hero Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-[800px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          {headline.includes(',') ? (
            <>
              {headline.split(',')[0]},<br />
              {headline.split(',').slice(1).join(',')}
            </>
          ) : (
            headline
          )}
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-white/85 max-w-[640px] leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {description}
        </motion.p>

        {/* CTAs - Horizontal layout */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            onClick={handleScrollToPhases}
            className="px-8 py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
          >
            {t('startJourney')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onWatchVideo}
            className="px-8 py-6 text-base font-medium rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('watchVideo')}
          </Button>
        </motion.div>

        {/* Scroll Indicator - Simplified */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <motion.button
            className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            onClick={handleScrollToPhases}
            aria-label="Scroll to content"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Partnership Tagline */}
        <motion.p
          className="mt-10 text-xs text-white/50 max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
        >
          Created by FiftyFifty and UN Women to make political participation more accessible, practical, and achievable for every woman.
        </motion.p>
      </div>
    </section>
  );
}

