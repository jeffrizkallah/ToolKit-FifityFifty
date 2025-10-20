# Quick Start Guide - FiftyFifty Toolkit

This guide will get you up and running with the FiftyFifty Toolkit in under 10 minutes.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- A Vercel account (free tier works)
- Access to a CMS instance (Strapi or WordPress)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-org/fiftyfifty-toolkit.git
cd fiftyfifty-toolkit

# Install dependencies
npm install
```

## Step 2: Environment Setup (3 minutes)

```bash
# Copy environment template
cp env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CMS_BASE_URL=http://localhost:1337
CMS_API_TOKEN=your-local-cms-token-here
NEXT_PUBLIC_GA_ID=
REVALIDATE_SECRET=dev-secret-12345
STORAGE_BUCKET_URL=https://dev-storage.example.com
```

**Where to get these values:**

- `CMS_API_TOKEN`: Generate in your CMS admin panel (Strapi: Settings → API Tokens)
- `REVALIDATE_SECRET`: Generate with: `openssl rand -base64 32`
- Other values can use the examples above for local development

## Step 3: Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Deploy to Vercel (5 minutes)

### Option A: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Add environment variables (see step 2 values)
4. Click "Deploy"

### Option B: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel

# For production deployment
vercel --prod
```

## Next Steps

- [ ] Set up your CMS content models
- [ ] Configure custom domain in Vercel
- [ ] Set up production environment variables
- [ ] Configure Google Analytics
- [ ] Set up CMS webhook for revalidation

## Detailed Documentation

- [Environment Variables Guide](./ENV_VARIABLES.md) - Complete guide to all env vars
- [Vercel Setup Guide](./VERCEL_SETUP.md) - Detailed Vercel configuration
- [Architecture Documentation](./architecture/index.md) - Full architecture details

## Troubleshooting

### Development server won't start

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm run dev
```

### Environment variables not loading

1. Ensure `.env.local` exists in project root
2. Restart the development server
3. Check for typos in variable names
4. Verify `.env.local` is in `.gitignore`

### CMS connection failed

1. Verify CMS is running (e.g., `http://localhost:1337`)
2. Check `CMS_BASE_URL` has no trailing slash
3. Verify `CMS_API_TOKEN` is valid and not expired
4. Check CMS CORS settings allow your frontend URL

### Build fails on Vercel

1. Ensure all required environment variables are set in Vercel dashboard
2. Check build logs for specific errors
3. Try redeploying with cache cleared

## Getting Help

- Check the [documentation](./architecture/index.md)
- Review [common issues](./VERCEL_SETUP.md#troubleshooting)
- Contact the DevOps team

---

**Need more details?** See the full documentation in the `docs/` directory.

