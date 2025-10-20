'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  locale: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title, locale }: VideoModalProps) {
  const [embedUrl, setEmbedUrl] = useState<string>('');

  useEffect(() => {
    if (!videoUrl) return;

    // Convert YouTube/Vimeo URLs to embed format
    let url = videoUrl;
    
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }
    
    // Vimeo
    else if (videoUrl.includes('vimeo.com')) {
      const videoId = extractVimeoId(videoUrl);
      if (videoId) {
        url = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
    }

    setEmbedUrl(url);
  }, [videoUrl]);

  // Reset embed URL when modal closes to stop video
  useEffect(() => {
    if (!isOpen) {
      // Small delay to ensure smooth close animation
      const timer = setTimeout(() => {
        setEmbedUrl('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const defaultTitle = locale === 'ar' 
    ? 'شاهد الفيديو التعريفي'
    : 'Watch Introduction Video';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{title || defaultTitle}</DialogTitle>
          <DialogDescription>
            {locale === 'ar' 
              ? 'فيديو تعريفي حول مجموعة أدوات FiftyFifty'
              : 'Introduction video about FiftyFifty ToolKit'
            }
          </DialogDescription>
        </DialogHeader>
        
        {embedUrl && (
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || defaultTitle}
            />
          </div>
        )}

        {!embedUrl && videoUrl && (
          <div className="p-12 text-center">
            <p className="text-gray-600">
              {locale === 'ar' 
                ? 'جاري تحميل الفيديو...'
                : 'Loading video...'
              }
            </p>
          </div>
        )}

        {!videoUrl && (
          <div className="p-12 text-center">
            <p className="text-gray-600">
              {locale === 'ar' 
                ? 'رابط الفيديو غير متوفر'
                : 'Video URL not available'
              }
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Helper function to extract Vimeo video ID
function extractVimeoId(url: string): string | null {
  const pattern = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(pattern);
  return match && match[1] ? match[1] : null;
}

