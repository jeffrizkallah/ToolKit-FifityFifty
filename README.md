# ToolKit FiftyFifty

A modern, bilingual (English/Arabic) web application for the FiftyFifty ToolKit platform. Built with Next.js 14+, TypeScript, and Tailwind CSS, featuring RTL support and a simple, local content management system.

## 🚀 Features

- **Bilingual Support**: Full English and Arabic localization with RTL layout
- **Modern Stack**: Next.js 14+ with App Router and TypeScript
- **Local CMS**: Simple JSON-based content management with admin panel
- **Accessible**: WCAG 2.1 AA compliant with shadcn/ui components
- **Performance**: Optimized with ISR (Incremental Static Regeneration)
- **SEO Ready**: Metadata API and Google Analytics 4 integration

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **CMS**: Local JSON files with admin panel
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
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and set:
   - `ADMIN_PASSWORD`: Password for the admin panel (required!)
   - `NEXT_PUBLIC_SITE_URL`: Your site URL
   - `NEXT_PUBLIC_GA_ID`: Google Analytics 4 measurement ID (optional)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
toolkit-fiftyfifty/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (en/ar)
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   │   └── admin/         # Admin API (auth, content)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── content/               # JSON content files
│   ├── phases.json       # Campaign phases
│   ├── modules.json      # Learning modules
│   ├── resources.json    # Downloadable resources
│   ├── testimonials.json # Participant testimonials
│   └── settings.json     # Site settings
├── lib/                   # Utility functions
│   ├── cms-client.ts     # Content fetching functions
│   └── types/            # TypeScript types
├── messages/              # i18n translation files
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
├── public/                # Static assets
├── docs/                  # Project documentation
└── README.md             # This file
```

## 🔐 Admin Panel

The admin panel allows you to edit all website content without touching code.

### Accessing the Admin Panel

1. Navigate to `/admin`
2. Enter your admin password (set in `ADMIN_PASSWORD` env variable)
3. Edit content for:
   - **Site Settings**: Title, hero section, footer, social links
   - **Phases**: The 3 campaign phases
   - **Modules**: Learning modules within each phase
   - **Resources**: Downloadable files and documents
   - **Testimonials**: Participant quotes and stories

### Content Structure

All content supports both English and Arabic translations. Content is stored in JSON files in the `/content` directory and can be edited either through the admin panel or directly in the JSON files.

## 🌍 Internationalization

The application supports English (en) and Arabic (ar) with:
- Locale-based routing: `/en/*` and `/ar/*`
- RTL layout for Arabic
- Bilingual content in admin panel
- Language switcher component

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run test` - Run tests

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Password for admin panel access | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | No |
| `REVALIDATION_SECRET` | Secret for ISR webhooks | No |

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

**Important**: Set a strong `ADMIN_PASSWORD` in production!

## 🔒 Security

- Never commit `.env` files to the repository
- Use a strong admin password in production
- The admin panel uses HTTP-only cookies for session management
- Content changes are saved directly to JSON files

## 📝 License

[Add your license information here]

---

**Built with ❤️ for FiftyFifty**
