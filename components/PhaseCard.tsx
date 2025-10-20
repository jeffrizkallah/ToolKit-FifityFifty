'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { analytics } from '@/components/GoogleAnalytics';

interface PhaseCardProps {
  phaseNumber: number;
  title: string;
  description: string;
  slug: string;
  locale: string;
  index: number;
}

export function PhaseCard({ phaseNumber, title, description, slug, locale, index }: PhaseCardProps) {
  // Strip HTML tags from description for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  const handlePhaseClick = () => {
    // Track phase navigation
    analytics.trackPhaseNavigate(phaseNumber, title, slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/${locale}/phase/${slug}`} onClick={handlePhaseClick}>
        <Card className="group relative h-full p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500 bg-white overflow-hidden">
          {/* Phase Number Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-16 h-16 flex items-center justify-center font-bold text-2xl rounded-bl-3xl">
            {phaseNumber}
          </div>

          {/* Card Content */}
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors pr-16">
              {title}
            </h3>
            <p className="text-gray-600 line-clamp-4">
              {stripHtml(description)}
            </p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
            initial={false}
          />

          {/* Arrow Icon */}
          <div className="mt-4 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
            <span className="text-sm">
              {locale === 'ar' ? 'استكشف المزيد' : 'Explore More'}
            </span>
            <svg
              className={`w-4 h-4 ${locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

