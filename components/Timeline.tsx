import { Phase } from '@/lib/types/cms';
import { PhaseCard } from './PhaseCard';

interface TimelineProps {
  phases: Phase[];
  locale: string;
}

export function Timeline({ phases, locale }: TimelineProps) {
  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.attributes.order - b.attributes.order);

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'المراحل الستة' : 'The Six Phases'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'ar' 
              ? 'رحلة شاملة من الاكتشاف إلى الاستدامة، مصممة لتمكين المجتمعات وبناء تأثير دائم'
              : 'Step-by-step guidance for every woman ready to run for change'
            }
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPhases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phaseNumber={phase.attributes.phase_number}
              title={phase.attributes.title}
              description={phase.attributes.description}
              slug={phase.attributes.slug}
              locale={locale}
              index={index}
            />
          ))}
        </div>

        {/* Journey Callout */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            {locale === 'ar'
              ? 'انقر فوق أي مرحلة لاستكشاف الوحدات والموارد والمزيد'
              : 'Click any phase to explore modules, resources, and more'
            }
          </p>
        </div>
      </div>
    </section>
  );
}

