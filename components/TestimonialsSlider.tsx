'use client';

/**
 * TestimonialsSlider Component
 * 
 * Implements US3.4 - Testimonials Slider
 * A rotating carousel displaying testimonials from successful campaign candidates.
 * Features auto-play with manual controls and CMS integration.
 */

import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Testimonial } from '@/lib/types/cms';
import { getMediaUrl } from '@/lib/cms-client';
import { Button } from '@/components/ui/button';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  locale: 'en' | 'ar';
}

export function TestimonialsSlider({ testimonials, locale }: TestimonialsSliderProps) {
  const isRTL = locale === 'ar';
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      direction: isRTL ? 'rtl' : 'ltr',
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'ar' ? 'قصص النجاح' : 'Success Stories'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'اكتشف كيف أحدث قادة المجتمع تغييراً إيجابياً في مجتمعاتهم'
              : 'Discover how community leaders have made a positive impact in their communities'}
          </p>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => {
                const photoUrl = testimonial.attributes.photo?.data?.attributes?.url;
                const fullPhotoUrl = photoUrl ? getMediaUrl(photoUrl) : null;

                return (
                  <div
                    key={testimonial.id}
                    className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col">
                      {/* Photo */}
                      {fullPhotoUrl && (
                        <div className="mb-6 flex justify-center">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden">
                            <Image
                              src={fullPhotoUrl}
                              alt={testimonial.attributes.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        </div>
                      )}

                      {/* Quote */}
                      <blockquote className="flex-1 mb-6">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          "{testimonial.attributes.quote}"
                        </p>
                      </blockquote>

                      {/* Attribution */}
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {testimonial.attributes.name}
                        </p>
                        {testimonial.attributes.role && (
                          <p className="text-sm text-gray-600">
                            {testimonial.attributes.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="rounded-full"
              aria-label={locale === 'ar' ? 'السابق' : 'Previous'}
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="rounded-full"
              aria-label={locale === 'ar' ? 'التالي' : 'Next'}
            >
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

