# ToolKit FiftyFifty

A modern, bilingual (English/Arabic) web application for the FiftyFifty ToolKit platform. Built with Next.js 14+, TypeScript, and Tailwind CSS, featuring RTL support and a headless CMS integration.

## 🚀 Features

- **Bilingual Support**: Full English and Arabic localization with RTL layout
- **Modern Stack**: Next.js 14+ with App Router and TypeScript
- **Headless CMS**: Integrated with a headless CMS for content management
- **Accessible**: WCAG 2.1 AA compliant with shadcn/ui components
- **Performance**: Optimized with ISR (Incremental Static Regeneration)
- **SEO Ready**: Metadata API and Google Analytics 4 integration

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **CMS**: Headless CMS integration
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd toolkit-fiftyfifty
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your environment variables:
   - `NEXT_PUBLIC_SITE_URL`: Your site URL
   - `CMS_BASE_URL`: Your CMS API base URL
   - `CMS_API_TOKEN`: Your CMS authentication token
   - `NEXT_PUBLIC_GA_ID`: Google Analytics 4 measurement ID
   - `REVALIDATE_SECRET`: Secret for ISR webhook authentication
   - `STORAGE_BUCKET_URL`: S3-compatible storage bucket URL

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
toolkit-fiftyfifty/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (en/ar)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── cms/              # CMS integration
│   ├── i18n/             # Internationalization
│   └── utils/            # Helper functions
├── public/                # Static assets
├── styles/                # Additional styles
├── docs/                  # Project documentation
│   ├── architecture/     # Architecture docs
│   ├── epics/           # Epic definitions
│   ├── stories/         # User stories
│   └── setup/           # Setup guides
├── env.example           # Environment variables template
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🌍 Internationalization

The application supports English (en) and Arabic (ar) with:
- Locale-based routing: `/en/*` and `/ar/*`
- RTL layout for Arabic
- Translated content from CMS
- Language switcher component

## 📚 Documentation

- [Quick Start Guide](docs/QUICK_START.md)
- [Setup Guide](docs/setup/SETUP_QUICK_START.md)
- [Environment Variables](docs/setup/ENV_VARIABLES.md)
- [Vercel Setup](docs/setup/VERCEL_SETUP.md)
- [Architecture Overview](docs/architecture.md)
- [Epics & Stories](docs/epics/README.md)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Branching Strategy

We follow **GitHub Flow** for our branching strategy:

- `main` - Production-ready code
- `develop` - Development branch for integration
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Urgent production fixes

See [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) for detailed workflow.

### Code Review Process

- All changes require pull request reviews
- At least one approval required before merging
- All CI/CD checks must pass
- Follow code style and conventions

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments:

- **Production**: `main` branch → production.vercel.app
- **Preview**: Pull requests → preview URLs
- **Development**: `develop` branch → dev.vercel.app

See [docs/setup/VERCEL_SETUP.md](docs/setup/VERCEL_SETUP.md) for detailed deployment instructions.

## 🔒 Security

- Never commit `.env` files or secrets to the repository
- Use environment variables for all sensitive data
- Keep dependencies up to date
- Review security advisories regularly

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests if applicable
4. Submit a pull request
5. Wait for code review approval

## 📝 License

[Add your license information here]

## 👥 Team

- **Product Owner**: [Name]
- **Tech Lead**: [Name]
- **Developers**: [Names]
- **DevOps**: [Name]

## 📞 Support

For questions or issues:
- Open an issue in GitHub
- Contact the team via [communication channel]
- Check documentation in `/docs`

---

**Built with ❤️ for FiftyFifty**

