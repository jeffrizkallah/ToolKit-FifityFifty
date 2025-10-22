import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSettings, getPhases, getTestimonials } from '@/lib/cms-client';
import { HeroClient } from './HeroClient';
import { Timeline } from '@/components/Timeline';

// Dynamically import TestimonialsSlider for code splitting (below-the-fold content)
const TestimonialsSlider = dynamic(() => import('@/components/TestimonialsSlider').then(mod => ({ default: mod.TestimonialsSlider })), {
  ssr: true,
  loading: () => (
    <div className="py-16 bg-gray-50">
      <div className="container text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
        </div>
      </div>
    </div>
  ),
});

/**
 * Home Page
 * 
 * Landing page with hero section and phases timeline.
 * Implements US3.1 - Landing Page Layout & Hero Section
 * Implements US3.2 - Six-Phase Timeline Component
 */

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Validate and cast locale
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';

  // Fetch settings for SEO
  let settings;
  try {
    settings = await getSettings({ locale: validLocale });
  } catch (error) {
    console.warn('Failed to fetch settings for metadata:', error);
    settings = null;
  }

  const title = validLocale === 'ar'
    ? settings?.attributes?.site_title_ar || 'أدوات FiftyFifty'
    : settings?.attributes?.site_title || 'FiftyFifty ToolKit';

  const description = validLocale === 'ar'
    ? settings?.attributes?.hero_description_ar || 'منهجية شاملة ومنصة تعليمية لرواد الأعمال الاجتماعيين'
    : settings?.attributes?.hero_description || 'A comprehensive methodology and learning platform for social entrepreneurs';

  return {
    title,
    description,
    alternates: {
      canonical: `/${validLocale}`,
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: validLocale === 'ar' ? 'ar_SA' : 'en_US',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${validLocale}`,
      siteName: 'FiftyFifty ToolKit',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image.png'],
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  // Validate and cast locale
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';

  // Fetch CMS settings
  let settings;
  try {
    settings = await getSettings({ locale: validLocale });
  } catch (error) {
    console.warn('Failed to fetch settings for home page:', error);
    settings = null;
  }

  // Get hero content with fallbacks
  const headline = validLocale === 'ar'
    ? settings?.attributes?.hero_headline_ar || 'مكّن مجتمعك، ابنِ تغييراً دائماً'
    : settings?.attributes?.hero_headline || 'Run for Change, Lead with Confidence';

  const description = validLocale === 'ar'
    ? settings?.attributes?.hero_description_ar || 'منهجية شاملة ومنصة تعليمية لرواد الأعمال الاجتماعيين وقادة المجتمع في العالم العربي.'
    : settings?.attributes?.hero_description || 'A practical toolkit designed to help women run effective election campaigns. Explore the 6 key phases, from taking the decision to run, to Election Day and beyond, with step-by-step guidance, short videos, and ready-to-use resources.';

  const heroVideoUrl = settings?.attributes?.hero_video_url;

  // Fetch phases for timeline
  let phases: Awaited<ReturnType<typeof getPhases>> = [];
  try {
    phases = await getPhases({ locale: validLocale });
  } catch (error) {
    console.warn('Failed to fetch phases for home page:', error);
  }

  // Fetch testimonials
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  try {
    testimonials = await getTestimonials({ locale: validLocale });
  } catch (error) {
    console.warn('Failed to fetch testimonials for home page:', error);
  }

  return (
    <main className="min-h-screen">
      <HeroClient 
        headline={headline}
        description={description}
        videoUrl={heroVideoUrl}
      />
      
      {/* Timeline Section */}
      <div id="phases-timeline">
        <Timeline phases={phases} locale={validLocale} />
      </div>

      {/* Testimonials Section */}
      <TestimonialsSlider testimonials={testimonials} locale={validLocale} />
    </main>
  );
}

