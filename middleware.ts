import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Next.js Middleware for Internationalization
 * 
 * This middleware handles locale detection and routing.
 * It redirects users to the appropriate locale-based URL.
 */

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't redirect to default locale (shows locale in URL)
  localePrefix: 'always',

  // Detect locale from Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  // Skip Next.js internals and static files
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - _vercel (Vercel internals)
    // - Static files (images, fonts, etc.)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/api/`, except for the ones starting with `/api/webhooks/`
    // '/api/((?!webhooks).*)',
  ],
};

