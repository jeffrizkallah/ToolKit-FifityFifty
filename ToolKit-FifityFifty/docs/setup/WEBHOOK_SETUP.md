# Webhook Setup Guide

This guide explains how to configure webhooks in Strapi CMS to trigger automatic revalidation of Next.js pages when content is published or updated.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Strapi Webhook Configuration](#strapi-webhook-configuration)
- [Testing the Webhook](#testing-the-webhook)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Overview

The FiftyFifty ToolKit uses **Next.js Incremental Static Regeneration (ISR)** with **on-demand revalidation** to ensure content updates from the CMS are reflected on the live site immediately.

**How it works:**
1. Content editor publishes or updates content in Strapi CMS
2. Strapi triggers a webhook to the Next.js revalidation API endpoint
3. Next.js revalidates the affected pages
4. Users see updated content on their next page visit

## Prerequisites

- Strapi CMS installed and running
- Next.js frontend deployed (or running locally)
- Admin access to Strapi CMS
- Access to environment variables (`.env.local` or deployment platform)

## Environment Configuration

### 1. Generate a Secret Token

Generate a secure random string for the `REVALIDATE_SECRET`:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Example output:
# Qx3K8mNpR7vZ2jL9wYhF6tC4nX1bS5dA8gH0eU2iO3k=
```

### 2. Add to Environment Variables

**Local Development (`.env.local`):**
```bash
# Secret token for webhook authentication
REVALIDATE_SECRET=Qx3K8mNpR7vZ2jL9wYhF6tC4nX1bS5dA8gH0eU2iO3k=
```

**Production (Vercel):**
1. Go to your project settings in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add `REVALIDATE_SECRET` with your generated token
4. Set scope to **Production** (and optionally Preview)
5. Click **Save**

### 3. Restart Your Application

- **Local:** Restart your `npm run dev` server
- **Vercel:** Redeploy your application (or it will redeploy automatically)

## Strapi Webhook Configuration

### Step 1: Access Webhook Settings

1. Log in to Strapi admin panel
2. Go to **Settings** (gear icon in sidebar)
3. Under **Global Settings**, click **Webhooks**
4. Click **Create new webhook** button

### Step 2: Configure Webhook

**Basic Configuration:**

| Field | Value |
|-------|-------|
| **Name** | `Next.js Revalidation - Production` |
| **URL** | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET_HERE` |
| **Headers** | `Content-Type: application/json` |

**Events to Enable:**

Select these events for automatic revalidation:

- [x] **Entry - Create** (phase, module, resource, testimonial)
- [x] **Entry - Update** (phase, module, resource, testimonial, setting)
- [x] **Entry - Delete** (phase, module, resource, testimonial)
- [x] **Entry - Publish** (phase, module, resource, testimonial)
- [x] **Entry - Unpublish** (phase, module, resource, testimonial)

### Step 3: Configure Content-Specific Webhooks

For better control, create separate webhooks for each content type:

#### Webhook 1: Phase Content
```
Name: Revalidate - Phases
URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=phase&locale=all
Events: phase.create, phase.update, phase.publish, phase.delete
```

#### Webhook 2: Module Content
```
Name: Revalidate - Modules
URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=module&locale=all
Events: module.create, module.update, module.publish, module.delete
```

#### Webhook 3: Resource Content
```
Name: Revalidate - Resources
URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=resource&locale=all
Events: resource.create, resource.update, resource.publish, resource.delete
```

#### Webhook 4: Testimonial Content
```
Name: Revalidate - Testimonials
URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=testimonial&locale=all
Events: testimonial.create, testimonial.update, testimonial.publish, testimonial.delete
```

#### Webhook 5: Settings Content
```
Name: Revalidate - Settings
URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=setting&locale=all
Events: setting.update
```

### Step 4: Save and Enable

1. Click **Save** to create the webhook
2. Ensure the webhook is **Enabled** (toggle switch should be ON)
3. Test the webhook using the **Trigger** button

## Testing the Webhook

### Method 1: Test from Strapi Admin

1. Navigate to **Settings** → **Webhooks**
2. Find your webhook in the list
3. Click the **Trigger** button
4. Check the response:
   - **200 OK**: Webhook working correctly ✅
   - **401 Unauthorized**: Secret token mismatch ❌
   - **500 Error**: Configuration issue ❌

### Method 2: Test with cURL

```bash
# Replace with your actual domain and secret
curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET&model=phase&locale=all" \
  -H "Content-Type: application/json"

# Expected response:
{
  "success": true,
  "revalidated": [
    "path: /en",
    "path: /ar"
  ],
  "timestamp": "2025-10-17T12:34:56.789Z"
}
```

### Method 3: Test by Publishing Content

1. Go to **Content Manager** in Strapi
2. Edit or create a Phase
3. Click **Publish**
4. Check Strapi webhook logs:
   - Go to **Settings** → **Webhooks**
   - Click on your webhook
   - View **Logs** to see recent triggers
5. Visit your frontend site and verify content is updated

### Method 4: Health Check

```bash
# Check if revalidation API is configured
curl https://your-domain.com/api/revalidate

# Expected response:
{
  "status": "ok",
  "configured": true,
  "message": "Revalidation webhook is ready",
  "timestamp": "2025-10-17T12:34:56.789Z"
}
```

## Troubleshooting

### Issue: 401 Unauthorized

**Cause:** Secret token mismatch

**Solution:**
1. Verify `REVALIDATE_SECRET` matches in both environments
2. Check webhook URL includes correct secret parameter
3. Ensure no extra spaces or characters in the secret

### Issue: 500 Internal Server Error

**Cause:** `REVALIDATE_SECRET` not configured in Next.js

**Solution:**
1. Add `REVALIDATE_SECRET` to environment variables
2. Restart Next.js application
3. For Vercel, redeploy after adding environment variable

### Issue: Webhook Triggers But Content Doesn't Update

**Cause:** Cache not being revalidated for the correct paths

**Solution:**
1. Check webhook logs in Strapi admin
2. Verify the `model` parameter matches your content type
3. Add `locale=all` to revalidate both EN and AR versions
4. Clear browser cache and refresh page

### Issue: Webhook Request Timeout

**Cause:** Next.js server not responding or slow

**Solution:**
1. Check if your Next.js application is running
2. Verify the domain/URL is correct
3. Check server logs for errors
4. Increase webhook timeout in Strapi (if available)

### Issue: Multiple Webhooks Firing at Once

**Cause:** Publishing triggers multiple events

**Solution:**
- This is normal behavior (create + publish events)
- Next.js handles duplicate revalidation requests efficiently
- No action needed, but you can optimize by using specific events

## Advanced Configuration

### Locale-Specific Revalidation

Revalidate only specific language versions:

```bash
# Revalidate only English
?secret=XXX&model=phase&locale=en

# Revalidate only Arabic
?secret=XXX&model=phase&locale=ar

# Revalidate both (default)
?secret=XXX&model=phase&locale=all
```

### Path-Specific Revalidation

Revalidate specific paths directly:

```bash
# Revalidate home page
?secret=XXX&path=/en

# Revalidate specific phase page
?secret=XXX&path=/en/phases/discovery

# Revalidate multiple paths (use multiple webhooks or separate requests)
```

### Tag-Based Revalidation

If you've tagged your pages in Next.js:

```bash
# Revalidate all pages with "phases" tag
?secret=XXX&tag=phases

# Revalidate all pages with "modules" tag
?secret=XXX&tag=modules
```

### Webhook Logs and Monitoring

**In Strapi:**
1. Go to **Settings** → **Webhooks**
2. Click on a webhook to view details
3. Check **Logs** tab for recent webhook triggers
4. View request/response data for debugging

**In Next.js (Vercel Logs):**
1. Go to Vercel dashboard
2. Select your project
3. Navigate to **Logs** tab
4. Search for `[Revalidation]` to see webhook activity

### Security Best Practices

1. **Never expose your secret token:**
   - Don't commit `REVALIDATE_SECRET` to Git
   - Use environment variables only
   - Rotate secrets regularly (every 90 days)

2. **Use HTTPS only:**
   - Always use `https://` URLs for webhooks
   - Never use `http://` in production

3. **Restrict webhook IPs (optional):**
   - Use Vercel Edge Config or middleware to whitelist Strapi server IP
   - Add IP validation to the revalidation route

4. **Monitor webhook logs:**
   - Regularly check for failed webhook attempts
   - Set up alerts for authentication failures

### Rate Limiting (Optional)

To prevent abuse, consider adding rate limiting:

```typescript
// In app/api/revalidate/route.ts
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... rest of the code
}
```

## API Endpoint Reference

### POST /api/revalidate

Triggers on-demand revalidation of Next.js pages.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `secret` | string | Yes | Authentication secret token |
| `path` | string | No | Specific path to revalidate |
| `tag` | string | No | Cache tag to revalidate |
| `model` | string | No | Content model (phase, module, resource, testimonial, setting) |
| `slug` | string | No | Slug of specific entity |
| `locale` | string | No | Locale to revalidate (en, ar, all) - default: all |

**Response (Success):**
```json
{
  "success": true,
  "revalidated": ["path: /en", "path: /ar"],
  "timestamp": "2025-10-17T12:34:56.789Z"
}
```

**Response (Error):**
```json
{
  "error": "Invalid secret token",
  "message": "Authentication failed"
}
```

### GET /api/revalidate

Health check endpoint (no authentication required).

**Response:**
```json
{
  "status": "ok",
  "configured": true,
  "message": "Revalidation webhook is ready",
  "timestamp": "2025-10-17T12:34:56.789Z"
}
```

## Next Steps

After setting up webhooks:

1. ✅ Test webhook with a content update
2. ✅ Verify content appears on the frontend
3. ✅ Monitor webhook logs for errors
4. ✅ Document webhook URLs for your team
5. ✅ Set up alerts for failed webhooks (optional)

## Support

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review Strapi webhook logs
3. Review Next.js/Vercel logs
4. Verify environment variables are set correctly
5. Test with cURL to isolate the issue

---

**Last Updated:** October 17, 2025  
**Version:** 1.0

