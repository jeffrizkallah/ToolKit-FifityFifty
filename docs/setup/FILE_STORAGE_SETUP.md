# File Storage Setup Guide

This guide explains how to configure cloud storage for downloadable resources (PDFs, templates, checklists) in the FiftyFifty Toolkit.

## Overview

The FiftyFifty Toolkit supports multiple cloud storage providers for hosting downloadable resources:

- **AWS S3** (Recommended for production)
- **Vercel Blob** (Easiest setup, great for prototyping)
- **Cloudinary** (Good for media-heavy projects)
- **Local Storage** (Development only)

## Quick Start

### Option 1: Vercel Blob (Easiest)

**Best for:** Quick setup, prototyping, small to medium projects

1. **Install Vercel Blob package in Strapi:**
   ```bash
   cd strapi-cms
   npm install @strapi/provider-upload-aws-s3
   ```

2. **Configure Strapi Upload Plugin:**
   Create `strapi-cms/config/plugins.js`:
   ```javascript
   module.exports = ({ env }) => ({
     upload: {
       config: {
         provider: 'aws-s3',
         providerOptions: {
           accessKeyId: env('VERCEL_BLOB_READ_WRITE_TOKEN'),
           secretAccessKey: env('VERCEL_BLOB_READ_WRITE_TOKEN'),
           region: 'auto',
           params: {
             Bucket: env('VERCEL_BLOB_STORE_ID'),
           },
         },
       },
     },
   });
   ```

3. **Set Environment Variables:**
   - In Vercel Dashboard → Storage → Create Blob Store
   - Copy the provided credentials to your Strapi environment

### Option 2: AWS S3 (Recommended for Production)

**Best for:** Production deployments, scalability, cost-effectiveness

#### Step 1: Create S3 Bucket

1. **Log into AWS Console** → Navigate to S3

2. **Create New Bucket:**
   - **Bucket Name:** `fiftyfifty-resources` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., `eu-central-1`)
   - **Block Public Access:** Uncheck "Block all public access"
   - **Bucket Versioning:** Enable (recommended)
   - **Default Encryption:** Enable (SSE-S3)

