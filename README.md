# Pegrio - High-Performance Website Agency

Professional website design agency serving Houston, Katy, and businesses nationwide. Built with Next.js 14 and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel
- **Scheduling**: Calendly integration
- **Forms**: Custom React forms with validation

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The site will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/src
  /app                 # Next.js App Router pages
    /about             # About page
    /contact           # Contact page with Calendly + form
    /services          # Services & pricing page
    /work              # Portfolio page
    page.tsx           # Homepage
    layout.tsx         # Root layout with nav/footer
    globals.css        # Global styles & Tailwind
  /components          # React components
    /home              # Homepage sections
    /services          # Services page components
    /work              # Portfolio components
    /about             # About page components
    /contact           # Contact form
    Navigation.tsx     # Sticky navigation
    Footer.tsx         # Site footer
    CalendlyModal.tsx  # Calendly integration
```

## 🎨 Design System

### Colors
- **Navy**: `#0D1B2A` - Primary/hero backgrounds
- **Blue Accent**: `#2D6A9F` - Buttons, links, CTAs
- **Blue Light**: `#BDD7EE` - Highlights, badges
- **Success Green**: `#E2EFDA` - Trust elements
- **Gray Background**: `#F9FAFB` - Section backgrounds
- **Gray Text**: `#1A1A1A` - Body text
- **Gray Muted**: `#6B7280` - Secondary text

### Typography
- **Font**: Inter (Google Fonts)
- **H1**: 48px desktop / 36px mobile
- **H2**: 36px desktop / 28px mobile
- **H3**: 24px desktop / 20px mobile
- **Body**: 16px
- **Small**: 14px

### Spacing
- Base unit: 8px
- Section padding: 80px desktop / 48px mobile
- Max content width: 1200px

## 📄 Pages

### Homepage (/)
1. Hero section with CTA
2. Social proof bar (stats)
3. Industries we serve
4. How it works (3 steps)
5. Pricing preview
6. Portfolio preview
7. Trust section
8. FAQ accordion
9. Final CTA
10. Footer
11. Scroll popup (60% trigger)

### Services (/services)
- Three pricing tiers: Starter ($2K), Growth ($5K), Enterprise ($8K+)
- Monthly maintenance plans: Basic ($97), Standard ($197), Premium ($497)

### Work (/work)
- 5 spec portfolio projects with filters
- Industries: Home Services, Med Spas, Restaurants
- Projects: Reliable Plumbing, Peak HVAC, Summit Roofing, Lumière Med Spa, The Oak Table

### About (/about)
- Founder bio (Chris Hatfield)
- 5-step build system
- CTA to book audit

### Contact (/contact)
- Inline Calendly embed
- Contact form with validation
- No page redirect on submit

## 🔒 Hard Rules (Verified)

✅ **NO phone numbers anywhere**
✅ **NO email addresses displayed** (only form inputs)
✅ **NO social media links or icons**
✅ **NO chat widgets** (Crisp, Intercom, etc.)
✅ **All CTAs open Calendly modal** (never new tab)
✅ **Contact form shows inline success message**
✅ **Scroll popup only on homepage**
✅ **All 5 portfolio projects have realistic content**

## 🎯 SEO

- Next.js Metadata API used for all pages
- LocalBusiness JSON-LD schema on homepage
- Proper Open Graph tags on every page
- Google Fonts loaded with `font-display: swap`
- Target: 90+ Lighthouse score

## 📦 Deployment

### Vercel (Recommended)

```bash
# Deploy to production
npm run deploy

# Or use Vercel CLI
vercel --prod
```

### Environment Variables

Required for Vercel:
- `CALENDLY_URL` (if you want to customize the Calendly link)

The site uses Calendly popup integration - make sure the URL in components matches your Calendly link:
`https://calendly.com/c-hatfield309/30min`

## 🧪 Testing

### Responsive Breakpoints
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

### Browser Testing
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

## 📝 Content Guidelines

### Positioning Statement (Use Verbatim)
"We build websites that generate leads for local businesses — guaranteed, or we fix it free."

### Target Industries
1. Home service businesses (plumbing, HVAC, roofing)
2. Med spas & aesthetics
3. Restaurants & food businesses

### Service Areas
- Primary: Houston, TX (especially Katy)
- Secondary: All remote/online clients across the US

## 🔧 Customization

### Update Calendly URL
Search for `calendly.com/c-hatfield309/30min` and replace with your Calendly link in:
- `/src/components/Navigation.tsx`
- `/src/components/CalendlyModal.tsx`
- `/src/components/home/*.tsx` (all CTA buttons)
- `/src/components/services/*.tsx`
- `/src/app/contact/page.tsx`

### Update Colors
Edit `/tailwind.config.js` to customize the color palette.

### Update Copy
All copy is in the component files under `/src/components/` and `/src/app/`.

## 📊 Performance Targets

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## 📞 Support

For questions or issues:
1. Check this README
2. Review the Next.js documentation
3. Check the Tailwind CSS documentation

---

Built by Pegrio | © 2025 Pegrio LLC. All rights reserved.
