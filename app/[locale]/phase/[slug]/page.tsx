import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPhases, getPhaseBySlug, getModulesByPhase } from '@/lib/cms-client';
import { ModuleCard } from '@/components/ModuleCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { StructuredData } from '@/components/StructuredData';

/**
 * Phase Detail Page
 * 
 * Implements US3.7 - Phase Detail Page Template
 * Dynamic route that displays a phase with all its modules.
 * Features: phase header, video, module grid, progress indicator, next phase navigation.
 */

interface PhasePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all phases (ISR)
export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const allParams = [];

  try {
    for (const locale of locales) {
      try {
        const phases = await getPhases({ locale: locale as 'en' | 'ar' });
        
        for (const phase of phases) {
          allParams.push({
            locale,
            slug: phase.attributes.slug,
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch phases for locale ${locale}:`, error);
        // Continue with other locales even if one fails
      }
    }
  } catch (error) {
    console.warn('Failed to generate static params for phases:', error);
    // Return empty array to prevent build failure
    return [];
  }

  return allParams;
}

// Generate metadata for SEO
export async function generateMetadata({
  params: { locale, slug },
}: PhasePageProps): Promise<Metadata> {
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';
  
  try {
    const phase = await getPhaseBySlug(slug, { locale: validLocale });

    if (!phase) {
      return {
        title: 'Phase Not Found',
      };
    }

    const description = phase.attributes.description.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: `${phase.attributes.title} | FiftyFifty ToolKit`,
      description,
      alternates: {
        canonical: `/${validLocale}/phase/${slug}`,
        languages: {
          en: `/en/phase/${slug}`,
          ar: `/ar/phase/${slug}`,
        },
      },
      openGraph: {
        title: `${phase.attributes.title} | FiftyFifty ToolKit`,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${validLocale}/phase/${slug}`,
        siteName: 'FiftyFifty ToolKit',
        locale: validLocale === 'ar' ? 'ar_SA' : 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${phase.attributes.title} | FiftyFifty ToolKit`,
        description,
      },
    };
  } catch (error) {
    console.warn(`Failed to generate metadata for phase ${slug}:`, error);
    return {
      title: 'FiftyFifty ToolKit',
      description: 'Educational toolkit for sustainable development',
    };
  }
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;

export default async function PhasePage({ params: { locale, slug } }: PhasePageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  // Validate and cast locale
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';
  const isRTL = validLocale === 'ar';

  // Fetch phase data
  let phase;
  try {
    phase = await getPhaseBySlug(slug, { locale: validLocale });
  } catch (error) {
    console.error(`Failed to fetch phase ${slug}:`, error);
    notFound();
  }

  if (!phase) {
    notFound();
  }

  // Fetch modules for this phase
  let modules: Awaited<ReturnType<typeof getModulesByPhase>> = [];
  try {
    modules = await getModulesByPhase(slug, { locale: validLocale });
  } catch (error) {
    console.warn(`Failed to fetch modules for phase ${slug}:`, error);
  }

  // Fetch all phases to determine next phase
  let allPhases: Awaited<ReturnType<typeof getPhases>> = [];
  try {
    allPhases = await getPhases({ locale: validLocale });
  } catch (error) {
    console.warn('Failed to fetch all phases:', error);
  }
  const sortedPhases = [...allPhases].sort(
    (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0)
  );
  const currentPhaseIndex = sortedPhases.findIndex((p) => p.id === phase.id);
  const nextPhase =
    currentPhaseIndex !== -1 && currentPhaseIndex < sortedPhases.length - 1
      ? sortedPhases[currentPhaseIndex + 1]
      : null;
  const previousPhase =
    currentPhaseIndex > 0 ? sortedPhases[currentPhaseIndex - 1] : null;
  const totalPhases = sortedPhases.length;

  const {
    title,
    description,
    phase_number,
    header_video_url,
  } = phase.attributes;

  // Breadcrumb data for structured data
  const breadcrumbData = [
    {
      name: validLocale === 'ar' ? 'الرئيسية' : 'Home',
      url: `/${validLocale}`,
    },
    {
      name: title,
      url: `/${validLocale}/phase/${slug}`,
    },
  ];

  return (
    <>
      {/* Structured Data for Breadcrumbs */}
      <StructuredData 
        type="breadcrumb" 
        locale={validLocale}
        data={{ breadcrumbs: breadcrumbData }}
      />
      
      <main className="min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="pt-6 pb-4">
          <div className="max-w-6xl mx-auto px-6">
            <Breadcrumb
              items={[
                {
                  label: validLocale === 'ar' ? 'الرئيسية' : 'Home',
                  href: `/${validLocale}`,
                },
                {
                  label: title,
                  isCurrentPage: true,
                },
              ]}
              locale={validLocale}
            />
          </div>
        </div>

      {/* Phase Header - Two Column Layout */}
      <section className="bg-gradient-to-br from-[#0041A8] via-[#0063AF] to-[#007BFF] text-white py-20 relative overflow-hidden rounded-2xl mx-4 my-8">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 glass-component bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium border border-white/20">
              <span>
                {validLocale === 'ar' 
                  ? `المرحلة ${phase_number} من ${totalPhases}`
                  : `Phase ${phase_number} of ${totalPhases}`}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {title}
              </h1>
              
              <div 
                className="text-lg text-white/90 leading-relaxed font-normal prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              
              {/* Key Learning Outcomes */}
              <div className="pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">
                  {validLocale === 'ar' ? 'نتائج التعلم الرئيسية' : 'Key Learning Outcomes'}
                </h3>
                <ul className="space-y-2.5">
                  {/* Extract key points from description or show placeholder */}
                  <li className="flex items-start gap-3 text-white/90">
                    <svg className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">
                      {validLocale === 'ar' 
                        ? 'فهم الأساسيات والمفاهيم الأساسية'
                        : 'Understand fundamentals and core concepts'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-white/90">
                    <svg className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">
                      {validLocale === 'ar' 
                        ? 'تطبيق الاستراتيجيات العملية'
                        : 'Apply practical strategies'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-white/90">
                    <svg className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">
                      {validLocale === 'ar' 
                        ? 'بناء المهارات الأساسية'
                        : 'Build essential skills'}
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Video Button - Enhanced */}
              {header_video_url && (
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-[#0041A8] hover:bg-white/95 px-8 py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
                  >
                    <a 
                      href={header_video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <PlayCircle className="h-6 w-6" />
                      <span>{validLocale === 'ar' ? 'شاهد فيديو المرحلة' : 'Watch Phase Video'}</span>
                    </a>
                  </Button>
                  {/* Optional: Video duration or thumbnail placeholder */}
                  <p className="text-sm text-white/70 mt-2 ml-1">
                    {validLocale === 'ar' ? 'مدة الفيديو: ~10 دقائق' : 'Video duration: ~10 minutes'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Phase Number Circle */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="relative w-64 h-64 rounded-full glass-component bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center shadow-2xl">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  <span className="relative text-9xl font-extrabold text-white tracking-tight">
                    {phase_number}
                  </span>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0041A8] mb-3 tracking-tight">
              {validLocale === 'ar' ? 'الوحدات التعليمية' : 'Learning Modules'}
            </h2>
            <p className="text-gray-600 text-lg font-normal max-w-2xl mx-auto">
              {validLocale === 'ar'
                ? `استكشف ${modules.length} وحدة تعليمية في هذه المرحلة`
                : `Explore ${modules.length} learning modules in this phase`}
            </p>
          </div>

          {/* Modules Grid */}
          {modules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  locale={validLocale}
                  index={index}
                  phaseSlug={slug}
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Empty State with Glassmorphism Cards */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-component glass-layered rounded-2xl p-8 border border-neutral-200 bg-white/50 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">
                      {validLocale === 'ar'
                        ? 'لا توجد وحدات متاحة حالياً'
                        : 'No modules available yet'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Next Phase Navigation */}
      {nextPhase && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-2 font-medium uppercase tracking-wide">
                  {validLocale === 'ar' ? 'المرحلة التالية' : 'Next Phase'}
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#0041A8] tracking-tight">
                  {nextPhase.attributes.title}
                </h3>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                {previousPhase && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-base font-bold rounded-full border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100 text-neutral-700"
                  >
                    <Link
                      href={`/${validLocale}/phase/${previousPhase.attributes.slug}`}
                      className="flex items-center gap-3"
                    >
                      {isRTL ? (
                        <ArrowRight className="h-5 w-5" />
                      ) : (
                        <ArrowLeft className="h-5 w-5" />
                      )}
                      <span>
                        {validLocale === 'ar'
                          ? 'العودة إلى المرحلة السابقة'
                          : 'Back to Previous Phase'}
                      </span>
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#0041A8] to-[#007BFF] text-white hover:from-[#003d96] hover:to-[#0069e6] px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full"
                >
                  <Link 
                    href={`/${validLocale}/phase/${nextPhase.attributes.slug}`}
                    className="flex items-center gap-3"
                  >
                    <span>{validLocale === 'ar' ? 'المتابعة إلى المرحلة التالية' : 'Continue to Next Phase'}</span>
                    {isRTL ? (
                      <ArrowLeft className="h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Home */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <Link 
            href={`/${validLocale}`}
            className="inline-flex items-center gap-2 text-[#0041A8] hover:text-[#007BFF] font-medium transition-colors duration-200"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            {validLocale === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </section>
      </main>
    </>
  );
}