3. **Configure Bucket Policy:**
   Go to Bucket → Permissions → Bucket Policy, add:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::fiftyfifty-resources/*"
       }
     ]
   }
   ```

4. **Configure CORS:**
   Go to Bucket → Permissions → CORS, add:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

#### Step 2: Create IAM User for Strapi

1. **Go to IAM** → Users → Add Users

2. **Create User:**
   - **Username:** `strapi-upload-user`
   - **Access Type:** Programmatic access

3. **Attach Policy:**
   Create inline policy with these permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::fiftyfifty-resources",
           "arn:aws:s3:::fiftyfifty-resources/*"
         ]
       }
     ]
   }
   ```

4. **Save Credentials:**
   - Copy `Access Key ID`
   - Copy `Secret Access Key`
   - Store securely (you won't see the secret again)

#### Step 3: Configure Strapi

1. **Install AWS S3 Provider:**
   ```bash
   cd strapi-cms
   npm install @strapi/provider-upload-aws-s3
   ```

2. **Create Plugin Configuration:**
   Create or update `strapi-cms/config/plugins.js`:
   ```javascript
   module.exports = ({ env }) => ({
     upload: {
       config: {
         provider: 'aws-s3',
         providerOptions: {
           accessKeyId: env('AWS_ACCESS_KEY_ID'),
           secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
           region: env('AWS_REGION', 'eu-central-1'),
           params: {
             Bucket: env('AWS_BUCKET_NAME', 'fiftyfifty-resources'),
           },
         },
         actionOptions: {
           upload: {},
           uploadStream: {},
           delete: {},
         },
       },
     },
   });
   ```

3. **Set Strapi Environment Variables:**
   Create or update `strapi-cms/.env`:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=eu-central-1
   AWS_BUCKET_NAME=fiftyfifty-resources
   ```

4. **Set Frontend Environment Variable:**
   Update your frontend `.env.local`:
   ```env
   STORAGE_BUCKET_URL=https://fiftyfifty-resources.s3.eu-central-1.amazonaws.com
   ```

#### Step 4: Optional - Set up CloudFront CDN

For better performance and caching:

1. **Create CloudFront Distribution:**
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized

2. **Update Environment Variable:**
   ```env
   STORAGE_BUCKET_URL=https://d1234567890.cloudfront.net
   ```

### Option 3: Cloudinary

**Best for:** Image and video heavy projects, automatic optimization

1. **Sign up for Cloudinary:**
   - Go to https://cloudinary.com
   - Create free account
   - Note your Cloud Name, API Key, and API Secret

2. **Install Cloudinary Provider:**
   ```bash
   cd strapi-cms
   npm install @strapi/provider-upload-cloudinary
   ```

3. **Configure Plugin:**
   Update `strapi-cms/config/plugins.js`:
   ```javascript
   module.exports = ({ env }) => ({
     upload: {
       config: {
         provider: 'cloudinary',
         providerOptions: {
           cloud_name: env('CLOUDINARY_CLOUD_NAME'),
           api_key: env('CLOUDINARY_API_KEY'),
           api_secret: env('CLOUDINARY_API_SECRET'),
         },
         actionOptions: {
           upload: {},
           delete: {},
         },
       },
     },
   });
   ```

4. **Set Environment Variables:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Supported File Types

The Resource content type supports the following file types:

- **PDF** - Documents, guides, handbooks
- **Excel** (.xlsx, .xls) - Templates, budgets, timelines
- **Word** (.docx, .doc) - Templates, checklists
- **Other** - Additional formats as needed

### Configure File Type Restrictions in Strapi

To ensure security, configure allowed file types:

1. **Go to Strapi Admin** → Settings → Media Library → Upload

2. **Set Allowed File Types:**
   ```
   .pdf, .xlsx, .xls, .docx, .doc
   ```

3. **Set Maximum File Size:**
   - Recommended: 10 MB for most documents
   - Adjust based on your needs

## Security Considerations

### ✅ Best Practices:

1. **Public Read, Private Write:**
   - Allow public GET requests for downloads
   - Restrict PUT/DELETE to authenticated IAM users only

2. **Use HTTPS Only:**
   - Configure bucket/CDN to enforce HTTPS
   - Set HSTS headers

3. **Scan Uploaded Files:**
   - Consider AWS S3 Object Lambda for virus scanning
   - Or use Strapi middleware to scan files before upload

4. **Set Content-Type Headers:**
   - Ensure proper MIME types are set
   - Prevents browsers from misinterpreting files

5. **Enable Versioning:**
   - Allows recovery from accidental deletions
   - Maintains history of resource changes

### ❌ Avoid:

- Allowing public write access to buckets
- Storing sensitive data without encryption
- Using root AWS credentials
- Allowing executable file uploads (.exe, .sh, .bat)

## Testing Your Setup

### 1. Test File Upload in Strapi

1. Log into Strapi admin panel
2. Go to Content Manager → Resources
3. Create a new Resource
4. Upload a test PDF file
5. Verify the file appears in your S3 bucket/storage

### 2. Test File Download in Frontend

1. Create a test resource in Strapi
2. Link it to a module
3. Navigate to the module page
4. Click the download button
5. Verify the file downloads correctly

### 3. Verify URLs

Check that file URLs are correctly formatted:

**S3 Direct:**
```
https://fiftyfifty-resources.s3.eu-central-1.amazonaws.com/uploads/guide_123abc.pdf
```

**CloudFront CDN:**
```
https://d1234567890.cloudfront.net/uploads/guide_123abc.pdf
```

**Cloudinary:**
```
https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/guide_123abc.pdf
```

## Troubleshooting

### File Upload Fails in Strapi

**Symptoms:** Upload button doesn't work or shows error

**Solutions:**
1. Check Strapi logs for error messages
2. Verify IAM credentials are correct
3. Ensure bucket permissions allow PutObject
4. Check file size limits in Strapi settings
5. Verify network connectivity to S3

### Files Not Accessible After Upload

**Symptoms:** 403 Forbidden or 404 Not Found errors

**Solutions:**
1. Verify bucket policy allows public read (GetObject)
2. Check CORS configuration
3. Ensure files are in correct bucket/path
4. Verify STORAGE_BUCKET_URL is correct in frontend

### CORS Errors When Downloading

**Symptoms:** Browser console shows CORS errors

**Solutions:**
1. Add your frontend domain to S3 CORS configuration
2. Ensure bucket allows GET and HEAD methods
3. Check CloudFront behavior settings if using CDN

## Cost Optimization

### AWS S3 Tips:

1. **Use Lifecycle Policies:**
   - Move old files to S3 Glacier after 90 days
   - Delete unused files automatically

2. **Enable S3 Intelligent-Tiering:**
   - Automatically moves objects between access tiers
   - Reduces costs for infrequently accessed files

3. **Monitor Usage:**
   - Set up AWS Cost Explorer
   - Create budget alerts

4. **Optimize File Sizes:**
   - Compress PDFs before uploading
   - Use efficient file formats

### Vercel Blob Pricing:

- Free tier: 1 GB storage, 10 GB bandwidth
- Pro: $0.15/GB storage, $0.15/GB bandwidth
- Monitor usage in Vercel Dashboard

## Environment Variable Summary

### Strapi CMS (S3):
```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=eu-central-1
AWS_BUCKET_NAME=fiftyfifty-resources
```

### Frontend (Next.js):
```env
STORAGE_BUCKET_URL=https://fiftyfifty-resources.s3.eu-central-1.amazonaws.com
# OR with CloudFront
STORAGE_BUCKET_URL=https://d1234567890.cloudfront.net
```

## Related Documentation

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Strapi Upload Plugin](https://docs.strapi.io/dev-docs/plugins/upload)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Last Updated:** 2025-10-17  
**Maintained By:** Dev Team

