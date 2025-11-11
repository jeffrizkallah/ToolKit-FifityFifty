# FiftyFifty ToolKit - Strapi CMS

This directory contains the Strapi headless CMS configuration for the FiftyFifty ToolKit.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- npm 6.x or higher
- PostgreSQL 12+ (for production) or SQLite (for development)

### Local Development Setup

1. **Install Dependencies**
   ```bash
   cd strapi-cms
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and update the values
   ```

3. **Generate Secrets** (Required for first-time setup)
   ```bash
   # Run this to generate secure secrets for your .env file
   node -e "console.log('APP_KEYS=' + Array(4).fill(0).map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"
   node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(16).toString('base64'))"
   node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(16).toString('base64'))"
   node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(16).toString('base64'))"
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(16).toString('base64'))"
   ```

4. **Start Development Server**
   ```bash
   npm run develop
   ```

5. **Create Admin User**
   - Open http://localhost:1337/admin
   - Create your first admin user
   - Start creating content!

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

From the project root directory:

```bash
# Start all services (PostgreSQL + Strapi)
docker-compose up -d

# View logs
docker-compose logs -f strapi

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Environment Variables for Docker

Create `strapi-cms/.env` with production values:

```env
HOST=0.0.0.0
PORT=1337

# Generate these using the commands above
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret

# PostgreSQL Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi_fiftyfifty
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-secure-password

# Frontend CORS
FRONTEND_URL=http://localhost:3000,https://your-production-domain.com

NODE_ENV=production
```

## 🌐 Production Deployment

### Option 1: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create project: `railway init`
4. Add PostgreSQL: `railway add postgresql`
5. Deploy: `railway up`
6. Set environment variables in Railway dashboard

### Option 2: Render

1. Create new Web Service in Render dashboard
2. Connect your GitHub repository
3. Set:
   - Build Command: `cd strapi-cms && npm install && npm run build`
   - Start Command: `cd strapi-cms && npm run start`
4. Add PostgreSQL database
5. Set environment variables

### Option 3: Hetzner

1. Create a new server (Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Clone repository
4. Configure .env file
5. Run: `docker-compose up -d`
6. Set up Nginx reverse proxy
7. Configure SSL with Let's Encrypt

## 📝 Content Types

### Phase Content Type (US2.2)

Fields:
- `title` (Text, i18n enabled) - Phase title in English and Arabic
- `slug` (UID based on title) - URL-friendly identifier
- `description` (Rich Text, i18n enabled) - Phase description
- `order` (Number) - Display order on landing page
- `phase_number` (Number) - Sequential phase number (1-6)
- `header_video_url` (Text) - URL for phase intro video
- Relation: One Phase has many Modules

## 🔐 Security

### API Tokens

Generate an API token for the frontend:
1. Go to Settings > API Tokens
2. Create new token
3. Set permissions (find and findOne for all content types)
4. Copy token to frontend `.env.local` as `CMS_API_TOKEN`

### CORS Configuration

CORS is configured in `config/middlewares.js` to allow requests from:
- Local development: http://localhost:3000
- Production: Set via FRONTEND_URL environment variable

## 🔄 Content Management Workflow

1. **Create Content** in Strapi admin panel
2. **Publish** content when ready
3. Strapi webhook triggers frontend revalidation (optional)
4. Frontend fetches new content via API

## 📚 Documentation

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi GraphQL API](https://docs.strapi.io/dev-docs/plugins/graphql)

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Check what's using port 1337
lsof -i :1337
# or on Windows
netstat -ano | findstr :1337

# Kill the process or change PORT in .env
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_* environment variables
- Ensure database user has proper permissions

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .cache build
npm run build
```

## 📞 Support

For issues specific to this CMS setup, refer to:
- Project documentation in `/docs`
- Strapi community forums
- Project issue tracker

