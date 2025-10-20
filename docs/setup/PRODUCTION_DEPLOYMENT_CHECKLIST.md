# Production Deployment Checklist

**Story:** US5.8  
**Created:** October 17, 2025  
**Purpose:** Ensure a smooth and successful production launch of the FiftyFifty ToolKit

---

## Pre-Launch Checklist

Complete these tasks **before** deploying to production.

### 1. Environment Configuration ✅

#### Vercel Environment Variables

- [ ] `NEXT_PUBLIC_STRAPI_URL` - Production CMS URL configured
- [ ] `STRAPI_API_TOKEN` - Production API token configured (secure)
- [ ] `NEXT_PUBLIC_SITE_URL` - Production site URL configured
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics 4 ID configured
- [ ] `GOOGLE_SITE_VERIFICATION` - Google Search Console verification configured
- [ ] `REVALIDATION_SECRET` - Random secret generated and configured
- [ ] `NODE_ENV` - Set to `production`

**Verification:**
```bash
# Check environment variables in Vercel dashboard
# Settings > Environment Variables
```

#### CMS (Strapi) Configuration

- [ ] Production database configured and accessible
- [ ] API tokens created and secured
- [ ] CORS settings configured (allow production domain)
- [ ] File storage configured (S3, Cloudinary, or local)
- [ ] Admin users created with strong passwords
- [ ] Production URL configured in Strapi settings
- [ ] SSL certificate active on CMS domain

**Verification:**
```bash
# Test CMS health endpoint
curl https://your-cms-domain.com/api/_health
```

---

### 2. Content Validation ✅

#### Phase Content (All 6 Phases)

- [ ] Phase 1 content complete (title, description, modules)
- [ ] Phase 2 content complete
- [ ] Phase 3 content complete
- [ ] Phase 4 content complete
- [ ] Phase 5 content complete
- [ ] Phase 6 content complete
- [ ] All phase images uploaded and optimized
- [ ] All phase slugs are URL-friendly
- [ ] Phase order configured correctly

#### Module Content

- [ ] All modules have titles (EN & AR)
- [ ] All modules have descriptions (EN & AR)
- [ ] All modules linked to correct phases
- [ ] All module images uploaded and optimized
- [ ] All module slugs are URL-friendly
- [ ] Module order configured correctly within phases

#### Resource Content

- [ ] All resources have titles (EN & AR)
- [ ] All resources have descriptions (EN & AR)
- [ ] All resource files uploaded and accessible
- [ ] All resources linked to correct modules
- [ ] Resource types configured correctly (PDF, Video, Link, etc.)
- [ ] External resource links tested and working

#### Testimonials

- [ ] All testimonials reviewed and approved
- [ ] All testimonial photos uploaded
- [ ] All testimonials translated (EN & AR)
- [ ] Testimonial order configured

#### Site Settings

- [ ] Site title configured (EN & AR)
- [ ] Site description configured (EN & AR)
- [ ] Hero video URL configured (if applicable)
- [ ] Social media links configured
- [ ] Contact information configured
- [ ] Footer content configured

**Verification:**
```bash
# Test CMS API endpoints
curl https://your-cms.com/api/phases?locale=en
curl https://your-cms.com/api/phases?locale=ar
curl https://your-cms.com/api/modules?locale=en
curl https://your-cms.com/api/testimonials?locale=en
```

---

### 3. Translation Completeness ✅

#### English Translations
- [ ] All UI strings translated
- [ ] All CMS content in English
- [ ] No missing translation keys
- [ ] No placeholder text (Lorem ipsum)
- [ ] Grammar and spelling checked

#### Arabic Translations
- [ ] All UI strings translated
- [ ] All CMS content in Arabic
- [ ] No missing translation keys
- [ ] No placeholder text
- [ ] Grammar and spelling checked
- [ ] RTL layout tested and working

**Verification:**
```bash
# Check translation files
cat messages/en.json
cat messages/ar.json
```

---

### 4. Domain & SSL Configuration ✅

#### Custom Domain Setup

- [ ] Domain purchased/registered
- [ ] DNS records configured correctly:
  - [ ] A record or CNAME pointing to Vercel
  - [ ] Propagation complete (use `dig` or online tools)
- [ ] Domain added in Vercel dashboard
- [ ] SSL certificate auto-generated and active
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] WWW redirect configured (if applicable)

**Verification:**
```bash
# Test domain resolution
dig your-domain.com

# Test SSL certificate
curl -I https://your-domain.com

# Should return 200 OK with security headers
```

#### Subdomain for CMS (if applicable)

