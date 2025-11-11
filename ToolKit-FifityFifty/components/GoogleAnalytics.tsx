'use client';

/**
 * Google Analytics 4 Component
 * 
 * Implements US5.4 - GA4 Integration
 * Implements US5.6 - Privacy Compliance (consent-based loading)
 * Privacy-compliant analytics tracking with custom events
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isAnalyticsEnabled } from '@/lib/consent';

interface GoogleAnalyticsProps {
  gaId: string;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);

  // Check consent on mount and listen for changes
  useEffect(() => {
    // Initial consent check
    setHasConsent(isAnalyticsEnabled());

    // Listen for consent changes
    const handleConsentChange = () => {
      setHasConsent(isAnalyticsEnabled());
    };

    window.addEventListener('consentchange', handleConsentChange);
    return () => window.removeEventListener('consentchange', handleConsentChange);
  }, []);

  // Track page views on route change (only if consent given)
  useEffect(() => {
    if (!hasConsent || !gaId || typeof window.gtag === 'undefined') return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    window.gtag('config', gaId, {
      page_path: url,
    });
  }, [pathname, searchParams, gaId, hasConsent]);

  // Don't render in development, if no GA ID, or if no consent
  if (!gaId || process.env.NODE_ENV === 'development' || !hasConsent) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Analytics Event Tracking Functions
 * Privacy-compliant - no PII tracked
 */

export const analytics = {
  // Track video play events
  trackVideoPlay: (videoUrl: string, videoTitle?: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'watch_video', {
        event_category: 'engagement',
        event_label: videoTitle || 'Unknown Video',
        video_url: videoUrl,
      });
    }
  },

  // Track resource downloads
  trackDownload: (resourceTitle: string, resourceType: string, resourceUrl: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'download_resource', {
        event_category: 'engagement',
        event_label: resourceTitle,
        resource_type: resourceType,
        resource_url: resourceUrl,
      });
    }
  },

  // Track phase navigation
  trackPhaseNavigate: (phaseNumber: number, phaseTitle: string, phaseSlug: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'phase_navigate', {
        event_category: 'navigation',
        event_label: `Phase ${phaseNumber}: ${phaseTitle}`,
        phase_number: phaseNumber,
        phase_slug: phaseSlug,
      });
    }
  },

  // Track module access
  trackModuleAccess: (moduleTitle: string, moduleSlug: string, phaseSlug: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'module_access', {
        event_category: 'engagement',
        event_label: moduleTitle,
        module_slug: moduleSlug,
        phase_slug: phaseSlug,
      });
    }
  },

  // Track language change
  trackLanguageChange: (newLanguage: 'en' | 'ar') => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'language_change', {
        event_category: 'interaction',
        event_label: newLanguage === 'ar' ? 'Arabic' : 'English',
        language: newLanguage,
      });
    }
  },

  // Track search queries (if search feature exists)
  trackSearch: (searchQuery: string, resultsCount: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'search', {
        search_term: searchQuery,
        results_count: resultsCount,
      });
    }
  },

  // Track external link clicks
  trackExternalLink: (url: string, linkText: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'click_external_link', {
        event_category: 'engagement',
        event_label: linkText,
        link_url: url,
      });
    }
  },

  // Track CTA button clicks
  trackCTA: (ctaLabel: string, ctaLocation: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: ctaLabel,
        cta_location: ctaLocation,
      });
    }
  },
};

