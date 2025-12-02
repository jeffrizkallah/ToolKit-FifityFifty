'use client';

import { HeroSection } from '@/components/HeroSection';

interface HeroClientProps {
  headline: string;
  description: string;
  videoUrl?: string;
}

export function HeroClient({ headline, description }: HeroClientProps) {
  return (
    <HeroSection
      headline={headline}
      description={description}
    />
  );
}