- [ ] CMS subdomain configured (e.g., cms.your-domain.com)
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Admin panel accessible via subdomain

---

### 5. Performance Optimization ✅

#### Lighthouse Scores (Run tests)

- [ ] Performance: >90
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

**Run Lighthouse:**
```bash
# In Chrome DevTools > Lighthouse
# Or use CLI:
npx lighthouse https://your-domain.com --view
```

#### Image Optimization

- [ ] All images compressed (WebP format preferred)
- [ ] Proper image sizes for different viewports
- [ ] Lazy loading enabled
- [ ] Alt text present on all images
- [ ] No oversized images

#### Code Optimization

- [ ] Production build created (`npm run build`)
- [ ] No console errors or warnings
- [ ] No debug code left in production
- [ ] Minification working correctly
- [ ] Bundle size optimized

**Test Build:**
```bash
npm run build
npm run start
# Test locally before deploying
```

---

### 6. SEO Configuration ✅

#### Meta Tags

- [ ] Page titles configured (all pages)
- [ ] Meta descriptions configured (all pages)
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Canonical URLs configured
- [ ] Favicon uploaded and working

#### Sitemap & Robots

- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt configured correctly
- [ ] No pages blocked unintentionally

**Verification:**
```bash
# Check sitemap
curl https://your-domain.com/sitemap.xml

# Check robots.txt
curl https://your-domain.com/robots.txt
```

#### Google Search Console

- [ ] Property added in Google Search Console
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] No indexing errors

#### Google Analytics

- [ ] GA4 property created
- [ ] Tracking ID configured
- [ ] Real-time tracking working
- [ ] Events configured and firing
- [ ] Cookie consent integrated

**Verification:**
```bash
# Check GA tracking
# Visit site and check Google Analytics Real-time reports
```

---

### 7. Security Verification ✅

#### Security Headers

- [ ] HTTPS enforced (Vercel automatic)
- [ ] HSTS header configured (in `vercel.json`)
- [ ] CSP header configured
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Security audit passed on securityheaders.com

**Test Security Headers:**
```bash
# Visit https://securityheaders.com
# Enter your domain and run scan
# Target: A or A+ rating
```

#### CMS Security

- [ ] CMS admin panel secured with strong password
- [ ] API tokens secured (not exposed in frontend)
- [ ] CORS configured correctly (only allow production domain)
- [ ] Rate limiting enabled (if available)
- [ ] Admin panel not publicly indexed

#### Environment Variables

- [ ] All secrets stored in Vercel environment variables
- [ ] No secrets committed to Git
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets different from staging

---

### 8. Webhook & Revalidation ✅

#### Webhook Setup

- [ ] Revalidation webhook endpoint created (`/api/revalidate`)
- [ ] Webhook secret configured in Vercel
- [ ] Webhook configured in Strapi CMS
- [ ] Webhook URL: `https://your-domain.com/api/revalidate`
- [ ] Webhook events configured (publish, update, delete)

**Test Webhook:**
```bash
# Make a change in CMS and publish
# Verify content updates on frontend within 1 minute
```

#### ISR (Incremental Static Regeneration)

- [ ] Revalidate times configured appropriately
- [ ] On-demand revalidation working
- [ ] Stale-while-revalidate working correctly

---

### 9. Error Handling & Monitoring ✅

#### Error Pages

- [ ] 404 page styled and working
- [ ] 500 page styled and working
- [ ] Error boundaries implemented
- [ ] Fallback content for failed API calls

#### Error Monitoring (Optional but Recommended)

- [ ] Sentry configured (or alternative)
- [ ] Error tracking working
- [ ] Error alerts configured
- [ ] Source maps uploaded

**Setup Sentry (Optional):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Logging

- [ ] Server logs accessible in Vercel dashboard
- [ ] No sensitive information logged
- [ ] Error logs include useful debugging info

---

### 10. Backup & Rollback Procedures ✅

#### Backup Procedures

- [ ] CMS database backup scheduled (daily recommended)
- [ ] File storage backup configured
- [ ] Backup restoration tested
- [ ] Backup storage secure and redundant

**Strapi Backup:**
```bash
# Database backup (example for PostgreSQL)
pg_dump -U username -d database_name > backup.sql

# File storage backup
# Copy /public/uploads folder to secure location
```

#### Rollback Procedures

- [ ] Rollback procedure documented
- [ ] Previous deployment accessible in Vercel
- [ ] Database rollback plan in place
- [ ] Team trained on rollback process

**Vercel Rollback:**
```bash
# In Vercel dashboard:
# Deployments > Previous deployment > Promote to Production
```

