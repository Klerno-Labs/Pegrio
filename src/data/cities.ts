export interface CityPage {
  slug: string
  name: string
  state: string
  headline: string
  subheadline: string
  description: string
  highlights: { title: string; text: string }[]
  neighborhoods: string[]
}

export const cityPages: CityPage[] = [
  {
    slug: 'houston',
    name: 'Houston',
    state: 'TX',
    headline: 'Website Design in Houston, TX',
    subheadline: 'Custom websites for Houston businesses — built to rank on Google and bring you customers.',
    description: 'Pegrio builds high-performance websites for local businesses in Houston, TX. Custom design, SEO optimization, and lead generation for plumbers, restaurants, med spas, and more. Starting at $2,000.',
    highlights: [
      { title: 'Based in Houston', text: 'We know the local market, the competition, and what Houston customers expect from a business website.' },
      { title: 'Built for Local SEO', text: 'Every site is optimized for Houston search terms — so your business shows up when locals search for what you offer.' },
      { title: 'Proven Results', text: 'Our Houston-area clients have hit page 1 on Google, improved page speed to 90+, and started generating leads within weeks of launch.' },
    ],
    neighborhoods: ['Montrose', 'Heights', 'Midtown', 'Galleria', 'Memorial', 'River Oaks', 'The Woodlands', 'Spring', 'Cypress', 'Pearland'],
  },
  {
    slug: 'katy',
    name: 'Katy',
    state: 'TX',
    headline: 'Website Design in Katy, TX',
    subheadline: 'Professional websites for Katy businesses — designed to compete and win online.',
    description: 'Custom website design for businesses in Katy, TX. Pegrio builds fast, SEO-optimized websites for home service companies, restaurants, and local businesses in the Katy area. Starting at $2,000.',
    highlights: [
      { title: 'Serving the Katy Area', text: 'From Cinco Ranch to Cross Creek Ranch — we build websites for businesses across the Katy community and west Houston corridor.' },
      { title: 'Fast-Growing Market', text: 'Katy is booming. Stand out from competitors before they invest in their online presence.' },
      { title: 'Local Search Focus', text: 'We optimize for Katy-specific search terms so homeowners and locals find your business first.' },
    ],
    neighborhoods: ['Cinco Ranch', 'Seven Meadows', 'Firethorne', 'Cane Island', 'Cross Creek Ranch', 'Elyson', 'Tamarron'],
  },
  {
    slug: 'sugar-land',
    name: 'Sugar Land',
    state: 'TX',
    headline: 'Website Design in Sugar Land, TX',
    subheadline: 'Custom websites for Sugar Land businesses — built for the modern local economy.',
    description: 'Pegrio designs custom websites for businesses in Sugar Land, TX. SEO-optimized, mobile-responsive websites for restaurants, med spas, home services, and more. Starting at $2,000.',
    highlights: [
      { title: 'Fort Bend County Focus', text: 'We serve Sugar Land and Fort Bend County businesses with websites that match the area\'s upscale, professional market.' },
      { title: 'Diverse Community', text: 'Sugar Land is one of the most diverse cities in America. We build sites that connect with your specific audience.' },
      { title: 'Competitive Edge', text: 'Most local businesses in Sugar Land still have outdated websites. A modern, fast site puts you ahead immediately.' },
    ],
    neighborhoods: ['Town Square', 'New Territory', 'Sweetwater', 'Telfair', 'Riverstone', 'Commonwealth', 'First Colony'],
  },
]

export function getCityPage(slug: string): CityPage | undefined {
  return cityPages.find(c => c.slug === slug)
}

export function getAllCitySlugs(): string[] {
  return cityPages.map(c => c.slug)
}
