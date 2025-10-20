# Environment Variables Documentation

This document provides detailed information about all environment variables used in the FiftyFifty Toolkit project.

## Quick Start

1. Copy `env.example` to `.env.local` in your project root
2. Fill in the required values for your environment
3. Never commit `.env.local` or any file containing actual secrets

## Environment Variables Reference

### 1. NEXT_PUBLIC_SITE_URL

**Type:** Public  
**Required:** Yes  
**Purpose:** The public URL where the frontend application is accessible

**Values by Environment:**
- **Development:** `http://localhost:3000`
- **Staging:** `https://staging.fiftyfifty.example.com`
- **Production:** `https://fiftyfifty.example.com`

**Usage:**
- SEO metadata and canonical URLs
- Open Graph and Twitter Card tags
- Sitemap generation
- Any absolute URL construction

**Notes:**
- Must NOT include trailing slash
- Should include protocol (http/https)
- Safe to be public (Next.js will embed this in client-side code)

---

### 2. CMS_BASE_URL

**Type:** Server-side  
**Required:** Yes  
**Purpose:** Base URL of the headless CMS (Strapi or WordPress)

**Values by Environment:**
- **Development:** `http://localhost:1337` (Strapi) or `http://localhost:8000` (WordPress)
- **Staging:** `https://cms-staging.fiftyfifty.example.com`
- **Production:** `https://cms.fiftyfifty.example.com`

**Usage:**
- Fetching content from CMS
- Building API endpoints for content retrieval
- Image and media URL construction

**Notes:**
- Must NOT include trailing slash
- Should include protocol (http/https)
- Used only on server-side (not exposed to client)

---

### 3. CMS_API_TOKEN

**Type:** Secret  
**Required:** Yes  
**Purpose:** Authentication token for CMS API access

**How to Generate:**

**For Strapi:**
1. Log into Strapi admin panel
2. Go to Settings → API Tokens
3. Create new API Token with appropriate permissions
4. Copy the generated token

**For WordPress:**
1. Install and configure WPGraphQL or REST API authentication plugin
2. Generate application password or JWT token
3. Copy the generated token

**Usage:**
- Authenticating server-side CMS requests
- Accessing protected content endpoints

**Security:**
- **NEVER** commit this value to version control
- Rotate regularly (recommended: every 90 days)
- Use different tokens for each environment
- Grant minimum necessary permissions

---

### 4. NEXT_PUBLIC_GA_ID

**Type:** Public  
**Required:** No (but recommended for production)  
**Purpose:** Google Analytics 4 Measurement ID

**Values by Environment:**
- **Development:** Leave empty or use test property
- **Staging:** Use staging GA4 property (e.g., `G-STAGING123`)
- **Production:** Use production GA4 property (e.g., `G-PROD456789`)

**Format:** `G-XXXXXXXXXX`

**How to Obtain:**
1. Create Google Analytics 4 property
2. Create a Data Stream for your website
3. Copy the Measurement ID (starts with "G-")

**Usage:**
- Page view tracking
- Event tracking
- User analytics
- Custom dimension tracking

**Notes:**
- Safe to be public
- Can be different for staging/production to separate analytics data

---

### 5. REVALIDATE_SECRET

**Type:** Secret  
**Required:** Yes (for production with ISR)  
**Purpose:** Secret key for triggering on-demand Incremental Static Regeneration

**How to Generate:**

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Usage:**
- Webhook endpoint authentication from CMS
- On-demand revalidation of static pages when content updates
- Example webhook: `POST /api/revalidate?secret=YOUR_SECRET&path=/toolkit`

**Security:**
- **NEVER** commit this value to version control
- Use different secrets for each environment
- Minimum 32 characters recommended
- Should be truly random

**Webhook Setup:**
Configure your CMS to call the revalidation endpoint when content changes:

```
POST https://your-site.com/api/revalidate
Body: {
  "secret": "YOUR_REVALIDATE_SECRET",
  "path": "/path/to/revalidate"
}
```

---

### 6. STORAGE_BUCKET_URL

**Type:** Public  
**Required:** Yes (if using cloud storage for resources)  
**Purpose:** Base URL for S3-compatible storage bucket containing downloadable resources

**Values by Environment:**
- **Development:** Can use staging bucket or mock data
- **Staging:** `https://fiftyfifty-staging.s3.eu-central-1.amazonaws.com`
- **Production:** `https://fiftyfifty-resources.s3.eu-central-1.amazonaws.com`

**Supported Storage Services:**
- AWS S3
- DigitalOcean Spaces
- Cloudflare R2
- Backblaze B2
- Any S3-compatible storage

**Usage:**
- Constructing URLs for downloadable PDFs
- Linking to resource files
- Media file access

**Notes:**
- Bucket should be configured for public read access
- Can use CloudFront or CDN in front of bucket
- Should NOT include trailing slash

