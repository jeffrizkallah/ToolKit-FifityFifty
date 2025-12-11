'use client';

import { Phase } from '@/lib/types/cms';
import { HoverEffect } from './ui/card-hover-effect';

interface TimelineProps {
  phases: Phase[];
  locale: string;
}

export function Timeline({ phases, locale }: TimelineProps) {
  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.attributes.order - b.attributes.order);

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  // Transform phases to HoverEffect items
  const hoverEffectItems = sortedPhases.map((phase) => ({
    title: phase.attributes.title,
    description: stripHtml(phase.attributes.description),
    link: `/${locale}/phase/${phase.attributes.slug}`,
    phaseNumber: phase.attributes.phase_number,
  }));

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0041A8] mb-3 tracking-tight">
            {locale === 'ar' ? 'المراحل الثلاث' : 'The Three Phases'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
            {locale === 'ar' 
              ? 'رحلة شاملة من الاكتشاف إلى الاستدامة، مصممة لتمكين المجتمعات وبناء تأثير دائم'
              : 'Step-by-step guidance for every woman ready to run for change'
            }
          </p>
        </div>

        {/* Hover Effect Cards */}
        <HoverEffect items={hoverEffectItems} className="gap-8" />

        {/* Journey Callout */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            {locale === 'ar'
              ? 'اضغطي فوق أي مرحلة لاستكشاف الوحدات والموارد والمزيد'
              : 'Click any phase to explore modules, resources, and more'
            }
          </p>
        </div>
      </div>
    </section>
  );
}

