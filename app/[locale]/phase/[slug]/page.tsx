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
  const currentPhaseIndex = allPhases.findIndex(p => p.id === phase.id);
  const nextPhase = currentPhaseIndex < allPhases.length - 1 ? allPhases[currentPhaseIndex + 1] : null;
  const totalPhases = allPhases.length;

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
        <div className="bg-white border-b">
          <div className="container py-4">
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

      {/* Phase Header */}
      <section className="bg-gradient-to-br from-[#0063AF] to-[#004a8a] text-white py-16">
        <div className="container">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <span className="font-semibold">
                {validLocale === 'ar' 
                  ? `المرحلة ${phase_number} من ${totalPhases}`
                  : `Phase ${phase_number} of ${totalPhases}`}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {title}
              </h1>
              <div 
                className="text-lg text-blue-50 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              
              {/* Video Button */}
              {header_video_url && (
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-[#EC1C24] hover:bg-[#d01820] text-white"
                >
                  <a 
                    href={header_video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    {validLocale === 'ar' ? 'شاهد فيديو المرحلة' : 'Watch Phase Video'}
                  </a>
                </Button>
              )}
            </div>

            {/* Phase Number Display */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-8xl font-bold text-white/90">
                    {phase_number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {validLocale === 'ar' ? 'الوحدات التعليمية' : 'Learning Modules'}
            </h2>
            <p className="text-gray-600">
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
            <div className="text-center py-12 text-gray-500">
              {validLocale === 'ar'
                ? 'لا توجد وحدات متاحة في هذه المرحلة حالياً'
                : 'No modules available in this phase yet'}
            </div>
          )}
        </div>
      </section>

      {/* Next Phase Navigation */}
      {nextPhase && (
        <section className="py-12 bg-white border-t">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {validLocale === 'ar' ? 'المرحلة التالية' : 'Next Phase'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {nextPhase.attributes.title}
                </h3>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-[#0063AF] hover:bg-[#004a8a] text-white"
              >
                <Link 
                  href={`/${validLocale}/phase/${nextPhase.attributes.slug}`}
                  className="flex items-center gap-2"
                >
                  {validLocale === 'ar' ? 'المتابعة إلى المرحلة التالية' : 'Continue to Next Phase'}
                  {isRTL ? (
                    <ArrowLeft className="h-5 w-5" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Back to Home */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <Link 
            href={`/${validLocale}`}
            className="inline-flex items-center gap-2 text-[#0063AF] hover:underline"
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

