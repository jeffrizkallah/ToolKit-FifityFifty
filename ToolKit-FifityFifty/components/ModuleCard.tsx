'use client';

/**
 * ModuleCard Component
 * 
 * Displays an individual module card with title, summary, and optional video indicator.
 * Used on phase detail pages to show all modules within a phase.
 */

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { PlayCircle, FileText } from 'lucide-react';
import { Module } from '@/lib/types/cms';
import { analytics } from '@/components/GoogleAnalytics';

interface ModuleCardProps {
  module: Module;
  locale: string;
  index: number;
  phaseSlug: string;
}

export function ModuleCard({ module, locale, index, phaseSlug }: ModuleCardProps) {
  const { title, summary, video_url, slug } = module.attributes;
  
  // Strip HTML tags from summary for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
  };

  const handleModuleClick = () => {
    // Track module access
    analytics.trackModuleAccess(title, slug, phaseSlug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/${locale}/phase/${phaseSlug}/module/${slug}`} onClick={handleModuleClick}>
        <Card className="group relative h-full p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-[#0063AF] bg-white">
          {/* Video Indicator */}
          {video_url && (
            <div className="absolute top-4 end-4">
              <PlayCircle className="h-6 w-6 text-[#EC1C24] group-hover:scale-110 transition-transform" />
            </div>
          )}

          {/* Card Content */}
          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-[#0063AF]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#0063AF] transition-colors flex-1 pe-8">
                {title}
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3">
              {stripHtml(summary)}
            </p>
          </div>

          {/* Hover Effect */}
          <div className="mt-4 flex items-center text-[#0063AF] font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
            <span>
              {locale === 'ar' ? 'اقرأ المزيد' : 'Learn More'}
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

