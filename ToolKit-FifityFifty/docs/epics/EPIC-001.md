# EPIC 1: Project Foundation

**Epic ID:** EPIC-001  
**Epic Goal:** Establish the technical foundation including Next.js setup, i18n, RTL support, and deployment infrastructure.  
**Priority:** High  
**Phase:** MVP (Week 1)  
**Story Points:** 30  
**Owner:** Frontend & DevOps Team

## Description

Set up the complete foundational architecture for the toolkit, including Next.js 14+ with App Router, Tailwind CSS, shadcn/ui components, bilingual support (English/Arabic), RTL layout switching, environment configuration, and Vercel deployment. This epic consolidates frontend framework setup, internationalization, and infrastructure setup into one cohesive foundation phase.

## Key Deliverables

- Next.js 14+ project with App Router and TypeScript
- Tailwind CSS with custom design tokens (FiftyFifty brand colors)
- shadcn/ui component library integrated
- next-intl configured for English/Arabic with instant switching
- RTL layout support with automatic switching for Arabic
- Language toggle component
- Environment variables configured for dev/staging/production
- Vercel deployment pipeline with CI/CD
- GitHub repository with proper structure

## Success Criteria

- Development server runs without errors
- Language switching works instantly (EN ↔ AR)
- RTL layout displays correctly in Arabic
- Design system implements brand colors (#0063AF, #EC1C24)
- Automated deployment to Vercel working
- All environment variables documented
- Responsive layout foundation ready

## Dependencies

None

## Related User Stories

- US1.1: Environment & Configuration Setup ✅ DONE
- US1.2: GitHub Repository & Version Control
- US1.3: Next.js Project with App Router & TypeScript
- US1.4: Tailwind CSS & Design System Setup
- US1.5: shadcn/ui Component Library Integration
- US1.6: Internationalization Framework (next-intl)
- US1.7: RTL Layout Implementation & Language Toggle

## Technical Notes

- Consolidates old EPIC-001 (Infrastructure), EPIC-002 (Frontend), and EPIC-003 (i18n/RTL)
- Brand colors: Primary Blue #0063AF, Secondary Red #EC1C24
- All pages must support both LTR and RTL layouts
- Use logical CSS properties for RTL compatibility

