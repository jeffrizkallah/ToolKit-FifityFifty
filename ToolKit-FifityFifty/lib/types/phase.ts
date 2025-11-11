/**
 * Phase Type Definition
 * 
 * Represents a learning phase in the FiftyFifty ToolKit methodology.
 * Corresponds to the Strapi Phase content type.
 */

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

export interface Module {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    order: number;
    module_number: number;
    duration_minutes?: number;
    locale: 'en' | 'ar';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

/**
 * API Response types for Strapi v4
 */
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
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

/**
 * Type-safe API response types
 */
export type PhaseResponse = StrapiSingleResponse<Phase>;
export type PhasesResponse = StrapiCollectionResponse<Phase>;
export type ModulesResponse = StrapiCollectionResponse<Module>;

