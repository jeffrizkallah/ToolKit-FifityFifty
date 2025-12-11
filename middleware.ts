import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const SESSION_COOKIE_NAME = 'site_access_session';

/**
 * Create the internationalization middleware
 */
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

/**
 * Combined middleware for authentication and internationalization
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for these paths
  const publicPaths = [
    '/login',
    '/api/',  // All API routes should be accessible (they handle their own auth if needed)
    '/admin',
    '/_next',
    '/_vercel',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];

  // Check if path is public (starts with any public path)
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Check if path is for static files
  const isStaticFile = pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/);

  // Skip middleware for public paths and static files
  if (isPublicPath || isStaticFile) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // If no session, redirect to login
  if (!sessionCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, proceed with i18n middleware for locale-based routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes (handled separately above)
  // - Admin routes (not localized)
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files (images, fonts, etc.)
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
