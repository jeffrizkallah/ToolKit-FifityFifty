/**
 * Analytics utilities for tracking user interactions
 * Implements Google Analytics 4 (GA4) event tracking
 */

// Extend window type to include gtag (already declared in GoogleAnalytics.tsx)

/**
 * Track resource download events
 * @param resourceName - The name/title of the downloaded resource
 * @param fileType - The file type/extension (e.g., 'pdf', 'docx')
 * @param moduleSlug - The slug of the module the resource belongs to
 */
export function trackDownload(
  resourceName: string,
  fileType: string,
  moduleSlug: string
): void {
  // Check if gtag is available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'download_resource', {
      resource_name: resourceName,
      file_type: fileType,
      module_slug: moduleSlug,
      // Additional standard GA4 parameters
      event_category: 'engagement',
      event_label: resourceName,
    });
  } else {
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Download tracked:', {
        resource_name: resourceName,
        file_type: fileType,
        module_slug: moduleSlug,
      });
    }
  }
}

/**
 * Track video play events
 * @param videoTitle - The title of the video
 * @param moduleSlug - The slug of the module the video belongs to
 */
export function trackVideoPlay(videoTitle: string, moduleSlug: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_play', {
      video_title: videoTitle,
      module_slug: moduleSlug,
      event_category: 'engagement',
      event_label: videoTitle,
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Video play tracked:', {
      video_title: videoTitle,
      module_slug: moduleSlug,
    });
  }
}

/**
 * Track navigation events
 * @param destination - The destination page or section
 */
export function trackNavigation(destination: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'navigation', {
      destination: destination,
      event_category: 'navigation',
      event_label: destination,
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Navigation tracked:', {
      destination: destination,
    });
  }
}

