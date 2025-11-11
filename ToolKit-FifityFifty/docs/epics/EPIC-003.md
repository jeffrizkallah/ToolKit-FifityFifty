# EPIC 3: Core Pages & Navigation

**Epic ID:** EPIC-003  
**Epic Goal:** Build all main user-facing pages including landing page, phase pages, module pages, and navigation.  
**Priority:** High  
**Phase:** MVP (Week 2-3)  
**Story Points:** 42  
**Owner:** Frontend Team

## Description

Implement the complete user journey from landing page through phase selection to individual module pages. Build hero section, six-phase timeline visualization, testimonials slider, phase detail pages with module cards, module detail pages with videos and resources, breadcrumb navigation, and header/footer components. This epic delivers the core user experience.

## Key Deliverables

- Landing page with hero banner and CTAs
- Six-phase interactive timeline component
- Testimonials carousel
- Header with navigation and language toggle
- Footer with links and branding
- Phase detail page (dynamic route: `/[locale]/phase/[slug]`)
- Module card component
- Module detail page (dynamic route: `/[locale]/phase/[phaseSlug]/module/[moduleSlug]`)
- Breadcrumb navigation
- 404 and error pages

## Success Criteria

- Complete user flow: Home → Phase → Module → Resource Download
- All pages responsive (mobile and desktop)
- Smooth animations (Framer Motion)
- Loading states for async content
- All pages bilingual (EN/AR) with proper RTL
- ISR enabled for all dynamic pages
- Page load time < 2 seconds

## Dependencies

EPIC-001 (Foundation), EPIC-002 (CMS)

## Related User Stories

- US3.1: Landing Page Layout & Hero Section
- US3.2: Six-Phase Timeline Component
- US3.3: Hero Video Modal
- US3.4: Testimonials Slider
- US3.5: Header Navigation Component
- US3.6: Footer Component
- US3.7: Phase Detail Page Template
- US3.8: Module Card Component
- US3.9: Module Detail Page Template
- US3.10: Breadcrumb Navigation
- US3.11: 404 & Error Pages

## Technical Notes

- Consolidates old EPIC-005 (Landing Page) and EPIC-006 (Phase/Module Pages)
- Six phases: Discovery, Strategy, Team Building, Messaging, Outreach, Sustainability
- Each phase has 4-6 topic modules
- Use Next.js dynamic routes with ISR
- Implement skeleton loaders for better UX

