'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { VideoModal } from './VideoModal';

interface Video {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
}

interface VideoCarouselProps {
  videos: Video[];
  locale: 'en' | 'ar';
  onVideoSelect?: (video: Video) => void;
}

/**
 * VideoCarousel Component
 * 
 * A 3D coverflow-style carousel for displaying videos.
 * Features:
 * - Apple-style 3D perspective effect
 * - Center video is prominent, side videos rotate and shrink
 * - Smooth animations and transitions
 * - Play button overlay
 * - Video duration display
 * - Responsive design
 */
export function VideoCarousel({ videos, locale, onVideoSelect }: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(videos.length / 2));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar';

  // Calculate visible videos (show up to 5 at a time)
  const visibleCount = Math.min(videos.length, 5);
  const halfVisible = Math.floor(visibleCount / 2);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, videos.length]);

  const navigateNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const navigatePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const handleVideoClick = (video: Video, index: number) => {
    if (index === activeIndex) {
      // Center video clicked - open modal
      setSelectedVideo(video);
      setIsModalOpen(true);
      onVideoSelect?.(video);
    } else {
      // Side video clicked - navigate to it
      setActiveIndex(index);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        isRTL ? navigateNext() : navigatePrev();
      } else {
        isRTL ? navigatePrev() : navigateNext();
      }
    }
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return '/placeholder-video.jpg';
  };

  // Calculate transform for each video card
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    // Base values
    let translateX = diff * 230;
    let translateZ = -absDiff * 150;
    let rotateY = diff * -20;
    let scale = 1 - absDiff * 0.15;
    let opacity = 1 - absDiff * 0.3;
    let zIndex = videos.length - absDiff;

    // Clamp values for distant cards
    if (absDiff > halfVisible) {
      opacity = 0;
      scale = 0.5;
    }

    // RTL adjustments
    if (isRTL) {
      translateX = -translateX;
      rotateY = -rotateY;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {locale === 'ar' ? 'لا توجد فيديوهات متاحة' : 'No videos available'}
      </div>
    );
  }

  // For single video, show it centered without carousel
  if (videos.length === 1) {
    const video = videos[0];
    return (
      <div className="flex flex-col items-center">
        <motion.div
          className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            setSelectedVideo(video);
            setIsModalOpen(true);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl)}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-8 h-8 text-[#0041A8] ml-1" fill="currentColor" />
            </motion.div>
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              <span>{video.duration}</span>
            </div>
          )}
        </motion.div>

        {/* Video Info */}
        <div className="mt-4 text-center">
          <h4 className="text-xl font-bold text-gray-900">{video.title}</h4>
          {video.description && (
            <p className="text-gray-600 mt-2 max-w-xl">{video.description}</p>
          )}
        </div>

        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={selectedVideo?.videoUrl}
          title={selectedVideo?.title}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full py-4">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative h-[380px] flex items-center justify-center"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <AnimatePresence mode="popLayout">
            {videos.map((video, index) => {
              const style = getCardStyle(index);
              const isCenter = index === activeIndex;
              const thumbnail = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl);

              return (
                <motion.div
                  key={video.id}
                  className={`absolute w-[400px] aspect-video rounded-2xl overflow-hidden cursor-pointer ${
                    isCenter ? 'shadow-2xl' : 'shadow-xl'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: style.zIndex,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    transform: style.transform,
                    opacity: style.opacity,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => handleVideoClick(video, index)}
                  whileHover={isCenter ? { scale: 1.05 } : {}}
                >
                  {/* Thumbnail */}
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to hqdefault if maxresdefault fails
                      const videoId = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                      if (videoId && !e.currentTarget.src.includes('hqdefault')) {
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity ${
                    isCenter ? 'opacity-100' : 'opacity-60'
                  }`} />

                  {/* Play Button - Only visible on center card */}
                  {isCenter && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl backdrop-blur-sm"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Play className="w-7 h-7 text-[#0041A8] ml-1" fill="currentColor" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>
                  )}

                  {/* Glow effect for center card */}
                  {isCenter && (
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#0041A8]/30 via-[#007BFF]/30 to-[#0041A8]/30 -z-10 blur-xl opacity-60" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {videos.length > 1 && (
        <>
          <button
            onClick={isRTL ? navigateNext : navigatePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#0041A8] hover:bg-white hover:scale-110 transition-all z-20 border border-gray-100"
            aria-label={locale === 'ar' ? 'الفيديو التالي' : 'Previous video'}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={isRTL ? navigatePrev : navigateNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#0041A8] hover:bg-white hover:scale-110 transition-all z-20 border border-gray-100"
            aria-label={locale === 'ar' ? 'الفيديو السابق' : 'Next video'}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Video Info - Below Carousel */}
      <motion.div
        key={activeIndex}
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="text-xl font-bold text-gray-900">
          {videos[activeIndex]?.title}
        </h4>
        {videos[activeIndex]?.description && (
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            {videos[activeIndex].description}
          </p>
        )}
      </motion.div>

      {/* Dot Indicators */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-[#0041A8] w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${locale === 'ar' ? 'اذهب للفيديو' : 'Go to video'} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={selectedVideo?.videoUrl}
        title={selectedVideo?.title}
        locale={locale}
      />
    </div>
  );
}

export default VideoCarousel;

