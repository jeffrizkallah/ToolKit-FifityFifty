/**
 * CMS API Client Library
 * 
 * Reads content from local JSON files in the /content directory.
 * Uses static imports for Next.js compatibility with both server and client components.
 */

import {
  Phase,
  Module,
  Resource,
  Testimonial,
  Settings,
  CMSQueryParams,
} from './types/cms';

// Static imports of content files (works in both server and client)
import phasesData from '../content/phases.json';
import modulesData from '../content/modules.json';
import resourcesData from '../content/resources.json';
import testimonialsData from '../content/testimonials.json';
import settingsData from '../content/settings.json';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get localized field value based on locale
 */
function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string = 'en'
): string {
  if (locale === 'ar') {
    const arField = `${field}_ar`;
    if (arField in item && item[arField]) {
      return item[arField] as string;
    }
  }
  return (item[field] as string) || '';
}

// ============================================================================
// Type Definitions for Raw JSON Data
// ============================================================================

interface RawPhase {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  order: number;
  phase_number: number;
  header_video_url?: string;
}

interface RawModule {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  summary: string;
  summary_ar: string;
  video_url?: string;
  video_subtitle_url_en?: string;
  video_subtitle_url_ar?: string;
  key_takeaways?: string;
  key_takeaways_ar?: string;
  order: number;
  phase_id: number;
}

interface RawResource {
  id: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  file_url?: string;
  file_type: 'PDF' | 'Excel' | 'Word' | 'Other';
  file_size?: string;
  order: number;
  module_id: number;
}

interface RawTestimonial {
  id: number;
  name: string;
  name_ar: string;
  quote: string;
  quote_ar: string;
  role?: string;
  role_ar?: string;
  photo_url?: string;
  order: number;
}

interface RawSettings {
  site_title: string;
  site_title_ar?: string;
  hero_headline: string;
  hero_headline_ar?: string;
  hero_description: string;
  hero_description_ar?: string;
  hero_video_url?: string;
  footer_text?: string;
  footer_text_ar?: string;
  social_links?: Array<{ platform: string; url: string }>;
}

// ============================================================================
// Phase API
// ============================================================================

/**
 * Get all phases
 */
export async function getPhases(
  params: CMSQueryParams = {}
): Promise<Phase[]> {
  const locale = params.locale || 'en';
  const phases = (phasesData as { phases: RawPhase[] }).phases;
  const modules = (modulesData as { modules: RawModule[] }).modules;
  
  return phases
    .sort((a, b) => a.order - b.order)
    .map((phase) => {
      // Get modules for this phase
      const phaseModules = modules
        .filter(m => m.phase_id === phase.id)
        .sort((a, b) => a.order - b.order);
      
      return {
        id: phase.id,
        attributes: {
          title: getLocalizedField(phase, 'title', locale),
          slug: phase.slug,
          description: getLocalizedField(phase, 'description', locale),
          order: phase.order,
          phase_number: phase.phase_number,
          header_video_url: phase.header_video_url,
          locale: locale as 'en' | 'ar',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          modules: {
            data: phaseModules.map(m => ({
              id: m.id,
              attributes: {
                title: getLocalizedField(m, 'title', locale),
                slug: m.slug,
                summary: getLocalizedField(m, 'summary', locale),
                video_url: m.video_url,
                video_subtitle_url_en: m.video_subtitle_url_en,
                video_subtitle_url_ar: m.video_subtitle_url_ar,
                key_takeaways: locale === 'ar' ? m.key_takeaways_ar : m.key_takeaways,
                order: m.order,
                locale: locale as 'en' | 'ar',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
              },
            })),
          },
        },
      };
    });
}

/**
 * Convenience helper used by pages to fetch all phases for a given locale
 * with modules and resources populated.
 */
export async function fetchPhases(locale: 'en' | 'ar'): Promise<Phase[]> {
  return getPhases({ locale });
}

/**
 * Get single phase by ID
 */
export async function getPhaseById(
  id: number,
  params: CMSQueryParams = {}
): Promise<Phase | null> {
  const phases = await getPhases(params);
  return phases.find(p => p.id === id) || null;
}

/**
 * Get single phase by slug
 */
export async function getPhaseBySlug(
  slug: string,
  params: CMSQueryParams = {}
): Promise<Phase | null> {
  const phases = await getPhases(params);
  return phases.find(p => p.attributes.slug === slug) || null;
}

// ============================================================================
// Module API
// ============================================================================

/**
 * Get all modules
 */
export async function getModules(
  params: CMSQueryParams = {}
): Promise<Module[]> {
  const locale = params.locale || 'en';
  const modules = (modulesData as { modules: RawModule[] }).modules;
  const phases = (phasesData as { phases: RawPhase[] }).phases;
  const resources = (resourcesData as { resources: RawResource[] }).resources;
  
  return modules
    .sort((a, b) => a.order - b.order)
    .map((module) => {
      const phase = phases.find(p => p.id === module.phase_id);
      const moduleResources = resources
        .filter(r => r.module_id === module.id)
        .sort((a, b) => a.order - b.order);
      
      return {
        id: module.id,
        attributes: {
          title: getLocalizedField(module, 'title', locale),
          slug: module.slug,
          summary: getLocalizedField(module, 'summary', locale),
          video_url: module.video_url,
          video_subtitle_url_en: module.video_subtitle_url_en,
          video_subtitle_url_ar: module.video_subtitle_url_ar,
          key_takeaways: locale === 'ar' ? module.key_takeaways_ar : module.key_takeaways,
          order: module.order,
          locale: locale as 'en' | 'ar',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          phase: phase ? {
            data: {
              id: phase.id,
              attributes: {
                title: getLocalizedField(phase, 'title', locale),
                slug: phase.slug,
                description: getLocalizedField(phase, 'description', locale),
                order: phase.order,
                phase_number: phase.phase_number,
                header_video_url: phase.header_video_url,
                locale: locale as 'en' | 'ar',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
              },
            },
          } : undefined,
          resources: {
            data: moduleResources.map(r => ({
              id: r.id,
              attributes: {
                title: getLocalizedField(r, 'title', locale),
                description: getLocalizedField(r, 'description', locale),
                file_url: r.file_url,
                file_type: r.file_type,
                file_size: r.file_size,
                order: r.order,
                locale: locale as 'en' | 'ar',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
              },
            })),
          },
        },
      };
    });
}

