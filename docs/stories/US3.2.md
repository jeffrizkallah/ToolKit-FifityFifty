# US3.2: Six-Phase Timeline Component

**Story ID:** US3.2  
**Epic:** EPIC-003 (Core Pages & Navigation)  
**Story Points:** 8  
**Priority:** High  
**Dependencies:** US3.1, US2.6  
**Status:** ✅ Approved

## User Story

**As a** Visitor  
**I want to** see an interactive timeline of the 6 campaign phases  
**So that** I can understand the journey and select a phase to explore

## Acceptance Criteria

- [x] Timeline component created displaying 6 phases
- [x] Phases fetched from CMS
- [x] Horizontal scroll or grid layout (responsive)
- [x] Hover effects on phase cards
- [x] Click navigates to phase detail page
- [x] Phase numbers and titles displayed
- [x] Animation on scroll into view
- [x] Works in both LTR and RTL layouts

## Technical Notes

- Component location: `/components/Timeline.tsx`
- Use Framer Motion for hover animations
- Consider horizontal scroll on mobile, grid on desktop
- Each phase card shows: number, title, brief description

## Implementation Summary

Created an interactive, responsive timeline component that displays all 6 phases with smooth animations and hover effects.

### Deliverables

1. **PhaseCard Component** (`components/PhaseCard.tsx`):
   - Individual phase card with hover animations
   - Phase number badge in top-right corner
   - Gradient overlay on hover
   - Smooth transitions and animations
   - Click navigates to phase detail page (`/[locale]/phases/[slug]`)
   - RTL support for Arabic layout
   - "Explore More" CTA with directional arrow
   - HTML stripping for description preview (150 chars)

2. **Timeline Component** (`components/Timeline.tsx`):
   - Server-side component fetching phases from CMS
   - Responsive grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
   - Section header with bilingual title and description
   - Phases automatically sorted by order attribute
   - Callout text encouraging exploration
   - Light gray background for visual separation

3. **Updated Landing Page** (`app/[locale]/page.tsx`):
   - Integrated Timeline component with phases data
   - Fetches phases from CMS with locale support
   - Smooth scroll anchor point maintained (`#phases-timeline`)

### Technical Highlights

- **Animations**: 
  - Staggered fade-in on scroll using Framer Motion
  - Each card animates with 0.1s delay between them
  - Viewport intersection observer for performance
  - Hover effects with scale and shadow transitions

- **Responsive Design**:
  - Mobile-first approach
  - Grid system adapts to screen size
  - Cards maintain consistent height
  - Touch-friendly on mobile devices

- **Accessibility**:
  - Semantic HTML with proper heading hierarchy
  - Link component for better navigation
  - High contrast text and interactive elements
  - Keyboard navigation support

- **RTL Support**:
  - Arrow icon direction reverses for Arabic
  - Text alignment handled by Tailwind RTL utilities
  - Layout mirrors correctly in RTL mode

### Visual Design

- Purple/Indigo gradient theme matching hero section
- Card elevation increases on hover
- Phase number badge in gradient colors
- Clean, modern card design with subtle borders
- Professional spacing and typography

## QA Review

**Review Date:** 2025-10-17  
**Reviewed By:** QA Agent  
**Result:** ✅ APPROVED

### Test Results

All acceptance criteria verified and passed:

1. ✅ **Timeline component created displaying 6 phases** - Verified in `components/Timeline.tsx`:
   - Server component that renders phase grid
   - Section header with bilingual titles
   - Maps through phases array to render PhaseCard components
   - Journey callout at bottom

2. ✅ **Phases fetched from CMS** - Verified integration:
   - `app/[locale]/page.tsx` calls `getPhases({ locale: validLocale })`
   - Phases passed as prop to Timeline component
   - Locale-specific content fetching
   - Proper data flow from CMS → Page → Timeline → PhaseCard

3. ✅ **Responsive grid layout** - Verified in Timeline.tsx line 30:
   - Grid system: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
   - Mobile: 1 column (stacked)
   - Tablet: 2 columns
   - Desktop: 3 columns
   - Gap-8 for consistent spacing

