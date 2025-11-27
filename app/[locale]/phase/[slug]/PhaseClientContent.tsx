'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { VideoCarousel } from '@/components/VideoCarousel';
import { DocumentsSection } from '@/components/DocumentsSection';
import { DocumentData } from '@/components/DocumentCard';

interface Video {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
}

interface PhaseClientContentProps {
  videos: Video[];
  documents: DocumentData[];
  locale: 'en' | 'ar';
}

/**
 * PhaseClientContent Component
 * 
 * Client-side wrapper for the interactive phase content sections.
 * Includes:
 * - Learning Modules section with video carousel (3D coverflow effect)
 * - Documents & Resources section
 * - Scroll-triggered animations
 */
export function PhaseClientContent({ videos, documents, locale }: PhaseClientContentProps) {
  return (
    <>
      {/* Learning Modules Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="py-10"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0041A8]/5 text-[#0041A8] text-sm font-medium mb-2">
              <Video className="w-4 h-4" />
              <span>{locale === 'ar' ? 'المحتوى التعليمي' : 'Learning Content'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0041A8] mb-2 tracking-tight">
              {locale === 'ar' ? 'الوحدات التعليمية' : 'Learning Modules'}
            </h2>
            <p className="text-gray-600 text-lg font-normal max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'استكشف الفيديوهات التعليمية في هذه المرحلة'
                : 'Explore the learning videos in this phase'}
            </p>
          </motion.div>

          {/* Video Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {videos.length > 0 ? (
              <VideoCarousel videos={videos} locale={locale} />
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">
                  {locale === 'ar' ? 'لا توجد فيديوهات متاحة' : 'No Videos Available'}
                </h3>
                <p className="text-gray-500">
                  {locale === 'ar'
                    ? 'سيتم إضافة فيديوهات لهذه المرحلة قريباً'
                    : 'Videos will be added to this phase soon'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Documents Section */}
      <div className="bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <DocumentsSection
            documents={documents}
            locale={locale}
          />
        </div>
      </div>
    </>
  );
}

export default PhaseClientContent;

