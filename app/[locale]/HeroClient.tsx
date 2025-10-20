'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/HeroSection';
import { analytics } from '@/components/GoogleAnalytics';

// Dynamically import VideoModal for code splitting and better performance
const VideoModal = dynamic(() => import('@/components/VideoModal').then(mod => ({ default: mod.VideoModal })), {
  ssr: false,
  loading: () => null,
});

interface HeroClientProps {
  headline: string;
  description: string;
  videoUrl?: string;
}

export function HeroClient({ headline, description, videoUrl }: HeroClientProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const params = useParams();
  const locale = params?.locale as string || 'en';

  const handleWatchVideo = () => {
    if (videoUrl) {
      setIsVideoModalOpen(true);
      // Track video play event
      analytics.trackVideoPlay(videoUrl, 'Hero Introduction Video');
      analytics.trackCTA('Watch Video', 'Hero Section');
    }
  };

  return (
    <>
      <HeroSection
        headline={headline}
        description={description}
        onWatchVideo={handleWatchVideo}
      />
      
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoUrl}
        locale={locale}
      />
    </>
  );
}

