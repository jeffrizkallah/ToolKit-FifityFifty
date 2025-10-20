/**
 * CMS API Client Library
 * 
 * Type-safe client for fetching content from Strapi CMS.
 * Handles authentication, query building, and error handling.
 */

import {
  Phase,
  PhaseResponse,
  PhasesResponse,
  Module,
  ModuleResponse,
  ModulesResponse,
  Resource,
  ResourcesResponse,
  Testimonial,
  TestimonialsResponse,
  Settings,
  SettingsResponse,
  CMSQueryParams,
  CMSFetchError,
} from './types/cms';

// ============================================================================
// Configuration
// ============================================================================

const CMS_BASE_URL = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';
const CMS_API_TOKEN = process.env.CMS_API_TOKEN || '';
const CMS_OFFLINE = String(process.env.CMS_OFFLINE || '').toLowerCase() === '1' || String(process.env.CMS_OFFLINE || '').toLowerCase() === 'true';

// Default cache settings for Next.js fetch
const DEFAULT_CACHE_OPTIONS = {
  next: { revalidate: 3600 }, // 1 hour
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build query string from CMSQueryParams
 */
function buildQueryString(params: CMSQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  // Add locale
  if (params.locale) {
    searchParams.append('locale', params.locale);
  }

  // Add populate
  if (params.populate) {
    if (Array.isArray(params.populate)) {
      params.populate.forEach((p) => searchParams.append('populate', p));
    } else {
      searchParams.append('populate', params.populate);
    }
  }

  // Add filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.append(`filters[${key}]`, String(value));
    });
  }

  // Add sort
  if (params.sort) {
    if (Array.isArray(params.sort)) {
      params.sort.forEach((s) => searchParams.append('sort', s));
    } else {
      searchParams.append('sort', params.sort);
    }
  }

  // Add pagination
  if (params.pagination) {
    Object.entries(params.pagination).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(`pagination[${key}]`, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch wrapper with authentication and error handling
 */
async function cmsFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // In offline mode we do not call the remote CMS at all.
  if (CMS_OFFLINE) {
    throw new Error('CMS_OFFLINE');
  }
  const url = `${CMS_BASE_URL}/api${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers if any
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add authentication token if available
  if (CMS_API_TOKEN) {
    headers['Authorization'] = `Bearer ${CMS_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      ...DEFAULT_CACHE_OPTIONS,
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new CMSFetchError(
        response.status,
        response.statusText,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CMSFetchError) {
      throw error;
    }
    throw new Error(`Failed to fetch from CMS: ${error}`);
  }
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
  if (CMS_OFFLINE) {
    const phasesJson = await import('../strapi-cms/sample-data/phases.json');
    const items: any[] = (phasesJson as any).default?.phases || (phasesJson as any).phases || [];
    return items.map((p, idx) => ({
      id: idx + 1,
      attributes: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        order: p.order ?? idx + 1,
        phase_number: p.phase_number ?? idx + 1,
        header_video_url: p.header_video_url,
        locale: (params.locale as any) || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        modules: { data: [] },
      },
    }));
  }
  const defaultParams: CMSQueryParams = {
    sort: 'order:asc',
    populate: 'modules',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<PhasesResponse>(`/phases${queryString}`);
  return response.data;
}

/**
 * Get single phase by ID
 */
export async function getPhaseById(
  id: number,
  params: CMSQueryParams = {}
): Promise<Phase | null> {
  if (CMS_OFFLINE) {
    const all = await getPhases(params);
    return all.find(p => p.id === id) || null;
  }
  const defaultParams: CMSQueryParams = {
    populate: 'modules',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  try {
    const response = await cmsFetch<PhaseResponse>(`/phases/${id}${queryString}`);
    return response.data;
  } catch (error) {
    if (error instanceof CMSFetchError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get single phase by slug
 */
export async function getPhaseBySlug(
  slug: string,
  params: CMSQueryParams = {}
): Promise<Phase | null> {
  if (CMS_OFFLINE) {
    const all = await getPhases(params);
    return all.find(p => p.attributes.slug === slug) || null;
  }
  const defaultParams: CMSQueryParams = {
    filters: { slug: { $eq: slug } },
    populate: 'modules',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<PhasesResponse>(`/phases${queryString}`);
  return response.data[0] || null;
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
  if (CMS_OFFLINE) {
    // No sample modules file provided; return empty for offline timeline usage
    return [];
  }
  const defaultParams: CMSQueryParams = {
    sort: 'order:asc',
    populate: ['phase', 'resources'],
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<ModulesResponse>(`/modules${queryString}`);
  return response.data;
}

/**
 * Get single module by ID
 */
export async function getModuleById(
  id: number,
  params: CMSQueryParams = {}
): Promise<Module | null> {
  if (CMS_OFFLINE) {
    const all = await getModules(params);
    return all.find(m => m.id === id) || null;
  }
  const defaultParams: CMSQueryParams = {
    populate: ['phase', 'resources'],
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  try {
    const response = await cmsFetch<ModuleResponse>(`/modules/${id}${queryString}`);
    return response.data;
  } catch (error) {
    if (error instanceof CMSFetchError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get single module by slug
 */
export async function getModuleBySlug(
  slug: string,
  params: CMSQueryParams = {}
): Promise<Module | null> {
  if (CMS_OFFLINE) {
    const all = await getModules(params);
    return all.find(m => m.attributes.slug === slug) || null;
  }
  const defaultParams: CMSQueryParams = {
    filters: { slug: { $eq: slug } },
    populate: ['phase', 'resources'],
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<ModulesResponse>(`/modules${queryString}`);
  return response.data[0] || null;
}

/**
 * Get modules for a specific phase
 */
export async function getModulesByPhase(
  phaseSlug: string,
  params: CMSQueryParams = {}
): Promise<Module[]> {
  if (CMS_OFFLINE) {
    return [];
  }
  const defaultParams: CMSQueryParams = {
    filters: { phase: { slug: { $eq: phaseSlug } } },
    sort: 'order:asc',
    populate: 'resources',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<ModulesResponse>(`/modules${queryString}`);
  return response.data;
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
  if (CMS_OFFLINE) {
    const resourcesJson = await import('../strapi-cms/sample-data/resources.json');
    const items: any[] = (resourcesJson as any).default || (resourcesJson as any);
    return items.map((r, idx) => ({
      id: idx + 1,
      attributes: {
        title: r.title,
        description: r.description,
        file_url: r.file_url,
        file_type: r.file_type,
        file_size: r.file_size,
        order: r.order ?? idx + 1,
        locale: (params.locale as any) || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    }));
  }
  const defaultParams: CMSQueryParams = {
    sort: 'order:asc',
    populate: ['module', 'file'],
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<ResourcesResponse>(`/resources${queryString}`);
  return response.data;
}

/**
 * Get resources for a specific module
 */
export async function getResourcesByModule(
  moduleSlug: string,
  params: CMSQueryParams = {}
): Promise<Resource[]> {
  if (CMS_OFFLINE) {
    const all = await getResources(params);
    return all.filter(r => (r as any).attributes?.module?.data?.attributes?.slug === moduleSlug);
  }
  const defaultParams: CMSQueryParams = {
    filters: { module: { slug: { $eq: moduleSlug } } },
    sort: 'order:asc',
    populate: 'file',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<ResourcesResponse>(`/resources${queryString}`);
  return response.data;
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
  if (CMS_OFFLINE) {
    const testimonialsJson = await import('../strapi-cms/sample-data/testimonials.json');
    const items: any[] = (testimonialsJson as any).default || (testimonialsJson as any);
    return items.map((t, idx) => ({
      id: idx + 1,
      attributes: {
        name: t.name || t.author || 'Participant',
        quote: t.quote || t.text || '',
        role: t.role,
        order: t.order ?? idx + 1,
        locale: (params.locale as any) || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    }));
  }
  const defaultParams: CMSQueryParams = {
    sort: 'order:asc',
    populate: 'photo',
    ...params,
  };

  const queryString = buildQueryString(defaultParams);
  const response = await cmsFetch<TestimonialsResponse>(`/testimonials${queryString}`);
  return response.data;
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
  if (CMS_OFFLINE) {
    const settingsJson = await import('../strapi-cms/sample-data/settings.json');
    const src: any = (settingsJson as any).default || (settingsJson as any);
    const toSettings = (locale: string): Settings => ({
      id: 1,
      attributes: {
        site_title: src.site_title,
        site_title_ar: src.site_title_ar,
        hero_headline: src.hero_headline,
        hero_headline_ar: src.hero_headline_ar,
        hero_description: src.hero_description,
        hero_description_ar: src.hero_description_ar,
        hero_video_url: src.hero_video_url,
        footer_text: src.footer_text,
        footer_text_ar: src.footer_text_ar,
        social_links: src.social_links,
        locale: (locale as any) || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return toSettings((params.locale as any) || 'en');
  }
  const queryString = buildQueryString(params);
  try {
    const response = await cmsFetch<SettingsResponse>(`/setting${queryString}`);
    return response.data;
  } catch (error) {
    if (error instanceof CMSFetchError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get media URL (handles relative and absolute URLs)
 */
export function getMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_BASE_URL}${url}`;
}

/**
 * Check if CMS is configured
 */
export function isCMSConfigured(): boolean {
  if (CMS_OFFLINE) return true;
  return Boolean(CMS_BASE_URL && CMS_API_TOKEN);
}

/**
 * Get CMS health status
 */
export async function getCMSHealth(): Promise<boolean> {
  if (CMS_OFFLINE) return true;
  try {
    await cmsFetch('/');
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Export Configuration
// ============================================================================

export const cmsConfig = {
  baseUrl: CMS_BASE_URL,
  hasToken: Boolean(CMS_API_TOKEN),
  offline: CMS_OFFLINE,
};

