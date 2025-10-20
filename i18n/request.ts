import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from '../i18n';

/**
 * Next-intl Request Configuration
 * 
 * This file configures next-intl for server-side rendering.
 * It loads the appropriate messages based on the locale parameter.
 * 
 * Updated for next-intl 3.22+ compatibility
 * See: https://next-intl.dev/docs/usage/configuration#i18n-request
 */

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a incoming `locale` is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

