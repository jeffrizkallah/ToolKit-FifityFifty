# Vercel Setup & Deployment Guide

This guide walks you through setting up the FiftyFifty Toolkit project on Vercel for hosting and deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Vercel Project Setup](#initial-vercel-project-setup)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Branch Deployment Strategy](#branch-deployment-strategy)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub repository created and accessible
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Node.js 18.x or higher installed locally
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] All required environment variable values ready (see [ENV_VARIABLES.md](./ENV_VARIABLES.md))

---

## Initial Vercel Project Setup

### Option 1: Via Vercel Dashboard (Recommended for First-Time Setup)

1. **Log in to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard
   - Sign in with GitHub (recommended for automatic integration)

2. **Import Git Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `fiftyfifty-toolkit`
   - Vercel will automatically detect Next.js framework

3. **Configure Build Settings**
   
   Vercel should auto-detect these settings for Next.js:
   
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (or auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (or auto-detected)
   ```

4. **Set Environment Variables**
   
   Before deploying, add all required environment variables (see [Environment Variables Configuration](#environment-variables-configuration) section below)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - First deployment URL: `https://fiftyfifty-toolkit-[hash].vercel.app`

### Option 2: Via Vercel CLI

```bash
# Navigate to your project directory
cd /path/to/fiftyfifty-toolkit

# Login to Vercel
vercel login

# Link project (or create new)
vercel link

# Deploy to production
vercel --prod
```

---

## Environment Variables Configuration

### Setting Environment Variables in Vercel Dashboard

1. **Navigate to Project Settings**
   - Go to your project in Vercel Dashboard
   - Click "Settings" tab
   - Select "Environment Variables" from sidebar

2. **Add Variables for Each Environment**

   For each variable listed in [ENV_VARIABLES.md](./ENV_VARIABLES.md), add three versions:

   | Variable Name | Production Value | Preview Value | Development Value |
   |---------------|------------------|---------------|-------------------|
   | NEXT_PUBLIC_SITE_URL | `https://fiftyfifty.com` | `https://staging.fiftyfifty.com` | `http://localhost:3000` |
   | CMS_BASE_URL | `https://cms.fiftyfifty.com` | `https://cms-staging.fiftyfifty.com` | `http://localhost:1337` |
   | CMS_API_TOKEN | `prod_token_xxxxx` | `staging_token_xxxxx` | `dev_token_xxxxx` |
   | NEXT_PUBLIC_GA_ID | `G-PROD123456` | `G-STAGING123456` | _(empty)_ |
   | REVALIDATE_SECRET | `[32-char random]` | `[different 32-char]` | `dev-secret-local` |
   | STORAGE_BUCKET_URL | `https://prod-bucket.s3...` | `https://staging-bucket.s3...` | `https://dev-bucket.s3...` |

3. **Environment Scopes**
   
   - ✅ **Production**: Used for production branch (usually `main`)
   - ✅ **Preview**: Used for pull requests and preview branches
   - ✅ **Development**: Used when running `vercel dev` locally

### Setting Environment Variables via CLI

```bash
# Add a production environment variable
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter the value when prompted

# Add a preview environment variable
vercel env add NEXT_PUBLIC_SITE_URL preview

# Add a development environment variable
vercel env add NEXT_PUBLIC_SITE_URL development

# List all environment variables
vercel env ls

# Pull environment variables to local .env file (for development)
vercel env pull .env.local
```

### Bulk Import Environment Variables

Create a `.env.production`, `.env.preview`, and `.env.development` file locally (temporarily, DO NOT COMMIT), then:

```bash
# Import production variables
vercel env add < .env.production production

# Import preview variables
vercel env add < .env.preview preview

# Import development variables
vercel env add < .env.development development

# Remember to delete these files after import!
rm .env.production .env.preview .env.development
```

---

## Branch Deployment Strategy

### Recommended Git Workflow

```
main (production)
  ├── develop (staging/preview)
  │   ├── feature/new-feature
  │   └── bugfix/fix-issue
  └── hotfix/critical-fix
```

### Branch → Environment Mapping

| Branch | Environment | Vercel Deployment | Domain |
|--------|-------------|-------------------|---------|
| `main` | Production | Production deployment | `fiftyfifty.com` |
| `develop` | Staging | Preview deployment | `develop.fiftyfifty.vercel.app` |
| `feature/*` | Preview | Preview deployment | `feature-[name].fiftyfifty.vercel.app` |
| Pull Requests | Preview | Preview deployment | `pr-[number].fiftyfifty.vercel.app` |

### Configure Production Branch

1. Go to Project Settings → Git
2. Set "Production Branch": `main`
3. Enable "Automatic deployments from Git"
4. Enable "Deploy Previews" for pull requests

### Configure Preview Branches

Vercel automatically creates preview deployments for:
- All pull requests
- All branches (configurable)

To limit preview deployments:
1. Go to Project Settings → Git
2. Under "Ignored Build Step", add custom logic:

```bash
#!/bin/bash

# Only build main, develop, and feature branches
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == "develop" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == feature/* ]]; then
  exit 1
fi

exit 0
```

---

## Custom Domain Configuration

### Adding a Custom Domain

1. **Purchase Domain** (if not already owned)
   - Recommended registrars: Namecheap, Google Domains, Cloudflare

2. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain: `fiftyfifty.com`

3. **Configure DNS**

   Vercel will provide DNS records to add to your domain registrar:

   **Option A: Using Vercel Nameservers (Recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: Using A Record**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **Option C: Using CNAME**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Add Subdomain for Staging** (Optional)
   
   ```
   Domain: staging.fiftyfifty.com
   Git Branch: develop
   ```

5. **Enable SSL**
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - SSL is enabled by default for all domains

### Domain Configuration Example

| Domain | Environment | Branch | Vercel Project |
|--------|-------------|--------|----------------|
| `fiftyfifty.com` | Production | `main` | fiftyfifty-toolkit |
| `www.fiftyfifty.com` | Production | `main` | (redirect to apex) |
| `staging.fiftyfifty.com` | Staging | `develop` | fiftyfifty-toolkit |

---

## Performance Optimization

### Vercel Configuration (`vercel.json`)

Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### Recommended Vercel Settings

1. **Enable Edge Caching**
   - Go to Project Settings → Performance
   - Enable "Edge Caching" for static assets

2. **Configure Image Optimization**
   
   In `next.config.js`:
   ```javascript
   module.exports = {
     images: {
       domains: ['cms.fiftyfifty.com', 'fiftyfifty-resources.s3.amazonaws.com'],
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     },
   }
   ```

3. **Enable Analytics**
   - Go to Project → Analytics tab
   - Enable "Vercel Analytics"
   - Enable "Vercel Speed Insights"

---

## Monitoring & Analytics

### Vercel Analytics

1. **Enable in Dashboard**
   - Navigate to your project
   - Go to Analytics tab
   - Click "Enable Analytics"

2. **Install SDK** (if not auto-installed)
   ```bash
   npm install @vercel/analytics
   ```

3. **Add to Application**
   
   In `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

In `app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Function Logs

View serverless function logs:
1. Go to Project → Deployments
2. Click on a deployment
3. Go to "Functions" tab
4. View real-time logs and errors

---

## CI/CD Integration

### Automatic Deployments

Vercel automatically deploys when:
- ✅ Commits are pushed to production branch (`main`)
- ✅ Pull requests are opened or updated
- ✅ Commits are pushed to any branch (preview deployments)

### GitHub Integration Features

1. **Deployment Comments**
   - Vercel comments on pull requests with preview URLs
   - Includes build status and preview link

2. **Deployment Protection**
   - Vercel checks must pass before merging
   - Configure in Project Settings → Git → Deploy Protection

3. **Environment Protection**
   - Require approval for production deployments
   - Configure in Project Settings → Git → Protection

### Deployment Hooks

Create deployment hooks for external triggers:

1. Go to Project Settings → Git
2. Scroll to "Deploy Hooks"
3. Create a new hook:
   - Name: "CMS Content Update"
   - Branch: `main`
4. Copy the webhook URL
5. Configure in your CMS to trigger on content publish

Example webhook URL:
```
https://api.vercel.com/v1/integrations/deploy/[id]/[token]
```

---

## Troubleshooting

### Build Failures

**Problem:** Build fails with "Module not found" error

**Solution:**
```bash
# Clear Vercel cache and redeploy
vercel build --force

# Or via dashboard: Redeploy → "Redeploy with cache cleared"
```

**Problem:** Build fails with "Out of memory" error

**Solution:**
1. Go to Project Settings → Functions
2. Increase memory limit (default: 1024 MB)
3. Or optimize build process in `next.config.js`

### Environment Variable Issues

**Problem:** Environment variables not loading

**Solution:**
1. Verify variables are set for correct environment (Production/Preview/Development)
2. Redeploy after adding new variables (existing deployments don't get new vars)
3. Check variable names for typos
4. Ensure `NEXT_PUBLIC_` prefix for client-side variables

### Deployment Delays

**Problem:** Deployments taking too long

**Solution:**
1. Check build logs for slow steps
2. Optimize dependencies in `package.json`
3. Use `npm ci` instead of `npm install` for faster installs
4. Enable build caching in `next.config.js`

### Domain Configuration Issues

**Problem:** Custom domain shows "Domain not found"

**Solution:**
1. Verify DNS records are correctly configured
2. Wait for DNS propagation (can take up to 48 hours)
3. Use `dig` command to check DNS:
   ```bash
   dig fiftyfifty.com
   ```
4. Verify domain ownership in Vercel

---

## Security Checklist

- [ ] All environment variables are configured in Vercel (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Production and preview environments use different secrets
- [ ] SSL/TLS certificates are active for all domains
- [ ] Security headers configured in `vercel.json`
- [ ] CORS configured correctly for CMS integration
- [ ] API routes protected with authentication
- [ ] Rate limiting enabled for public APIs
- [ ] Deployment protection enabled for production

---

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Pull environment variables
vercel env pull .env.local

# Link local project to Vercel project
vercel link

# Remove a deployment
vercel remove [deployment-id]
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](./ENV_VARIABLES.md)
- [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network/overview)

---

**Last Updated:** 2025-10-08  
**Maintained By:** DevOps Team

