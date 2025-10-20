'use client';

/**
 * Cookie Consent Banner Component
 * 
 * Implements US5.6 - Privacy Compliance
 * GDPR-compliant cookie consent banner with accept/decline options
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { getConsent, setConsent, shouldShowConsentBanner } from '@/lib/consent';

interface CookieConsentProps {
  locale: 'en' | 'ar';
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const t = useTranslations('CookieConsent');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only check consent after component mounts (client-side only)
    setIsLoaded(true);
    setIsVisible(shouldShowConsentBanner());
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsent('declined');
    setIsVisible(false);
  };

  // Don't render anything until loaded (prevents flash)
  if (!isLoaded || !isVisible) {
    return null;
  }

  const isRTL = locale === 'ar';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg border-t border-gray-700"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1 space-y-2">
            <h2
              id="cookie-consent-title"
              className="font-semibold text-lg"
            >
              {locale === 'ar' ? 'نحن نستخدم ملفات تعريف الارتباط' : 'We use cookies'}
            </h2>
            <p
              id="cookie-consent-description"
              className="text-sm text-gray-300 leading-relaxed"
            >
              {locale === 'ar'
                ? 'نستخدم ملفات تعريف الارتباط (Cookies) وتقنيات التتبع لتحسين تجربتك وتحليل استخدام الموقع. يتم استخدام Google Analytics لجمع بيانات مجهولة المصدر حول كيفية تفاعلك مع موقعنا. لا نجمع معلومات شخصية.'
                : 'We use cookies and tracking technologies to improve your experience and analyze site usage. We use Google Analytics to collect anonymized data about how you interact with our site. We do not collect personal information.'}
            </p>
            <a
              href={`/${locale}/privacy`}
              className="text-sm text-blue-400 hover:text-blue-300 underline inline-block"
            >
              {locale === 'ar' ? 'اقرأ سياسة الخصوصية الكاملة' : 'Read our full Privacy Policy'}
            </a>
          </div>

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto ${isRTL ? 'md:mr-4' : 'md:ml-4'}`}>
            <Button
              onClick={handleAccept}
              className="bg-[#EC1C24] hover:bg-[#d91920] text-white px-6 py-2 whitespace-nowrap"
              aria-label={locale === 'ar' ? 'قبول ملفات تعريف الارتباط' : 'Accept cookies'}
            >
              {locale === 'ar' ? '✓ قبول' : '✓ Accept'}
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-6 py-2 whitespace-nowrap"
              aria-label={locale === 'ar' ? 'رفض ملفات تعريف الارتباط' : 'Decline cookies'}
            >
              {locale === 'ar' ? '✕ رفض' : '✕ Decline'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

