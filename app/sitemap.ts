import { MetadataRoute } from 'next';
import { getPhases } from '@/lib/cms-client';

/**
 * Dynamic Sitemap Generation
 * 
 * Implements US5.3 - SEO Implementation
 * Generates sitemap with all pages including dynamic phase and module routes
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolkit.fiftyfifty.org';

  // Get all phases and modules for both locales
  let phasesEn: Awaited<ReturnType<typeof getPhases>> = [];
  let phasesAr: Awaited<ReturnType<typeof getPhases>> = [];

  try {
    [phasesEn, phasesAr] = await Promise.all([
      getPhases({ locale: 'en' }).catch(() => []),
      getPhases({ locale: 'ar' }).catch(() => []),
    ]);
  } catch (error) {
    console.warn('Failed to fetch phases for sitemap, returning static routes only:', error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
  ];

  // Dynamic phase routes
  const phaseRoutesEn: MetadataRoute.Sitemap = phasesEn.map((phase) => ({
    url: `${baseUrl}/en/phase/${phase.attributes.slug}`,
    lastModified: new Date(phase.attributes.updatedAt || phase.attributes.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en/phase/${phase.attributes.slug}`,
        ar: `${baseUrl}/ar/phase/${phase.attributes.slug}`,
      },
    },
  }));

  const phaseRoutesAr: MetadataRoute.Sitemap = phasesAr.map((phase) => ({
    url: `${baseUrl}/ar/phase/${phase.attributes.slug}`,
    lastModified: new Date(phase.attributes.updatedAt || phase.attributes.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en/phase/${phase.attributes.slug}`,
        ar: `${baseUrl}/ar/phase/${phase.attributes.slug}`,
      },
    },
  }));

  // Dynamic module routes
  const moduleRoutesEn: MetadataRoute.Sitemap = [];
  const moduleRoutesAr: MetadataRoute.Sitemap = [];

  for (const phase of phasesEn) {
    const modules = phase.attributes.modules?.data || [];
    for (const moduleItem of modules) {
      moduleRoutesEn.push({
        url: `${baseUrl}/en/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
        lastModified: new Date(moduleItem.attributes.updatedAt || moduleItem.attributes.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
            ar: `${baseUrl}/ar/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
          },
        },
      });
    }
  }

  for (const phase of phasesAr) {
    const modules = phase.attributes.modules?.data || [];
    for (const moduleItem of modules) {
      moduleRoutesAr.push({
        url: `${baseUrl}/ar/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
        lastModified: new Date(moduleItem.attributes.updatedAt || moduleItem.attributes.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
            ar: `${baseUrl}/ar/phase/${phase.attributes.slug}/module/${moduleItem.attributes.slug}`,
          },
        },
      });
    }
  }

  return [
    ...staticRoutes,
    ...phaseRoutesEn,
    ...phaseRoutesAr,
    ...moduleRoutesEn,
    ...moduleRoutesAr,
  ];
}

