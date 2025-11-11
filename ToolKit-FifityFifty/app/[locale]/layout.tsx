import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirections, isValidLocale } from '@/i18n';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { StructuredData } from '@/components/StructuredData';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ProgressProvider } from '@/lib/contexts/ProgressContext';
import '@/app/globals.css';

/**
 * Locale Layout
 * 
 * This layout handles locale-specific configuration including:
 * - Language direction (LTR/RTL)
 * - Translation provider
 * - Locale validation
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages(locale);
  const direction = localeDirections[locale as keyof typeof localeDirections];

  // Validate and cast locale for Footer
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'en';

  return (
    <html lang={locale} dir={direction}>
      <head>
        {/* Structured Data for SEO */}
        <StructuredData type="organization" locale={validLocale} />
        <StructuredData 
          type="website" 
          locale={validLocale}
          data={{
            name: 'FiftyFifty ToolKit',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
          }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ProgressProvider>
            {/* Skip to content link for keyboard navigation accessibility */}
            <a href="#main-content" className="skip-to-content">
              {locale === 'ar' ? 'انتقل إلى المحتوى الرئيسي' : 'Skip to main content'}
            </a>
            <Header />
            <main id="main-content">
              {children}
            </main>
            <Footer locale={validLocale} />
            <CookieConsent locale={validLocale} />
          </ProgressProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

