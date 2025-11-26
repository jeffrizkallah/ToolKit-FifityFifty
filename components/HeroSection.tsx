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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0041A8] via-[#0063AF] to-[#007BFF] rounded-2xl mx-4 my-8">
      {/* Animated Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Glass Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Dots/Waves Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => {
          const positions = [
            { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 25, top: 60 },
            { left: 70, top: 55 }, { left: 15, top: 80 }, { left: 90, top: 75 },
            { left: 50, top: 40 }, { left: 35, top: 35 }, { left: 65, top: 25 },
            { left: 20, top: 45 }, { left: 80, top: 50 }, { left: 40, top: 70 },
            { left: 75, top: 65 }, { left: 30, top: 10 }, { left: 60, top: 85 },
            { left: 5, top: 30 }, { left: 95, top: 40 }, { left: 45, top: 15 },
            { left: 55, top: 90 }, { left: 12, top: 65 }
          ];
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${positions[i]?.left || 50}%`,
                top: `${positions[i]?.top || 50}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i * 0.2) % 4,
              }}
            />
          );
        })}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Hero Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight max-w-[800px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {headline}
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          className="text-lg md:text-xl lg:text-xl text-white/90 mb-10 max-w-[800px] mx-auto leading-relaxed font-normal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {description}
        </motion.p>

        {/* Single Primary CTA */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            onClick={handleScrollToPhases}
            className="px-10 py-6 text-lg font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full tracking-wide"
          >
            {t('startJourney')}
          </Button>
          {/* Watch Video as Link Below */}
          <button
            onClick={onWatchVideo}
            className="text-white/80 hover:text-white text-sm font-medium underline-offset-4 hover:underline transition-all"
          >
            {t('watchVideo')}
          </button>
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

