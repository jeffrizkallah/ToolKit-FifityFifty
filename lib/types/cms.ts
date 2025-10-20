/**
 * Comprehensive CMS Type Definitions
 * 
 * TypeScript interfaces for all Strapi CMS content types in the FiftyFifty ToolKit.
 * These types provide full type safety when fetching and using CMS content.
 */

// ============================================================================
// Base Strapi Types
// ============================================================================

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// Phase Content Type
// ============================================================================

export interface Phase {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    order: number;
    phase_number: number;
    header_video_url?: string;
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    modules?: {
      data: Module[];
    };
  };
}

export type PhaseResponse = StrapiSingleResponse<Phase>;
export type PhasesResponse = StrapiCollectionResponse<Phase>;

// ============================================================================
// Module Content Type
// ============================================================================

export interface Module {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary: string;
    video_url?: string;
    video_subtitle_url_en?: string;
    video_subtitle_url_ar?: string;
    key_takeaways?: string; // Rich text HTML
    order: number;
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    phase?: {
      data: Phase;
    };
    resources?: {
      data: Resource[];
    };
  };
}

export type ModuleResponse = StrapiSingleResponse<Module>;
export type ModulesResponse = StrapiCollectionResponse<Module>;

// ============================================================================
// Resource Content Type
// ============================================================================

export interface Resource {
  id: number;
  attributes: {
    title: string;
    description?: string;
    file?: {
      data: StrapiMedia;
    };
    file_url?: string;
    file_type: 'PDF' | 'Excel' | 'Word' | 'Other';
    file_size?: string;
    order: number;
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    module?: {
      data: Module;
    };
  };
}

export type ResourceResponse = StrapiSingleResponse<Resource>;
export type ResourcesResponse = StrapiCollectionResponse<Resource>;

// ============================================================================
// Testimonial Content Type
// ============================================================================

export interface Testimonial {
  id: number;
  attributes: {
    name: string;
    quote: string;
    photo?: {
      data: StrapiMedia;
    };
    role?: string;
    order: number;
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export type TestimonialResponse = StrapiSingleResponse<Testimonial>;
export type TestimonialsResponse = StrapiCollectionResponse<Testimonial>;

// ============================================================================
// Settings Content Type (Singleton)
// ============================================================================

export interface Settings {
  id: number;
  attributes: {
    site_title: string;
    site_title_ar?: string;
    hero_headline: string;
    hero_headline_ar?: string;
    hero_description: string;
    hero_description_ar?: string;
    hero_video_url?: string;
    footer_text?: string;
    footer_text_ar?: string;
    social_links?: SocialLink[];
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
}

export type SettingsResponse = StrapiSingleResponse<Settings>;

// ============================================================================
// Query Parameters
// ============================================================================

export interface CMSQueryParams {
  locale?: 'en' | 'ar';
  populate?: string | string[];
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
}

// ============================================================================
// Error Handling
// ============================================================================

export interface CMSError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

export class CMSFetchError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public details?: unknown
  ) {
    super(`CMS API Error: ${status} ${statusText}`);
    this.name = 'CMSFetchError';
  }
}

