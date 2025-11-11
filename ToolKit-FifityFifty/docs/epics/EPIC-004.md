# EPIC 4: Media & Resource Management

**Epic ID:** EPIC-004  
**Epic Goal:** Implement video embeds, file storage, and resource download functionality.  
**Priority:** High  
**Phase:** MVP (Week 3)  
**Story Points:** 20  
**Owner:** Frontend & Backend Team

## Description

Build video player components for embedded 2-minute educational videos with bilingual subtitles. Set up file storage for downloadable resources (PDFs, Excel templates, checklists). Implement resource download tracking and image optimization across the site.

## Key Deliverables

- Video player component (YouTube/Vimeo embeds)
- Bilingual subtitle support
- File storage setup (S3-compatible or Cloudinary)
- Resource download component
- Download tracking (analytics)
- Image optimization with next/image
- Resource library page (optional: can be Phase 2)

## Success Criteria

- Videos play smoothly on all devices
- Subtitles available in English and Arabic
- Resources downloadable from module pages
- Image optimization reduces page weight
- Download events tracked in analytics
- Lazy loading implemented for videos and images

## Dependencies

EPIC-002 (CMS), EPIC-003 (Core Pages)

## Related User Stories

- US4.1: Video Player Component (YouTube/Vimeo)
- US4.2: Bilingual Subtitle Support
- US4.3: File Storage Setup (S3/Cloudinary)
- US4.4: Resource Download Component
- US4.5: Download Tracking Integration
- US4.6: Image Optimization

## Technical Notes

- Consolidates old EPIC-009 (Media Management) and parts of EPIC-012 (Resource Library)
- Use YouTube or Vimeo for video hosting (no need for self-hosting)
- Store PDFs/Excel files in S3-compatible storage
- Track downloads via GA4 events
- Implement lazy loading for better performance

