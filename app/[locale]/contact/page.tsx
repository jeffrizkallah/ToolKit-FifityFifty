/**
 * Contact Page
 * 
 * Page for users to contact FiftyFifty and book appointments.
 * Supports RTL layout and bilingual content (EN/AR).
 */

import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { ContactClient } from './ContactClient';

interface ContactPageProps {
  params: {
    locale: 'en' | 'ar';
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'ar' 
    ? 'اتصل بنا | FiftyFifty ToolKit'
    : 'Contact Us | FiftyFifty ToolKit';
    
  const description = locale === 'ar'
    ? 'تواصل معنا للاستفسارات أو لحجز موعد. نحن هنا لمساعدتك في رحلتك.'
    : 'Get in touch with us for inquiries or to book an appointment. We\'re here to help you on your journey.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        ar: '/ar/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <ContactClient locale={locale} />;
}

