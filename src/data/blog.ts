export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'callout' | 'comparison-table'
  text?: string
  items?: string[]
  rows?: { label: string; col1: string; col2: string }[]
  level?: 2 | 3
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedDate: string
  author: string
  readingTime: string
  category: string
  content: BlogContentBlock[]
  ctaText: string
  ctaHref: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'small-business-website-cost-2026',
    title: 'How Much Does a Small Business Website Cost in 2026?',
    description: 'A transparent breakdown of website costs in 2026 — from DIY builders to custom agencies. Real numbers, no fluff, so you can make the right decision for your business.',
    publishedDate: '2026-03-01',
    author: 'Chris Hatfield',
    readingTime: '7 min read',
    category: 'Pricing',
    ctaText: 'See Our Packages',
    ctaHref: '/websites',
    content: [
      { type: 'paragraph', text: 'It\'s the first question every business owner asks — and the answer you usually get is "it depends." That\'s technically true, but it\'s not helpful. So here are real numbers based on what businesses actually pay in 2026.' },
      { type: 'heading', level: 2, text: 'The Three Main Options' },
      { type: 'heading', level: 3, text: '1. DIY Website Builders (Wix, Squarespace, WordPress.com)' },
      { type: 'paragraph', text: 'Cost: $150 – $500 per year. You pick a template, drag and drop your content, and publish. It works. For a hobby site, a personal blog, or a side project with zero budget, this is fine.' },
      { type: 'paragraph', text: 'The catch: you\'re spending your own time (which has value), the SEO is limited, performance is mediocre, and you\'re locked into their platform. If you ever want to leave, you start over.' },
      { type: 'heading', level: 3, text: '2. Freelancer' },
      { type: 'paragraph', text: 'Cost: $1,000 – $5,000. A freelancer builds something custom for you. Quality varies wildly — some are talented designers, others are reselling templates. You usually get a good-looking site, but ongoing support can be hit or miss.' },
      { type: 'paragraph', text: 'The risk: freelancers disappear. They get busy, take a full-time job, or just stop responding. Six months later you need a change and nobody\'s there to help.' },
      { type: 'heading', level: 3, text: '3. Professional Agency' },
      { type: 'paragraph', text: 'Cost: $2,000 – $15,000+. An agency builds a custom site with strategy behind it — SEO, conversion optimization, performance, and ongoing support. You\'re paying for a team, a process, and accountability.' },
      { type: 'paragraph', text: 'At Pegrio, our website packages start at $2,000 for a 5-page site and go up to $8,000+ for enterprise builds with e-commerce, booking systems, or custom functionality. Fixed pricing, no hourly rates, no surprises.' },
      { type: 'heading', level: 2, text: 'Side-by-Side Comparison' },
      { type: 'comparison-table', rows: [
        { label: 'Upfront Cost', col1: '$0 – $500', col2: '$2,000 – $8,000+' },
        { label: 'Monthly Cost', col1: '$15 – $50/mo', col2: '$0 (or $97/mo maintenance)' },
        { label: 'Timeline', col1: '1 – 3 days', col2: '2 – 3 weeks' },
        { label: 'Design', col1: 'Template', col2: 'Custom for your brand' },
        { label: 'SEO', col1: 'Basic', col2: 'Built-in from day one' },
        { label: 'Page Speed', col1: '50 – 70', col2: '90+' },
        { label: 'Ongoing Support', col1: 'DIY or forums', col2: 'Dedicated team' },
        { label: 'You Own the Code', col1: 'No', col2: 'Yes' },
      ]},
      { type: 'heading', level: 2, text: 'What Actually Drives the Price Up' },
      { type: 'list', items: [
        'Number of pages — a 5-page site is simpler than a 20-page site',
        'Custom design vs. template — original design work takes more time',
        'E-commerce or booking systems — payment processing and integrations add complexity',
        'Content creation — if you need copywriting, photography, or video',
        'SEO strategy — basic meta tags vs. full keyword research and content optimization',
        'Ongoing maintenance — hosting, updates, security, and content changes',
      ]},
      { type: 'heading', level: 2, text: 'The Question You Should Actually Be Asking' },
      { type: 'callout', text: 'The real question isn\'t "how much does a website cost?" It\'s "how much is it costing me NOT to have a good website?" If your current site isn\'t generating leads, ranking on Google, or converting visitors — that\'s money you\'re leaving on the table every single day.' },
      { type: 'paragraph', text: 'A $2,000 website that brings in even one extra customer per month pays for itself within weeks for most service businesses. A plumber\'s average job is $300+. A med spa treatment is $200+. A restaurant table averages $50+. The math works.' },
      { type: 'heading', level: 2, text: 'What We Recommend' },
      { type: 'paragraph', text: 'If your business depends on getting customers from the internet — and in 2026, almost every business does — invest in a professional website. It doesn\'t have to be expensive, but it has to be done right.' },
      { type: 'paragraph', text: 'Our Starter package at $2,000 includes a 5-page custom site, mobile-responsive design, basic SEO, and 30 days of support. It\'s built on Next.js and Tailwind CSS — the same technology used by Netflix, Nike, and Notion. No templates, no page builders, no shortcuts.' },
    ],
  },
  {
    slug: 'restaurant-needs-new-website',
    title: '5 Signs Your Restaurant Needs a New Website',
    description: 'Your food might be amazing, but if your website is outdated, slow, or hard to use on a phone, you\'re losing customers before they ever walk through the door.',
    publishedDate: '2026-03-01',
    author: 'Chris Hatfield',
    readingTime: '5 min read',
    category: 'Industry',
    ctaText: 'Get a Free Website Audit',
    ctaHref: '/contact',
    content: [
      { type: 'paragraph', text: '77% of diners check a restaurant\'s website before deciding where to eat. That\'s not a guess — it\'s data from the National Restaurant Association. Your website is your first impression, and for most customers, it happens before they ever taste your food.' },
      { type: 'paragraph', text: 'Here are five signs it\'s time for a new one.' },
      { type: 'heading', level: 2, text: '1. Your Menu Is a PDF (Or Worse, an Image)' },
      { type: 'paragraph', text: 'PDF menus are one of the biggest mistakes restaurants make online. They\'re impossible to read on a phone without pinching and zooming. Google can\'t index them properly, so your dishes never show up in search results. And they\'re a pain to update — so they often have wrong prices or missing items.' },
      { type: 'paragraph', text: 'A modern restaurant website has the menu built directly into the page — searchable, mobile-friendly, and easy to update whenever you change a dish or price.' },
      { type: 'heading', level: 2, text: '2. It Doesn\'t Look Good on a Phone' },
      { type: 'paragraph', text: 'Over 60% of restaurant searches happen on mobile devices. If your site isn\'t mobile-responsive — meaning it looks and works great on any screen size — you\'re turning away the majority of potential customers.' },
      { type: 'paragraph', text: 'Tiny text, horizontal scrolling, buttons too small to tap, images that take forever to load — these are all deal-breakers. People will just go to the next restaurant in their search results.' },
      { type: 'heading', level: 2, text: '3. Your Hours, Address, or Menu Are Wrong' },
      { type: 'paragraph', text: 'Nothing kills trust faster than showing up to a restaurant that\'s closed when the website said it was open. Or finding out the prices are different from what was listed online. Or discovering the daily special from three months ago is still on the homepage.' },
      { type: 'paragraph', text: 'If your website is hard to update, it probably doesn\'t get updated. And outdated information sends customers to your competitors.' },
      { type: 'heading', level: 2, text: '4. You\'re Not Showing Up on Google' },
      { type: 'paragraph', text: 'Search "Thai food near me" or "best tacos in Houston." If your restaurant doesn\'t show up on the first page, you\'re invisible to the people actively looking for what you serve.' },
      { type: 'paragraph', text: 'Google uses your website\'s speed, content, structure, and mobile experience to decide where to rank you. An old, slow, poorly structured site gets buried. A fast, well-built site with proper schema markup and local SEO gets found.' },
      { type: 'heading', level: 2, text: '5. Your Website Looks Like It Was Built in 2015' },
      { type: 'paragraph', text: 'Design trends change. A site that looked modern 5 years ago now looks dated — stock photos of generic food, tiny fonts, cluttered layouts, a "Welcome to our website" headline. Customers judge your food by your website. A dated site makes your restaurant feel dated too.' },
      { type: 'paragraph', text: 'Modern restaurant sites are clean, fast, and image-forward. Big photos of your actual food. Clear calls to action. Easy-to-find hours, location, and menu. That\'s it.' },
      { type: 'heading', level: 2, text: 'What a Modern Restaurant Website Actually Needs' },
      { type: 'list', items: [
        'Fast mobile experience — loads in under 2 seconds on any phone',
        'Real menu built into the page — not a PDF download',
        'Current hours, address, and phone number — easy to find',
        'Google Maps integration — so customers can get directions in one tap',
        'Online ordering or reservation link — remove friction from the buying decision',
        'Photos of your actual food and space — not stock images',
        'Google Business Profile connected — so reviews show up in search',
      ]},
      { type: 'callout', text: 'We\'ve built restaurant websites that load in under 1.5 seconds, feature full interactive menus, and integrate with online ordering platforms. If you\'re curious what a modern restaurant site looks like, check out our portfolio.' },
      { type: 'paragraph', text: 'Your food does the talking once people walk in. Your website\'s job is to get them through the door.' },
    ],
  },
  {
    slug: 'plumbing-company-website-competitors',
    title: 'Why Your Plumbing Company Is Losing Customers to Competitors With Better Websites',
    description: 'When a pipe bursts, homeowners Google. What they see in 3 seconds determines who gets the call. Here\'s what your competitor\'s website has that yours doesn\'t.',
    publishedDate: '2026-03-01',
    author: 'Chris Hatfield',
    readingTime: '6 min read',
    category: 'Industry',
    ctaText: 'Start Your Project',
    ctaHref: '/order',
    content: [
      { type: 'paragraph', text: 'When a pipe bursts at 2 AM, nobody opens a phone book. They grab their phone and search "emergency plumber near me." In 3 seconds, they decide who to call based on what they see. If your website looks outdated, loads slowly, or doesn\'t have your phone number front and center — they\'re calling your competitor instead.' },
      { type: 'heading', level: 2, text: 'The 3-Second Decision' },
      { type: 'paragraph', text: 'Studies show users form an opinion about a website in 0.05 seconds. For plumbers, the decision is even faster because the person searching is usually in a hurry — they have water on the floor, a clogged drain, or no hot water. They\'re not browsing. They\'re deciding.' },
      { type: 'paragraph', text: 'They\'re looking for three things: Can I trust this company? Can I reach them right now? Do they serve my area? If your website doesn\'t answer all three instantly, you lose the job.' },
      { type: 'heading', level: 2, text: 'What Your Competitor\'s Website Has That Yours Doesn\'t' },
      { type: 'list', items: [
        'Phone number above the fold — big, clickable, impossible to miss. Not buried in a "Contact Us" page.',
        'Service area pages — individual pages for each city they serve. "Plumber in Katy TX" and "Plumber in Sugar Land TX" rank separately.',
        'Google reviews displayed on the site — social proof that builds instant trust.',
        'Fast mobile load time — under 2 seconds. Slow sites get skipped.',
        'Emergency CTA — "Call Now for Same-Day Service" is specific and urgent.',
        'Trust signals — licensed, insured, bonded, years in business, number of jobs completed.',
      ]},
      { type: 'heading', level: 2, text: 'The Real Cost of a Bad Website' },
      { type: 'paragraph', text: 'Let\'s do the math. The average plumbing job is $300–$500. If your website loses you just 2 calls per week — and for a bad site, that\'s conservative — you\'re losing $2,500–$4,000 per month in revenue. That\'s $30,000–$48,000 per year.' },
      { type: 'paragraph', text: 'A professional website costs $2,000–$5,000. It pays for itself in the first month.' },
      { type: 'paragraph', text: 'Even worse: if you\'re paying for Google Ads but sending that traffic to a bad website, you\'re burning money. Great ads sending people to a site that looks like it was built in 2010 is like paying for a billboard that says "Don\'t call us."' },
      { type: 'heading', level: 2, text: 'What a Plumber\'s Website Should Actually Look Like' },
      { type: 'list', items: [
        'Clickable phone number in the header on every page',
        'List of services with individual pages (drain cleaning, water heater, sewer line, etc.)',
        'Service area pages targeting each city and neighborhood',
        'Before/after photos of real jobs',
        'Customer reviews pulled from Google',
        'Schema markup so Google shows your business info in search results',
        'Mobile-first design — because 70%+ of your visitors are on phones',
        'Fast load time — 90+ Google PageSpeed score',
      ]},
      { type: 'callout', text: 'We built a website for a Katy, TX plumbing company that ranked on page 1 of Google within 60 days of launch — with zero ad spend. The site loads in under 1.5 seconds, has service area pages for every city they cover, and generates consistent leads through organic search.' },
      { type: 'heading', level: 2, text: 'Your Truck Is Wrapped. Your Uniforms Are Clean. What About Your Website?' },
      { type: 'paragraph', text: 'You\'d never send a technician to a job in a rusty van with no logo. But that\'s exactly what a bad website does — it makes your company look unprofessional before you ever get a chance to show your work.' },
      { type: 'paragraph', text: 'Your website is your most-seen marketing asset. More people see it than your truck, your business cards, or your yard signs combined. Make it count.' },
    ],
  },
  {
    slug: 'wix-vs-custom-website',
    title: 'Wix vs Custom Website: What\'s Actually Better for Your Business?',
    description: 'An honest comparison of Wix and custom-built websites. Both have a place — here\'s how to know which one is right for your business.',
    publishedDate: '2026-03-01',
    author: 'Chris Hatfield',
    readingTime: '6 min read',
    category: 'Comparison',
    ctaText: 'See What Custom Looks Like',
    ctaHref: '/work',
    content: [
      { type: 'paragraph', text: 'Let\'s be honest up front: Wix isn\'t bad. For certain situations, it\'s actually the right choice. But for businesses that depend on their website to generate revenue — it usually isn\'t. Here\'s why.' },
      { type: 'heading', level: 2, text: 'When Wix Makes Sense' },
      { type: 'list', items: [
        'You\'re building a hobby site, portfolio, or personal blog',
        'Your budget is genuinely under $500 and you have time to build it yourself',
        'You don\'t need to rank on Google for competitive terms',
        'Your website is informational, not a lead generation tool',
      ]},
      { type: 'paragraph', text: 'If that describes you, use Wix. Seriously. There\'s no shame in it, and it\'ll save you money. But if your business depends on getting found online and converting visitors into customers, keep reading.' },
      { type: 'heading', level: 2, text: 'When a Custom Website Makes Sense' },
      { type: 'list', items: [
        'Your business depends on leads from the internet',
        'You need to rank on Google for local search terms',
        'You want specific functionality (booking, ordering, e-commerce)',
        'Professional credibility matters to your customers',
        'You\'re paying for ads and need a site that converts',
      ]},
      { type: 'heading', level: 2, text: 'The Real Comparison' },
      { type: 'comparison-table', rows: [
        { label: 'Page Speed (Google)', col1: '40 – 65', col2: '90+' },
        { label: 'SEO Control', col1: 'Limited', col2: 'Full control' },
        { label: 'Design', col1: 'Template-based', col2: 'Custom for your brand' },
        { label: 'Code Ownership', col1: 'No — locked to Wix', col2: 'Yes — you own everything' },
        { label: 'Monthly Cost', col1: '$17 – $45/mo forever', col2: '$0 – $97/mo maintenance' },
        { label: 'Upfront Cost', col1: '$0 – $200', col2: '$2,000+' },
        { label: 'Scalability', col1: 'Limited', col2: 'Unlimited' },
        { label: 'Load Time', col1: '3 – 6 seconds', col2: 'Under 2 seconds' },
      ]},
      { type: 'heading', level: 2, text: 'The SEO Reality' },
      { type: 'paragraph', text: 'This is where the gap is biggest. Wix generates heavy, JavaScript-bloated pages that Google struggles to crawl efficiently. The average Wix site scores 40–65 on Google PageSpeed Insights. A well-built custom site scores 90+.' },
      { type: 'paragraph', text: 'Google has explicitly stated that page speed is a ranking factor. Core Web Vitals — metrics like Largest Contentful Paint, First Input Delay, and Cumulative Layout Shift — directly affect where you show up in search results. Wix sites consistently underperform on these metrics.' },
      { type: 'paragraph', text: 'For local businesses competing for "plumber near me" or "best restaurant in Houston," this difference is the difference between page 1 and page 3. And nobody clicks page 3.' },
      { type: 'heading', level: 2, text: 'The Ownership Question' },
      { type: 'paragraph', text: 'When you build on Wix, you don\'t own your website. You\'re renting it. If Wix raises prices, changes features, or shuts down — you lose everything. You can\'t export a Wix site and move it somewhere else. You start from scratch.' },
      { type: 'paragraph', text: 'With a custom-built website, you own the code. You can host it anywhere. You can hire any developer to work on it. You\'re not locked into any platform, and nobody can take it away from you.' },
      { type: 'heading', level: 2, text: 'Our Honest Take' },
      { type: 'paragraph', text: 'We build custom websites, so obviously we have a bias. But we\'re not going to pretend every business needs a $2,000+ website. Some don\'t.' },
      { type: 'callout', text: 'If your website is a business tool — meaning it needs to generate leads, rank on Google, and make your company look professional — a custom website pays for itself. If your website is just an online business card that nobody searches for, Wix is fine.' },
      { type: 'paragraph', text: 'The businesses we work with — plumbers, restaurants, med spas, salons — all depend on being found online. For them, the performance gap between Wix and a custom site is the gap between getting found and being invisible. That\'s why they invest in custom.' },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(p => p.slug)
}
