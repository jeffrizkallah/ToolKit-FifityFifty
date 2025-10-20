import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getModuleBySlug, getModulesByPhase } from '@/lib/cms-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Module } from '@/lib/types/cms';
import { Breadcrumb } from '@/components/Breadcrumb';
import VideoPlayer from '@/components/VideoPlayer';
import ResourceList from '@/components/ResourceList';

/**
 * Module Detail Page
 * 
 * Implements US3.9 - Module Detail Page Template
 * Displays detailed content for a specific module including video, takeaways, and resources.
 */

interface ModulePageProps {
  params: {
    locale: string;
    slug: string;
    moduleSlug: string;
  };
}

// Generate static params for all phase/module combinations (ISR)
export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const allParams = [];

  for (const locale of locales) {
    const modules = await getModulesByPhase('', { locale: locale as 'en' | 'ar' });
    
    for (const module of modules) {
      if (module.attributes.phase?.data) {
        allParams.push({
          locale,
          slug: module.attributes.phase.data.attributes.slug,
          moduleSlug: module.attributes.slug,
        });
      }
    }
  }

  return allParams;
}

// Generate metadata for SEO
export async function generateMetadata({
  params: { locale, moduleSlug },
}: ModulePageProps): Promise<Metadata> {
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';
  const module = await getModuleBySlug(moduleSlug, { locale: validLocale });

  if (!module) {
    return {
      title: 'Module Not Found',
    };
  }

  return {
    title: `${module.attributes.title} | FiftyFifty ToolKit`,
    description: module.attributes.summary.substring(0, 160),
    alternates: {
      canonical: `/${validLocale}/phase/${module.attributes.phase?.data?.attributes.slug}/module/${moduleSlug}`,
      languages: {
        en: `/en/phase/${module.attributes.phase?.data?.attributes.slug}/module/${moduleSlug}`,
        ar: `/ar/phase/${module.attributes.phase?.data?.attributes.slug}/module/${moduleSlug}`,
      },
    },
  };
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;

export default async function ModulePage({ params: { locale, slug, moduleSlug } }: ModulePageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  // Validate and cast locale
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';
  const isRTL = validLocale === 'ar';

  // Fetch module data
  const module = await getModuleBySlug(moduleSlug, { locale: validLocale });

  if (!module) {
    notFound();
  }

  const phase = module.attributes.phase?.data;
  
  if (!phase) {
    notFound();
  }

  // Fetch all modules in this phase for prev/next navigation
  const allModules = await getModulesByPhase(slug, { locale: validLocale });
  const currentIndex = allModules.findIndex(m => m.id === module.id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  const {
    title,
    summary,
    video_url,
    video_subtitle_url_en,
    video_subtitle_url_ar,
    key_takeaways,
  } = module.attributes;

  const resources = module.attributes.resources?.data || [];

  return (
    <main className="min-h-screen bg-gray-50">
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
                label: phase.attributes.title,
                href: `/${validLocale}/phase/${slug}`,
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

      {/* Module Header */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <div 
              className="text-lg text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      </section>

      {/* Video Section */}
      {video_url && (
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <VideoPlayer
                videoUrl={video_url}
                title={title}
                locale={validLocale}
                subtitleUrlEn={video_subtitle_url_en}
                subtitleUrlAr={video_subtitle_url_ar}
              />
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways Section */}
      {key_takeaways && (
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-[#0063AF]" />
                  {validLocale === 'ar' ? 'النقاط الرئيسية' : 'Key Takeaways'}
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: key_takeaways }}
                />
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {resources.length > 0 && (
        <ResourceList
          resources={resources}
          locale={validLocale}
          moduleSlug={moduleSlug}
        />
      )}

      {/* Previous/Next Navigation */}
      <section className="py-12 bg-white border-t">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Previous Module */}
              {prevModule ? (
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-sm text-gray-600 mb-2">
                    {validLocale === 'ar' ? 'الوحدة السابقة' : 'Previous Module'}
                  </div>
                  <Link 
                    href={`/${validLocale}/phase/${slug}/module/${prevModule.attributes.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0063AF] transition-colors flex items-center gap-2">
                      {isRTL ? (
                        <ArrowRight className="h-5 w-5" />
                      ) : (
                        <ArrowLeft className="h-5 w-5" />
                      )}
                      {prevModule.attributes.title}
                    </h3>
                  </Link>
                </Card>
              ) : (
                <div />
              )}

              {/* Next Module */}
              {nextModule ? (
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-sm text-gray-600 mb-2 text-end">
                    {validLocale === 'ar' ? 'الوحدة التالية' : 'Next Module'}
                  </div>
                  <Link 
                    href={`/${validLocale}/phase/${slug}/module/${nextModule.attributes.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0063AF] transition-colors flex items-center justify-end gap-2">
                      {nextModule.attributes.title}
                      {isRTL ? (
                        <ArrowLeft className="h-5 w-5" />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                    </h3>
                  </Link>
                </Card>
              ) : (
                <div />
              )}
            </div>

            {/* Back to Phase */}
            <div className="mt-8 text-center">
              <Link 
                href={`/${validLocale}/phase/${slug}`}
                className="inline-flex items-center gap-2 text-[#0063AF] hover:underline"
              >
                {isRTL ? (
                  <ArrowRight className="h-4 w-4" />
                ) : (
                  <ArrowLeft className="h-4 w-4" />
                )}
                {validLocale === 'ar' ? 'العودة إلى المرحلة' : 'Back to Phase'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

