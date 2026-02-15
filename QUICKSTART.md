# 🚀 Quick Start Guide

Get your Restaurant Website Menu running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Stripe Keys

1. Go to [https://stripe.com](https://stripe.com) and create a free account
2. Get your API keys from [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
3. Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Open `.env.local` and add your keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

## Step 3: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## 📱 Test on Your Phone

### Method 1: Same WiFi Network

1. Find your IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac: Run `ifconfig` in Terminal

2. On your phone (same WiFi), visit:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

### Method 2: Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add your Stripe keys as environment variables
4. Done! Your site is live

---

## 💳 Test a Payment

Use Stripe's test card:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (12/34)
- **CVC**: Any 3 digits (123)
- **ZIP**: Any 5 digits (12345)

Click "Get Started" on any package, choose a payment option, and test it out!

---

## 🎨 Customize Your Branding

Edit [app/page.tsx](app/page.tsx):
- Change prices in the `packages` array
- Update company name
- Modify package features

Edit [tailwind.config.js](tailwind.config.js):
- Change colors to match your brand

---

## Need Help?

Check out the full [README.md](README.md) for detailed documentation!
