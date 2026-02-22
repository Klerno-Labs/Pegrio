export interface AppFeature {
  title: string
  description: string
}

export interface App {
  id: string
  name: string
  industry: string
  tagline: string
  description: string
  features: AppFeature[]
  demoUrl: string
  price: string
  priceLabel: string
  accentColor: string
}

export interface ComingSoonApp {
  id: string
  name: string
  industry: string
  tagline: string
  icon: string
}

export const featuredApp: App = {
  id: 'hemp-retail',
  name: 'Hemp Retail Manager',
  industry: 'Hemp & CBD Retail',
  tagline: 'The all-in-one app built for hemp retailers',
  description: 'Everything you need to run a compliant, profitable hemp retail business — inventory tracking, age verification, POS integration, customer loyalty, and sales analytics in one platform.',
  features: [
    { title: 'Real-Time Inventory', description: 'Track stock levels, set low-stock alerts, manage multiple locations from one dashboard' },
    { title: 'Compliance & Age Verification', description: 'Built-in age gates and compliance tracking to keep your business legal and protected' },
    { title: 'POS Integration', description: 'Connect to your existing point-of-sale system or use our built-in checkout flow' },
    { title: 'Customer Loyalty Program', description: 'Points, rewards, and repeat purchase tracking to keep customers coming back' },
    { title: 'Sales Analytics', description: 'Real-time dashboards showing revenue, top products, peak hours, and growth trends' },
    { title: 'Multi-Location Support', description: 'Manage inventory, staff, and reporting across all your store locations' },
  ],
  demoUrl: 'https://thcplusapp.vercel.app',
  price: 'Custom',
  priceLabel: 'pricing based on your needs',
  accentColor: '#C9A84C',
}

export const comingSoonApps: ComingSoonApp[] = [
  {
    id: 'medspa',
    name: 'Med Spa Suite',
    industry: 'Med Spas & Aesthetics',
    tagline: 'Booking, intake forms, before/after galleries, and client management',
    icon: 'Sparkles',
  },
  {
    id: 'restaurant',
    name: 'Restaurant Hub',
    industry: 'Restaurants & Food',
    tagline: 'Online ordering, table management, menu builder, and loyalty rewards',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'home-services',
    name: 'Service Pro',
    industry: 'Home Services',
    tagline: 'Job scheduling, estimates, invoicing, and customer portal',
    icon: 'Wrench',
  },
  {
    id: 'fitness',
    name: 'Fitness Tracker',
    industry: 'Gyms & Studios',
    tagline: 'Class scheduling, member management, and payment processing',
    icon: 'Dumbbell',
  },
]

export const industries = [
  'Hemp & CBD',
  'Med Spas',
  'Restaurants',
  'Home Services',
  'Gyms & Studios',
  'Auto Repair',
  'Real Estate',
  'Pet Services',
]