4. ✅ **Hover effects on phase cards** - Verified in PhaseCard.tsx:
   - Shadow effect: `hover:shadow-2xl`
   - Border highlight: `hover:border-purple-500`
   - Background gradient overlay: `from-purple-50 to-indigo-50`
   - Title color change: `group-hover:text-purple-700`
   - Arrow translation: `group-hover:translate-x-2`
   - All transitions smooth: `transition-all duration-300`

5. ✅ **Click navigates to phase detail page** - Verified in PhaseCard.tsx line 29:
   - Next.js Link component wraps entire card
   - URL structure: `/${locale}/phases/${slug}`
   - Examples: `/en/phases/discovery`, `/ar/phases/strategy`
   - Cursor pointer on hover
   - Proper locale preservation in navigation

6. ✅ **Phase numbers and titles displayed** - Verified:
   - Phase number badge in top-right corner (lines 32-34)
   - Gradient background: `from-purple-600 to-indigo-600`
   - Large, bold number: `text-2xl font-bold`
   - Title as h3 heading: `text-2xl font-bold mb-3`
   - Description preview (150 chars, HTML stripped)

7. ✅ **Animation on scroll into view** - Verified Framer Motion implementation (lines 23-27):
   - `whileInView` trigger for viewport intersection
   - Initial state: `opacity: 0, y: 50` (hidden, below)
   - Animated state: `opacity: 1, y: 0` (visible, in position)
   - Staggered delays: `index * 0.1` (0s, 0.1s, 0.2s, etc.)
   - Viewport once: true (animation happens once)
   - Margin: -100px (triggers slightly before visible)

8. ✅ **Works in both LTR and RTL layouts** - Verified:
   - Arrow icon direction: Rotates 180° for Arabic (line 58)
   - Text translations: "Explore More" / "استكشف المزيد" (lines 54-55)
   - Arrow margin switches: `ml-2` for LTR, `mr-2` for RTL
   - Section titles bilingual (lines 18-26)
   - Layout mirrors correctly with Tailwind RTL utilities

### Component Verification

**Timeline.tsx:**
- ✅ Server component (no 'use client')
- ✅ Phases sorting by order attribute (line 11)
- ✅ Bilingual section header
- ✅ Responsive grid layout
- ✅ Maps phases with proper key={phase.id}
- ✅ Passes all required props to PhaseCard
- ✅ Journey callout with bilingual text
- ✅ Light gray background for visual separation

**PhaseCard.tsx:**
- ✅ Client component with 'use client' directive
- ✅ Framer Motion animations
- ✅ shadcn/ui Card component
- ✅ Next.js Link for navigation
- ✅ HTML stripping function for description preview
- ✅ Phase number badge positioned absolutely
- ✅ Gradient hover overlay
- ✅ RTL-aware arrow icon
- ✅ Smooth transitions and transforms
- ✅ Accessible card structure

### Quality Assessment

- **Code Quality**: Excellent - Clean, well-structured components
- **Animations**: Smooth - Proper Framer Motion implementation with viewport observers
- **Responsive Design**: Perfect - Works seamlessly across all screen sizes
- **Accessibility**: Good - Semantic HTML, proper heading hierarchy, keyboard navigation
- **i18n**: Complete - Full bilingual support with RTL awareness
- **Performance**: Optimized - Viewport intersection for animation triggering
- **UX**: Excellent - Clear visual hierarchy, engaging hover effects, intuitive navigation

### Visual Design Verification

- ✅ Purple/Indigo gradient theme consistent with hero
- ✅ Phase number badges visually prominent
- ✅ Card elevation and shadows create depth
- ✅ Hover states provide clear affordance
- ✅ Professional spacing and typography
- ✅ High contrast for readability

### Recommendation

**APPROVE** - Timeline and PhaseCard components are production-ready. All 8 acceptance criteria met with excellent implementation quality.

## Story Status History

| Date | Status | Updated By | Notes |
|------|--------|------------|-------|
| 2025-10-17 | In Progress | Dev Agent | Started implementation |
| 2025-10-17 | Ready to Review by QA | Dev Agent | Implementation complete - all AC met |
| 2025-10-17 | Approved | QA Agent | All 8 acceptance criteria verified - production ready |


