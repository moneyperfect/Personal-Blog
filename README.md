# Personal Site

A Next.js 15+ personal website for selling digital products and collecting SaaS waitlist signups.

## Features

- 🌐 **i18n Support** - Chinese (zh) and Japanese (ja) with URL prefix routing
- 📦 **Digital Products** - Product listing with detail pages and purchase links
- 📚 **Resource Library** - Prompts, templates, checklists, and SOPs with copy/download
- 🎯 **SaaS Waitlist** - Form for collecting interested users
- 📖 **Playbooks** - Step-by-step guides for specific goals
- 📝 **Cases & Notes** - Blog-style content with MDX
- 📊 **Analytics** - GA4 integration with custom event tracking
- 🎨 **Modern UI** - Google Material Design-inspired, mobile-first

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Content**: MDX with gray-matter
- **i18n**: next-intl
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure the following:
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 Measurement ID
- `NEXT_PUBLIC_FORM_ENDPOINT` - Form submission endpoint (e.g., Formspree)
- `NEXT_PUBLIC_SITE_URL` - Your production URL

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

## Project Structure

```
personal-site/
├── content/                 # MDX content files
│   ├── products/           # Digital products (*.zh.mdx, *.ja.mdx)
│   ├── library/            # Resources (prompts, templates, etc.)
│   ├── playbooks/          # Step-by-step guides
│   ├── cases/              # Success stories
│   └── notes/              # Blog posts
├── messages/               # i18n translation files
│   ├── zh.json
│   └── ja.json
├── src/
│   ├── app/                # Next.js App Router pages
│   │   └── [locale]/       # Locale-prefixed routes
│   ├── components/         # React components
│   │   ├── layout/         # Header, Footer, LanguageSwitcher
│   │   ├── cards/          # ProductCard, ResourceCard
│   │   ├── forms/          # WaitlistForm, NewsletterSignup
│   │   └── ui/             # TagFilter, CopyButton, DownloadButton
│   ├── i18n/               # i18n configuration
│   └── lib/                # Utilities (mdx.ts, analytics.ts)
└── public/                 # Static assets
```

## Content Management

### Adding Products

Create MDX files in `content/products/`:

```mdx
---
title: "Product Name"
summary: "Short description"
tags: ["tag1", "tag2"]
updatedAt: "2024-01-01"
language: "zh"
price: "¥99"
purchaseUrl: "https://gumroad.com/..."
---

Your product content here...
```

### Adding Library Resources

Create MDX files in `content/library/`:

```mdx
---
title: "Resource Name"
summary: "Description"
tags: ["tag1"]
updatedAt: "2024-01-01"
language: "zh"
type: "prompt"  # prompt | template | checklist | sop
copyText: "Text to copy"  # for prompts
downloadUrl: "..."  # for downloadable resources
---
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Build and export:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## License

MIT
