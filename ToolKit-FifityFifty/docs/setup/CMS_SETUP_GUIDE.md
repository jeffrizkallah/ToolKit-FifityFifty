# CMS Setup Guide - FiftyFifty ToolKit

This guide covers the deployment and configuration of the Strapi headless CMS for the FiftyFifty ToolKit.

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [API Configuration](#api-configuration)
5. [Content Type Schemas](#content-type-schemas)
6. [Security & Access Control](#security--access-control)
7. [Troubleshooting](#troubleshooting)

## Overview

### Technology Stack

- **CMS Platform**: Strapi v4.25+
- **Database**: PostgreSQL 15 (production) / SQLite (development)
- **Node.js**: v18 or v20
- **Deployment**: Docker Compose

### Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Next.js        │ ◄─────► │  Strapi CMS     │
│  (Frontend)     │  REST   │  (Backend)      │
│  Port: 3000     │   API   │  Port: 1337     │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │   PostgreSQL    │
                            │   (Database)    │
                            │   Port: 5432    │
                            └─────────────────┘
```

## Local Development Setup

### Prerequisites

Ensure you have the following installed:
- Node.js 18.x or 20.x ([Download](https://nodejs.org/))
- npm 6.x or higher
- Docker Desktop (for PostgreSQL) or use SQLite

### Step-by-Step Setup

#### 1. Navigate to CMS Directory

```bash
cd strapi-cms
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env
```

#### 4. Generate Security Keys

Run these commands to generate secure keys for your `.env` file:

```bash
# Generate APP_KEYS (4 keys separated by commas)
node -e "console.log('APP_KEYS=' + Array(4).fill(0).map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"

# Generate API_TOKEN_SALT
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(16).toString('base64'))"

# Generate ADMIN_JWT_SECRET
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(16).toString('base64'))"

# Generate TRANSFER_TOKEN_SALT
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(16).toString('base64'))"

# Generate JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(16).toString('base64'))"
```

Copy the output values into your `.env` file.

#### 5. Start Development Server

```bash
npm run develop
```

This will:
- Start Strapi on http://localhost:1337
- Open the admin panel automatically
- Use SQLite database (no additional setup needed)

#### 6. Create Admin Account

1. Open http://localhost:1337/admin
2. Fill in the admin registration form:
   - First Name
   - Last Name
   - Email
   - Password (minimum 8 characters)
3. Click "Let's start"

#### 7. Verify Installation

- Admin panel: http://localhost:1337/admin
- API endpoint: http://localhost:1337/api
- Health check: http://localhost:1337/_health

## Production Deployment

### Option 1: Docker Compose (Recommended)

#### Prerequisites

- Docker and Docker Compose installed
- Server with at least 2GB RAM
- Domain name pointed to your server

#### Deployment Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd toolkit-fiftyfifty
   ```

2. **Configure Production Environment**
   ```bash
   cd strapi-cms
   cp .env.example .env
   nano .env  # Edit with production values
   ```

   **Required Production Environment Variables:**
   ```env
   HOST=0.0.0.0
   PORT=1337
   
   # Generate these using the commands from step 4 above
   APP_KEYS=<generated-keys>
   API_TOKEN_SALT=<generated-salt>
   ADMIN_JWT_SECRET=<generated-secret>
   TRANSFER_TOKEN_SALT=<generated-salt>
   JWT_SECRET=<generated-secret>
   
   # PostgreSQL Configuration
   DATABASE_CLIENT=postgres
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_NAME=strapi_fiftyfifty
   DATABASE_USERNAME=strapi
   DATABASE_PASSWORD=<your-secure-password>
   
   # Frontend CORS (comma-separated)
   FRONTEND_URL=https://your-production-domain.com,https://www.your-production-domain.com
   
   NODE_ENV=production
   ```

3. **Start Services**
   ```bash
   cd ..  # Back to project root
   docker-compose up -d
   ```

4. **Check Status**
   ```bash
   docker-compose ps
   docker-compose logs -f strapi
   ```

5. **Create Admin User**
   - Navigate to https://cms.your-domain.com/admin
   - Complete the admin registration

6. **Configure Reverse Proxy (Nginx)**

   Example Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name cms.your-domain.com;
       
       location / {
           proxy_pass http://localhost:1337;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d cms.your-domain.com
   ```

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set APP_KEYS="key1,key2,key3,key4"
   railway variables set API_TOKEN_SALT="your-salt"
   # ... (set all required variables)
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 3: Render

1. **Create Web Service**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: fiftyfifty-cms
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: strapi-cms

3. **Add PostgreSQL Database**
   - In Render dashboard, click "New +" → "PostgreSQL"
   - Copy connection details

4. **Set Environment Variables**
   - Add all required environment variables in Render dashboard
   - Use PostgreSQL connection details from step 3

5. **Deploy**
   - Render will automatically deploy on git push

## API Configuration

### Creating API Tokens

API tokens are required for the frontend to fetch content.

1. **Navigate to Settings**
   - Go to Settings → API Tokens
   - Click "Create new API Token"

2. **Configure Token**
   - **Name**: Frontend Production Token
   - **Description**: Token for Next.js frontend
   - **Token duration**: Unlimited
   - **Token type**: Read-only

3. **Set Permissions**
   For each content type (Phase, Module, Tool, etc.):
   - Check `find` (list all entries)
   - Check `findOne` (get single entry)

4. **Generate and Copy Token**
   - Click "Save"
   - Copy the generated token
   - Add to frontend `.env.local`:
     ```env
     CMS_BASE_URL=http://localhost:1337
     CMS_API_TOKEN=your-generated-token-here
     ```

### CORS Configuration

CORS is configured in `strapi-cms/config/middlewares.js`.

For production, update the `FRONTEND_URL` environment variable:
```env
FRONTEND_URL=https://your-domain.com,https://www.your-domain.com
```

## Content Type Schemas

Content types are defined in `strapi-cms/src/api/*/content-types/*/schema.json`.

See [US2.2](../stories/US2.2.md) for the Phase content type schema.

### Creating Content Types via Admin Panel

1. Go to Content-Type Builder
2. Click "Create new collection type"
3. Enter display name (e.g., "Phase")
4. Add fields according to schema
5. Configure internationalization (i18n) if needed
6. Save and restart Strapi

## Security & Access Control

### Admin Access

- **Development**: http://localhost:1337/admin
- **Production**: https://cms.your-domain.com/admin

### User Roles

Default roles created by Strapi:
- **Super Admin**: Full access to everything
- **Editor**: Can manage content
- **Author**: Can create and edit own content
- **Public**: Unauthenticated API access

### API Permissions

Configure in Settings → Roles → Public:
- Enable `find` and `findOne` for published content only
- Disable `create`, `update`, `delete` for public role

### Security Best Practices

1. **Strong Passwords**: Enforce minimum 12 characters for admin accounts
2. **API Tokens**: Use read-only tokens for frontend
3. **CORS**: Restrict to specific domains
4. **HTTPS**: Always use SSL in production
5. **Database**: Use strong passwords, restrict network access
6. **Backups**: Regular automated backups of database
7. **Updates**: Keep Strapi and dependencies updated

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem**: Port 1337 is already in use

**Solution**:
```bash
# Find process using port 1337
lsof -i :1337  # Mac/Linux
netstat -ano | findstr :1337  # Windows

# Kill the process or change PORT in .env
```

#### 2. Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solution**:
- Verify PostgreSQL is running: `docker-compose ps`
- Check DATABASE_* environment variables
- Ensure database exists: `docker-compose exec postgres psql -U strapi -l`
- Check logs: `docker-compose logs postgres`

#### 3. Build Errors

**Problem**: Build fails with module errors

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .cache build node_modules
npm install
npm run build
```

#### 4. Admin Panel Not Loading

**Problem**: Admin panel shows blank page

**Solution**:
- Clear browser cache
- Check browser console for errors
- Verify NODE_ENV is set correctly
- Rebuild admin: `npm run build`

#### 5. CORS Errors

**Problem**: Frontend cannot access API

**Solution**:
- Check FRONTEND_URL in .env includes correct domain
- Restart Strapi after changing CORS config
- Verify API token has correct permissions

### Getting Help

- **Strapi Documentation**: https://docs.strapi.io
- **Strapi Discord**: https://discord.strapi.io
- **GitHub Issues**: For project-specific issues
- **Stack Overflow**: Tag questions with `strapi`

## Next Steps

After completing the CMS setup:

1. ✅ Complete [US2.2 - Create Phase Content Type](../stories/US2.2.md)
2. Configure webhooks for automatic frontend revalidation
3. Set up automated database backups
4. Configure media upload storage (S3/Cloudinary)
5. Set up monitoring and logging

## Related Documentation

- [Environment Variables Guide](./ENV_VARIABLES.md)
- [Deployment Checklist](../architecture/20-handoff-checklist.md)
- [Story US2.1](../stories/US2.1.md) - CMS Platform Deployment
- [Story US2.2](../stories/US2.2.md) - Phase Content Model

