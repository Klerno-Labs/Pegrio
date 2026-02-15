# Restaurant Website Package Menu 🍽️

An interactive landing page for selling tiered restaurant website packages with integrated Stripe payments. Built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **Three-Tier Pricing**: Essential ($4,500), Professional ($8,500), Premium ($16,500)
- **Stripe Payment Integration**: Secure checkout that works perfectly on mobile
- **Flexible Payment Options**:
  - Pay in Full (5% discount)
  - 50/50 Split
  - Monthly Payment Plans
- **Responsive Design**: Mobile-first, looks great on all devices
- **Interactive Modals**: Beautiful payment selection UI
- **Success Page**: Post-payment confirmation with next steps

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Stripe

1. **Create a Stripe account** at [https://stripe.com](https://stripe.com)
2. **Get your API keys** from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Create `.env.local` file** in the project root:

```bash
cp .env.local.example .env.local
```

4. **Add your Stripe keys** to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

> ⚠️ **IMPORTANT**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Mobile Payment Testing

The Stripe integration works seamlessly on mobile devices. To test on your phone:

### Option 1: Local Network Testing

1. Find your computer's local IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. On your phone (connected to same WiFi), visit:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

### Option 2: Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Visit your deployed URL on your phone

---

## 🧪 Testing Payments

Use Stripe's **test card numbers**:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

For all test cards:
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## 📦 Project Structure

```
My Menu/
├── app/
│   ├── api/
│   │   └── create-checkout/
│   │       └── route.ts          # Stripe checkout API endpoint
│   ├── success/
│   │   └── page.tsx              # Post-payment success page
│   ├── globals.css               # Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main landing page
├── components/                   # Reusable components (if needed)
├── public/                       # Static assets
├── .env.local.example            # Example environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎨 Customization

### Pricing Tiers

Edit pricing in [app/page.tsx](app/page.tsx):

```typescript
const packages = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    price: 4500,  // Change price here
    // ...
  },
  // ...
]
```

### Colors & Styling

Edit Tailwind colors in [tailwind.config.js](tailwind.config.js):

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Change brand color
        // ...
      },
    },
  },
}
```

### Payment Calculation

Modify payment logic in [app/page.tsx](app/page.tsx):

```typescript
const calculatePrice = (basePrice: number, type: 'full' | 'split' | 'monthly') => {
  switch (type) {
    case 'full':
      return basePrice * 0.95  // 5% discount
    // ...
  }
}
```

---

## 💳 Stripe Webhook Setup (Optional)

For production, you should set up webhooks to handle post-payment actions:

1. **Create webhook endpoint**: `app/api/webhooks/stripe/route.ts`
2. **Add webhook URL** in Stripe Dashboard
3. **Handle events** like `checkout.session.completed`

Example webhook handler:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      // Handle successful payment
      // - Send confirmation email
      // - Create project in your database
      // - Notify team
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

3. **Add Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_SECRET_KEY
   ```

### Other Hosting Options

- **Netlify**: Supports Next.js
- **Railway**: Easy deployment
- **DigitalOcean App Platform**: Good for custom domains

---

## 📊 Revenue Calculator

Based on the pricing model:

| Scenario | Monthly Projects | Monthly Revenue |
|----------|-----------------|-----------------|
| Conservative | 2 Essential + 2 Professional | $26,000 |
| Moderate | 1 Essential + 4 Professional + 1 Premium | $55,000 |
| Optimistic | 2 Professional + 2 Premium per week | $170,000 |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📝 To-Do List (Optional Enhancements)

- [ ] Add demo site previews (actual restaurant sites)
- [ ] Build contact form for inquiries
- [ ] Add testimonials section
- [ ] Create admin dashboard for managing orders
- [ ] Implement email notifications (SendGrid, Resend)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Create blog for SEO
- [ ] Add live chat support

---

## 🤝 Support

Questions or issues? Reach out:

- **Email**: your-email@example.com
- **Website**: your-website.com

---

## 📄 License

MIT License - feel free to use this for your business!

---

## 🎯 Next Steps

1. **Customize branding**: Update colors, fonts, and copy to match your brand
2. **Build demo sites**: Create actual demo sites for each tier
3. **Set up email**: Configure transactional emails (order confirmations)
4. **Marketing**: Drive traffic with SEO, ads, or cold outreach
5. **Start selling**: Share the link with potential clients!

---

**Happy selling! 🚀**

This productized service model can generate $30k-$50k/month with Claude Code helping you deliver sites quickly.
