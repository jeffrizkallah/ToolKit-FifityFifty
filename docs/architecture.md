# Architecture --- FiftyFifty x UN Women Campaign Toolkit

## 1) Goals

-   Fast, accessible, bilingual toolkit.
-   Simple CMS for non-technical editors.
-   Easy video + resource publishing.
-   Low maintenance, secure, scalable.

## 2) High-Level Design

-   **Frontend:** Next.js (App Router) + Tailwind + shadcn/ui + Framer
    Motion.
-   **i18n + RTL:** next-intl or next-i18next with logical CSS props.
-   **CMS:** Strapi or WordPress (headless).
-   **Media:** YouTube/Vimeo for videos, S3-compatible storage for
    resources.
-   **Hosting:** Vercel (frontend), Render/Hetzner/Hostinger (CMS).
-   **Analytics:** GA4.
-   **Search:** Client filter; optional Algolia.
-   **Auth:** Public site; admin auth in CMS only.

## 3) Content Model (CMS)

**Entities:** - Phase → Modules - Module → Resources - Resource →
(Checklist \| Template \| Law \| Guide) - Testimonial → (Name, Quote,
Photo) - Setting → Brand colors, footer links

## 4) API Shape (CMS → Frontend)

-   Base: `https://cms.fiftyfifty.org/api`
-   `GET /phases?populate=modules.modules,resources`
-   `GET /modules/:slug?populate=resources`
-   Localization via `?locale=en|ar`
-   ISR revalidation every 5--15 min

## 5) Frontend Structure

    /app
      /[locale]/toolkit
        /[phaseSlug]/[moduleSlug]
      /api/revalidate
    /components
      PhaseCard, ModuleCard, VideoPlayer, ResourceList
    /lib
      cms.ts, i18n.ts, rtl.ts
    /styles
      globals.css

Uses Next.js App Router, ISR, and Tailwind with RTL plugin.

## 6) Internationalization + RTL

-   Locales: `en`, `ar`
-   Direction: `<html dir="ltr|rtl">`
-   Tailwind RTL plugin for mirroring
-   JSON translation files
-   SEO hreflang + localized meta

## 7) Accessibility

-   WCAG 2.1 AA compliant
-   Subtitles on all videos
-   Keyboard navigation
-   Semantic headings
-   ARIA labels for UI components

## 8) Performance

-   ISR, caching, lazy loading, and optimized images.
-   Lighthouse \>90 target for all metrics.

## 9) Security

-   HTTPS only
-   CMS MFA + IP restriction
-   File validation for uploads
-   Role-based access: Admin, Editor, Author, Reviewer

## 10) Deployment

-   **Frontend:** Vercel
-   **CMS:** Strapi Cloud or Managed WordPress
-   **Storage:** S3-compatible
-   **Domain:** fiftyfiftylb.org/toolkit

## 11) CI/CD

-   GitHub → Vercel Preview + Production
-   ESLint, TypeScript strict mode
-   Playwright + Axe tests for a11y

## 12) Observability

-   GA4, Vercel Analytics, Sentry, Better Stack

## 13) Data & Backup

-   Daily CMS DB backup
-   Object storage versioning
-   Quarterly export of resources CSV

## 14) SEO

-   Clean URLs, localized Open Graph + JSON-LD
-   Example: `/en/toolkit/pre-campaign/social-media`

## 15) Privacy

-   Cookie banner (analytics only)
-   Privacy + Terms pages

## 16) Risks

  Risk              Mitigation
  ----------------- -----------------------
  Content delays    Use placeholders
  Video lag         Batch production
  RTL regressions   Visual snapshot tests

## 17) Delivery (Tech)

-   MVP → Static pages + CMS fetch, bilingual + a11y
-   Post-Launch → Progress tracker, search, analytics
-   Future → AI helper, accounts, badges

## 18) Env Vars

    NEXT_PUBLIC_SITE_URL=
    CMS_BASE_URL=
    CMS_API_TOKEN=
    NEXT_PUBLIC_GA_ID=
    REVALIDATE_SECRET=
    STORAGE_BUCKET_URL=

## 19) Webhook Revalidation

CMS POST → `/api/revalidate` with `{secret, slug, locale}`

## 20) Handoff Checklist

-   CMS ready + content types created
-   Example content (EN/AR)
-   Webhook verified
-   Analytics working
-   A11y test passed
-   Editors trained
