# EPIC 2: CMS Integration & Content Architecture

**Epic ID:** EPIC-002  
**Epic Goal:** Set up headless CMS and implement content models for phases, modules, resources, and testimonials.  
**Priority:** High  
**Phase:** MVP (Week 1-2)  
**Story Points:** 28  
**Owner:** Backend & Frontend Team

## Description

Deploy and configure headless CMS (Strapi or WordPress) with all required content types and bilingual support. Create content models for the 6-phase campaign structure, implement API client library with TypeScript types, and set up webhook for automatic content revalidation. This provides the content backbone for the entire toolkit.

## Key Deliverables

- Headless CMS deployed (Strapi or WordPress)
- Content types: Phase, Module, Resource, Testimonial, Settings
- Bilingual content support (English/Arabic fields)
- TypeScript API client library
- Webhook for ISR revalidation
- Sample content loaded (at least 1 complete phase)
- API endpoints documented

## Success Criteria

- All content types created and tested
- CMS accessible and secure (admin authentication working)
- API endpoints return properly formatted data
- Frontend can fetch and display CMS content
- Webhook triggers revalidation successfully
- Content can be edited in both English and Arabic

## Dependencies

EPIC-001 (Project Foundation)

## Related User Stories

- US2.1: CMS Platform Deployment (Strapi/WordPress)
- US2.2: Content Model - Phase
- US2.3: Content Model - Module (Topics)
- US2.4: Content Model - Resource
- US2.5: Content Model - Testimonial & Settings
- US2.6: TypeScript API Client Library
- US2.7: Webhook for Content Revalidation
- US2.8: Sample Content Population

## Technical Notes

- Consolidates old EPIC-004 (CMS Integration) and parts of EPIC-014 (Admin Experience)
- Phase structure: 6 phases, each with 4-6 modules
- Each module contains: video URL, key takeaways, downloadable resources
- Use Strapi for easier customization or WordPress headless for familiarity
- Implement ISR (Incremental Static Regeneration) with on-demand revalidation

