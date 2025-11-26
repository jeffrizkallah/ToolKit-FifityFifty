/**
 * Application Constants
 * 
 * Global constants used throughout the application.
 */

// Site Configuration
export const SITE_NAME = 'FiftyFifty ToolKit';
export const SITE_DESCRIPTION = 'A practical toolkit designed to help women run effective election campaigns';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Revalidation
export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '';
export const DEFAULT_REVALIDATE_TIME = 3600; // 1 hour in seconds

// Locales
export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'ar'] as const;

// Brand Colors
export const BRAND_COLORS = {
  primary: '#0063AF',
  secondary: '#EC1C24',
  neutral: {
    light: '#F6F6F6',
    medium: '#DDDDDD',
    dark: '#222222',
  },
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// API Routes
export const API_ROUTES = {
  revalidate: '/api/revalidate',
  health: '/api/health',
  adminAuth: '/api/admin/auth',
  adminContent: '/api/admin/content',
} as const;