/**
 * Get single module by ID
 */
export async function getModuleById(
  id: number,
  params: CMSQueryParams = {}
): Promise<Module | null> {
  const modules = await getModules(params);
  return modules.find(m => m.id === id) || null;
}

/**
 * Get single module by slug
 */
export async function getModuleBySlug(
  slug: string,
  params: CMSQueryParams = {}
): Promise<Module | null> {
  const modules = await getModules(params);
  return modules.find(m => m.attributes.slug === slug) || null;
}

/**
 * Get modules for a specific phase
 */
export async function getModulesByPhase(
  phaseSlug: string,
  params: CMSQueryParams = {}
): Promise<Module[]> {
  const phases = (phasesData as { phases: RawPhase[] }).phases;
  const phase = phases.find(p => p.slug === phaseSlug);
  
  if (!phase) return [];
  
  const modules = await getModules(params);
  return modules.filter(m => m.attributes.phase?.data.id === phase.id);
}

// ============================================================================
// Resource API
// ============================================================================

/**
 * Get all resources
 */
export async function getResources(
  params: CMSQueryParams = {}
): Promise<Resource[]> {
  const locale = params.locale || 'en';
  const resources = (resourcesData as { resources: RawResource[] }).resources;
  
  return resources
    .sort((a, b) => a.order - b.order)
    .map((resource) => ({
      id: resource.id,
      attributes: {
        title: getLocalizedField(resource, 'title', locale),
        description: getLocalizedField(resource, 'description', locale),
        file_url: resource.file_url,
        file_type: resource.file_type,
        file_size: resource.file_size,
        order: resource.order,
        locale: locale as 'en' | 'ar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    }));
}

/**
 * Get resources for a specific module
 */
export async function getResourcesByModule(
  moduleSlug: string,
  params: CMSQueryParams = {}
): Promise<Resource[]> {
  const locale = params.locale || 'en';
  const modules = (modulesData as { modules: RawModule[] }).modules;
  const module = modules.find(m => m.slug === moduleSlug);
  
  if (!module) return [];
  
  const resources = (resourcesData as { resources: RawResource[] }).resources;
  
  return resources
    .filter(r => r.module_id === module.id)
    .sort((a, b) => a.order - b.order)
    .map((resource) => ({
      id: resource.id,
      attributes: {
        title: getLocalizedField(resource, 'title', locale),
        description: getLocalizedField(resource, 'description', locale),
        file_url: resource.file_url,
        file_type: resource.file_type,
        file_size: resource.file_size,
        order: resource.order,
        locale: locale as 'en' | 'ar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    }));
}

// ============================================================================
// Testimonial API
// ============================================================================

/**
 * Get all testimonials
 */
export async function getTestimonials(
  params: CMSQueryParams = {}
): Promise<Testimonial[]> {
  const locale = params.locale || 'en';
  const testimonials = (testimonialsData as { testimonials: RawTestimonial[] }).testimonials;
  
  return testimonials
    .sort((a, b) => a.order - b.order)
    .map((testimonial) => ({
      id: testimonial.id,
      attributes: {
        name: getLocalizedField(testimonial, 'name', locale),
        quote: getLocalizedField(testimonial, 'quote', locale),
        role: getLocalizedField(testimonial, 'role', locale),
        order: testimonial.order,
        locale: locale as 'en' | 'ar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    }));
}

// ============================================================================
// Settings API (Singleton)
// ============================================================================

/**
 * Get site settings
 */
export async function getSettings(
  params: CMSQueryParams = {}
): Promise<Settings | null> {
  const locale = params.locale || 'en';
  const data = settingsData as RawSettings;
  
  return {
    id: 1,
    attributes: {
      site_title: locale === 'ar' && data.site_title_ar ? data.site_title_ar : data.site_title,
      site_title_ar: data.site_title_ar,
      hero_headline: locale === 'ar' && data.hero_headline_ar ? data.hero_headline_ar : data.hero_headline,
      hero_headline_ar: data.hero_headline_ar,
      hero_description: locale === 'ar' && data.hero_description_ar ? data.hero_description_ar : data.hero_description,
      hero_description_ar: data.hero_description_ar,
      hero_video_url: data.hero_video_url,
      footer_text: locale === 'ar' && data.footer_text_ar ? data.footer_text_ar : data.footer_text,
      footer_text_ar: data.footer_text_ar,
      social_links: data.social_links,
      locale: locale as 'en' | 'ar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get media URL (handles relative and absolute URLs)
 */
export function getMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url;
}

/**
 * Check if CMS is configured (always true for local JSON)
 */
export function isCMSConfigured(): boolean {
  return true;
}

/**
 * Get CMS health status (always true for local JSON)
 */
export async function getCMSHealth(): Promise<boolean> {
  return true;
}

// ============================================================================
// Export Configuration
// ============================================================================

export const cmsConfig = {
  baseUrl: 'local',
  hasToken: true,
  offline: false,
};
