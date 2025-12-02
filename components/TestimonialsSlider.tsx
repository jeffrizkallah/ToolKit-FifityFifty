'use client';

/**
 * TestimonialsSlider Component
 * 
 * Implements US3.4 - Testimonials Section
 * A masonry-style grid displaying testimonials from successful campaign candidates.
 * Cards naturally fit their content height, eliminating white space.
 */

import React from 'react';
import Image from 'next/image';
import { Testimonial } from '@/lib/types/cms';
import { getMediaUrl } from '@/lib/cms-client';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  locale: 'en' | 'ar';
}

export function TestimonialsSlider({ testimonials, locale }: TestimonialsSliderProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0041A8] mb-3 tracking-tight">
            {locale === 'ar' ? 'قصص النجاح' : 'Success Stories'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-normal">
            {locale === 'ar' 
              ? 'اكتشف كيف أحدث قادة المجتمع تغييراً إيجابياً في مجتمعاتهم'
              : 'Discover how community leaders have made a positive impact in their communities'}
          </p>
        </div>

        {/* Masonry Grid */}
        <div 
          className="columns-1 sm:columns-2 lg:columns-3 gap-5"
          style={{ columnFill: 'balance' }}
        >
          {testimonials.map((testimonial) => {
            // Support both Strapi-style photo and direct photo_url
            const strapiPhotoUrl = testimonial.attributes.photo?.data?.attributes?.url;
            const directPhotoUrl = testimonial.attributes.photo_url;
            const fullPhotoUrl = strapiPhotoUrl 
              ? getMediaUrl(strapiPhotoUrl) 
              : directPhotoUrl || null;

            return (
              <div
                key={testimonial.id}
                className="break-inside-avoid mb-5"
              >
                <div className="glass-component glass-layered bg-white rounded-2xl shadow-soft hover:shadow-elevated p-6 sm:p-8 flex flex-col transition-all duration-300 border border-neutral-100 hover:border-[#0063AF]/40 hover:-translate-y-1">
                  {/* Photo and Attribution */}
                  <div className="flex items-center gap-4 pb-4 mb-4 border-b border-neutral-200">
                    {/* Avatar - Photo or Initials Fallback */}
                    {fullPhotoUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#0063AF]/20 ring-offset-2">
                        <Image
                          src={fullPhotoUrl}
                          alt={testimonial.attributes.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-[#0063AF] to-[#0041A8] flex items-center justify-center ring-2 ring-[#0063AF]/20 ring-offset-2">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.attributes.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0041A8] text-sm">
                        {testimonial.attributes.name}
                      </p>
                      {testimonial.attributes.role && (
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {testimonial.attributes.role}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <div className="mb-3 flex items-start">
                    <svg className="w-8 h-8 text-[#0063AF]/25" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Quote */}
                  <blockquote>
                    <p className="text-gray-700 text-base leading-relaxed font-normal">
                      "{testimonial.attributes.quote}"
                    </p>
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