---

## Environment Setup Instructions

### Local Development Setup

1. **Copy the template:**
   ```bash
   cp env.example .env.local
   ```

2. **Fill in development values:**
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   CMS_BASE_URL=http://localhost:1337
   CMS_API_TOKEN=your-local-cms-token
   NEXT_PUBLIC_GA_ID=
   REVALIDATE_SECRET=local-dev-secret-12345
   STORAGE_BUCKET_URL=https://dev-storage.example.com
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Vercel Deployment Setup

#### Initial Vercel Project Setup

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Link your project:**
   ```bash
   vercel link
   ```

3. **Set environment variables:**
   ```bash
   # For production
   vercel env add NEXT_PUBLIC_SITE_URL production
   vercel env add CMS_BASE_URL production
   vercel env add CMS_API_TOKEN production
   vercel env add NEXT_PUBLIC_GA_ID production
   vercel env add REVALIDATE_SECRET production
   vercel env add STORAGE_BUCKET_URL production

   # For preview (staging)
   vercel env add NEXT_PUBLIC_SITE_URL preview
   vercel env add CMS_BASE_URL preview
   vercel env add CMS_API_TOKEN preview
   vercel env add NEXT_PUBLIC_GA_ID preview
   vercel env add REVALIDATE_SECRET preview
   vercel env add STORAGE_BUCKET_URL preview
   ```

#### Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate scope:
   - **Production:** Used for production deployments
   - **Preview:** Used for PR previews and staging branch
   - **Development:** Used when running `vercel dev` locally

---

## Security Best Practices

### ✅ DO:

- Use strong, random values for secrets (minimum 32 characters)
- Rotate secrets regularly (every 90 days recommended)
- Use different secrets for each environment
- Store secrets in secure password manager
- Use Vercel's environment variable encryption
- Limit CMS token permissions to minimum necessary

### ❌ DON'T:

- Commit `.env.local`, `.env.production`, or any file with actual values
- Share secrets via email, chat, or insecure channels
- Reuse secrets across environments
- Use predictable or simple secrets
- Grant excessive permissions to API tokens

---

## Troubleshooting

### Environment variable not loading

**Problem:** Changes to `.env.local` not reflected in application

**Solution:**
1. Restart your development server (`npm run dev`)
2. Clear Next.js cache: `rm -rf .next`
3. Verify variable name doesn't have typos
4. Check that variable is properly prefixed with `NEXT_PUBLIC_` if used client-side

### CORS errors when fetching from CMS

**Problem:** Cannot fetch content from CMS due to CORS errors

**Solution:**
1. Ensure CMS_BASE_URL is correct and accessible
2. Configure CORS settings in your CMS to allow your frontend domain
3. Verify CMS is running and accessible

### Revalidation webhook not working

**Problem:** Content updates in CMS not reflected on frontend

**Solution:**
1. Verify REVALIDATE_SECRET matches in both CMS webhook and Vercel environment
2. Check webhook URL is correct: `https://your-site.com/api/revalidate`
3. Ensure webhook payload includes correct path parameter
4. Check Vercel function logs for errors

---

## Environment Variable Checklist

Use this checklist when setting up a new environment:

### Development
- [ ] NEXT_PUBLIC_SITE_URL set to `http://localhost:3000`
- [ ] CMS_BASE_URL set to local CMS instance
- [ ] CMS_API_TOKEN obtained from local CMS
- [ ] NEXT_PUBLIC_GA_ID left empty or test property
- [ ] REVALIDATE_SECRET generated
- [ ] STORAGE_BUCKET_URL set to dev/staging bucket

### Staging (Vercel Preview)
- [ ] NEXT_PUBLIC_SITE_URL set to staging domain
- [ ] CMS_BASE_URL set to staging CMS
- [ ] CMS_API_TOKEN generated for staging CMS
- [ ] NEXT_PUBLIC_GA_ID set to staging GA4 property
- [ ] REVALIDATE_SECRET generated (unique)
- [ ] STORAGE_BUCKET_URL set to staging bucket
- [ ] CMS webhook configured with staging URL

### Production (Vercel Production)
- [ ] NEXT_PUBLIC_SITE_URL set to production domain
- [ ] CMS_BASE_URL set to production CMS
- [ ] CMS_API_TOKEN generated for production CMS (minimum permissions)
- [ ] NEXT_PUBLIC_GA_ID set to production GA4 property
- [ ] REVALIDATE_SECRET generated (strong, unique)
- [ ] STORAGE_BUCKET_URL set to production bucket
- [ ] CMS webhook configured with production URL
- [ ] All secrets stored in password manager
- [ ] Security audit completed

---

## Related Documentation

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Strapi API Tokens](https://docs.strapi.io/user-docs/settings/API-tokens)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)

---

**Last Updated:** 2025-10-08  
**Maintained By:** DevOps Team

