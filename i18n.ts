/**
 * Internationalization Configuration
 * 
 * This file configures the supported locales and default locale for the application.
 * Used by next-intl for routing and translations.
 */

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

/**
 * Check if a given locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get the opposite locale (for language switcher)
 */
export function getOppositeLocale(currentLocale: Locale): Locale {
  return currentLocale === 'en' ? 'ar' : 'en';
}