---

### 11. Accessibility Compliance ✅

#### WCAG 2.1 Level AA

- [ ] Color contrast meets standards (≥4.5:1)
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (NVDA, VoiceOver)
- [ ] No keyboard traps
- [ ] Skip to content link present

**Test Accessibility:**
```bash
# Use browser extensions:
# - axe DevTools
# - WAVE
# Or run Lighthouse accessibility audit
```

---

### 12. Legal & Compliance ✅

#### Privacy & Legal Pages

- [ ] Privacy Policy page published
- [ ] Privacy Policy link in footer
- [ ] Cookie consent banner working
- [ ] GDPR compliance verified
- [ ] Terms & Conditions page (if applicable)

#### Content Rights

- [ ] All images have proper licenses/permissions
- [ ] All videos have proper licenses/permissions
- [ ] Third-party content attributed correctly
- [ ] No copyright violations

---

### 13. Testing ✅

#### Manual Testing

- [ ] All pages load correctly
- [ ] All links work (internal and external)
- [ ] All forms submit correctly
- [ ] All buttons and CTAs work
- [ ] Language switcher works
- [ ] Navigation works correctly
- [ ] Search functionality works (if applicable)

#### Cross-Browser Testing

- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)
- [ ] Android Chrome

#### Mobile Testing

- [ ] Touch interactions work
- [ ] Layout responsive (320px - 428px)
- [ ] No horizontal scrolling
- [ ] Text readable without zooming
- [ ] Buttons/links large enough to tap

#### RTL (Arabic) Testing

- [ ] Layout mirrors correctly
- [ ] Text aligns to the right
- [ ] Navigation mirrors
- [ ] All components work in RTL

---

### 14. Load Testing (Optional) ✅

#### Performance Under Load

- [ ] Site tested with expected traffic volume
- [ ] API endpoints handle concurrent requests
- [ ] No performance degradation under load
- [ ] CDN caching working effectively

**Load Testing Tools:**
- Apache JMeter
- k6
- Artillery

---

## Launch Day Checklist

Execute these tasks on launch day in order.

### Phase 1: Pre-Launch (2 hours before)

- [ ] **Final content review** - All content correct and approved
- [ ] **Final build test** - Run `npm run build` locally
- [ ] **Create backup** - Database and files
- [ ] **Team notification** - Notify team of launch timeline
- [ ] **Monitor setup** - Open monitoring dashboards
- [ ] **Support ready** - Support team briefed and ready

### Phase 2: Deployment (Launch time)

- [ ] **Deploy to Vercel** - Push to production branch or trigger manual deploy
- [ ] **Verify deployment** - Check Vercel dashboard for successful deployment
- [ ] **DNS propagation** - Verify custom domain resolves correctly
- [ ] **SSL certificate** - Verify HTTPS is working
- [ ] **Smoke test** - Quick test of critical paths

**Critical Paths to Test:**
1. Homepage loads
2. Language switcher works
3. Phase navigation works
4. Module pages load
5. Resource downloads work
6. Forms submit correctly

### Phase 3: Post-Launch Monitoring (First 2 hours)

- [ ] **Monitor errors** - Check Vercel logs for errors
- [ ] **Monitor traffic** - Check Google Analytics for traffic
- [ ] **Monitor performance** - Check Lighthouse scores
- [ ] **Test user flows** - Test complete user journeys
- [ ] **Check API health** - Verify CMS API responses
- [ ] **Verify webhooks** - Test on-demand revalidation

### Phase 4: 24-Hour Monitoring

- [ ] **Check analytics** - Review traffic patterns
- [ ] **Review errors** - Check for any errors or issues
- [ ] **Performance check** - Monitor load times
- [ ] **User feedback** - Monitor any user reports
- [ ] **Backup verification** - Ensure backups are running

---

## Post-Launch Checklist (Week 1)

- [ ] **Submit to search engines** - Bing, Yahoo (Google already via Search Console)
- [ ] **Social media announcement** - Announce launch on social channels
- [ ] **Press release** - Send press release (if applicable)
- [ ] **Partner notification** - Notify partners and stakeholders
- [ ] **Monitor analytics** - Daily check of GA4 for first week
- [ ] **Monitor errors** - Daily check of error logs
- [ ] **User feedback** - Collect and review user feedback
- [ ] **Performance optimization** - Address any performance issues
- [ ] **Bug fixes** - Fix any critical bugs found

---

## Rollback Procedure

If critical issues are found post-launch:

