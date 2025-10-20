'use client';

import React, { useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  locale?: 'en' | 'ar';
  subtitleUrlEn?: string;
  subtitleUrlAr?: string;
  className?: string;
}

/**
 * VideoPlayer Component
 * 
 * Supports YouTube and Vimeo video embeds with:
 * - Responsive 16:9 aspect ratio
 * - Automatic video platform detection
 * - Loading state
 * - Bilingual subtitle support
 * - Mobile-friendly design
 */
export default function VideoPlayer({
  videoUrl,
  title = 'Video',
  locale = 'en',
  subtitleUrlEn,
  subtitleUrlAr,
  className = '',
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract video ID and determine platform
  const getVideoEmbedUrl = (url: string): { embedUrl: string; platform: 'youtube' | 'vimeo' | 'unknown' } => {
    try {
      // YouTube patterns
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      
      if (youtubeMatch && youtubeMatch[1]) {
        const videoId = youtubeMatch[1];
        // Add parameters for better experience
        const params = new URLSearchParams({
          autoplay: '0',
          modestbranding: '1',
          rel: '0',
          cc_load_policy: '1', // Enable captions by default
          cc_lang_pref: locale, // Set caption language preference
        });
        
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
          platform: 'youtube',
        };
      }

      // Vimeo patterns
      const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
      const vimeoMatch = url.match(vimeoRegex);
      
      if (vimeoMatch && vimeoMatch[1]) {
        const videoId = vimeoMatch[1];
        // Add parameters for Vimeo
        const params = new URLSearchParams({
          title: '0',
          byline: '0',
          portrait: '0',
          texttrack: locale, // Set subtitle language
        });
        
        return {
          embedUrl: `https://player.vimeo.com/video/${videoId}?${params.toString()}`,
          platform: 'vimeo',
        };
      }

      return { embedUrl: '', platform: 'unknown' };
    } catch (err) {
      console.error('Error parsing video URL:', err);
      return { embedUrl: '', platform: 'unknown' };
    }
  };

  const { embedUrl, platform } = getVideoEmbedUrl(videoUrl);

  // Handle unsupported video URLs
  if (!embedUrl || platform === 'unknown') {
    return (
      <div className={`w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-8 text-center ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'ar' ? 'تنسيق فيديو غير مدعوم' : 'Unsupported video format'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {locale === 'ar' ? 'يُرجى استخدام رابط YouTube أو Vimeo' : 'Please use a YouTube or Vimeo link'}
        </p>
      </div>
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(locale === 'ar' ? 'فشل تحميل الفيديو' : 'Failed to load video');
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {locale === 'ar' ? 'جاري تحميل الفيديو...' : 'Loading video...'}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <p className="text-sm text-gray-500 mt-2">{videoUrl}</p>
            </div>
          </div>
        )}

        {/* Video iframe */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      </div>

      {/* Subtitle information (informational only, actual subtitles handled by platform) */}
      {(subtitleUrlEn || subtitleUrlAr) && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {locale === 'ar' ? 'الترجمة متاحة' : 'Subtitles available'}
        </div>
      )}
    </div>
  );
}