### Step 1: Assess Severity
- **Critical**: Site down, data breach, major functionality broken → Rollback immediately
- **High**: Important feature broken, significant bugs → Fix quickly or rollback
- **Medium/Low**: Minor issues, cosmetic bugs → Fix in next deployment

### Step 2: Execute Rollback (if needed)

1. **In Vercel Dashboard:**
   - Go to Deployments
   - Find previous stable deployment
   - Click "Promote to Production"

2. **Verify Rollback:**
   - [ ] Site loads correctly
   - [ ] Previous version is live
   - [ ] No errors in logs

3. **Communicate:**
   - [ ] Notify team of rollback
   - [ ] Notify users (if necessary)
   - [ ] Document issue for post-mortem

### Step 3: Fix and Redeploy

1. Fix issues in development
2. Test thoroughly
3. Deploy to staging
4. Test on staging
5. Deploy to production
6. Monitor closely

---

## Key Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| **Project Manager** | [Name] | [Email/Phone] | Launch day + 1 week |
| **Lead Developer** | [Name] | [Email/Phone] | Launch day + 1 week |
| **QA Lead** | [Name] | [Email/Phone] | Launch day + 1 week |
| **CMS Admin** | [Name] | [Email/Phone] | Ongoing |
| **DevOps/Hosting** | [Name] | [Email/Phone] | Launch day + 1 week |
| **Support Team** | [Name] | [Email/Phone] | Ongoing |

---

## Important URLs

### Production URLs
- **Frontend**: https://your-domain.com
- **CMS**: https://cms.your-domain.com (or your CMS URL)
- **CMS Admin**: https://cms.your-domain.com/admin

### Development URLs
- **Staging**: https://staging-your-project.vercel.app
- **Development**: http://localhost:3000
- **CMS Dev**: http://localhost:1337

### Tools & Dashboards
- **Vercel Dashboard**: https://vercel.com/your-project
- **Google Analytics**: https://analytics.google.com
- **Google Search Console**: https://search.google.com/search-console
- **Security Headers Test**: https://securityheaders.com
- **Lighthouse Test**: https://pagespeed.web.dev/

---

## Documentation

### For Future Reference

- [ ] Update project README with production URLs
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Document rollback procedure
- [ ] Create runbook for common issues
- [ ] Document backup and restore procedures
- [ ] Create user guide for CMS (for content editors)

---

## Launch Announcement Template

### Internal Announcement

```
Subject: 🚀 FiftyFifty ToolKit is LIVE!

Team,

We're excited to announce that the FiftyFifty ToolKit is now live!

🌐 Website: https://your-domain.com

The site features:
- 6 comprehensive phases for social responsibility
- Bilingual support (English & Arabic)
- Responsive design for all devices
- GDPR-compliant privacy features

Thank you to everyone who contributed to this launch. Please monitor the site closely over the next 24-48 hours and report any issues to [contact].

Next steps:
- Monitor analytics and user feedback
- Address any critical bugs
- Plan for future enhancements

Great work, team! 🎉

[Your Name]
```

### Public Announcement (Social Media)

```
🚀 We're excited to announce the launch of the FiftyFifty ToolKit!

A comprehensive resource for organizations implementing social responsibility initiatives.

✨ Features:
- 6 guided phases
- Available in English & Arabic
- Resources, templates, and guides
- Mobile-friendly design

Explore now: https://your-domain.com

#SocialResponsibility #FiftyFifty #Launch
```

---

## Final Sign-Off

Before marking the launch as complete, ensure all items are checked:

- [ ] All pre-launch checklist items complete
- [ ] Launch day checklist executed successfully
- [ ] No critical errors in first 24 hours
- [ ] Analytics tracking correctly
- [ ] Team debriefed on any issues
- [ ] Post-launch monitoring plan in place

**Launched By:** ________________  
**Date:** ________________  
**Time:** ________________  
**Version:** ________________

---

## Notes

- This checklist should be completed by the deployment team
- Some items may not apply depending on your specific setup
- Adjust timelines based on your launch requirements
- Keep this document updated as procedures change
- Reference the setup guides in `docs/setup/` for detailed instructions

---

## Additional Resources

- [Vercel Setup Guide](./VERCEL_SETUP.md)
- [CMS Setup Guide](./CMS_SETUP_GUIDE.md)
- [Webhook Setup Guide](./WEBHOOK_SETUP.md)
- [Environment Variables Guide](./ENV_VARIABLES.md)
- [Quick Start Guide](./SETUP_QUICK_START.md)

---

**Document Version:** 1.0  
**Last Updated:** October 17, 2025  
**Maintained By:** Dev Team

