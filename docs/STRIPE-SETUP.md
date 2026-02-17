# 💳 Stripe Payment Setup Guide

Complete guide to setting up Stripe payments for Pegrio.

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Complete business verification (can use test mode while waiting)

### Step 2: Get API Keys
1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)
   ⚠️ **Never share your secret key!**

### Step 3: Add Keys to Environment

Create `.env.local` in your project root:

```bash
# Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx  # Get this in Step 5

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL=hello@yourdomain.com

# Domain
DOMAIN=yourdomain.com  # or localhost:3000 for testing
```

### Step 4: Install Dependencies

```bash
npm install
```

This installs:
- `stripe` - Stripe Node.js library
- `resend` - Email service
- `@supabase/supabase-js` - Database (for later)

### Step 5: Set Up Webhook (Important!)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "+ Add endpoint"
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/stripe-webhook
   ```
   For local testing:
   ```
   Use Stripe CLI (see Testing section below)
   ```

4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `customer.subscription.created` (for future)
   - ✅ `customer.subscription.updated` (for future)
   - ✅ `customer.subscription.deleted` (for future)

5. Click "Add endpoint"
6. **Copy the Webhook Signing Secret** (starts with `whsec_`)
7. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## 🧪 Testing Locally

### Option A: Stripe CLI (Recommended)

1. **Install Stripe CLI:**
   ```bash
   # Mac
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

4. **Copy the webhook signing secret** from the output:
   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

5. **Add to `.env.local`:**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

6. **Start your dev server:**
   ```bash
   vercel dev
   # or
   npm run dev
   ```

7. **Test a payment:**
   - Go to http://localhost:3000
   - Click a package button
   - Fill out the form
   - Click "Request Free Quote" (now redirects to Stripe)

### Option B: ngrok (Alternative)

If you don't want to use Stripe CLI:

1. Install ngrok: https://ngrok.com/download
2. Start your local server: `vercel dev`
3. In another terminal: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Add webhook in Stripe Dashboard: `https://abc123.ngrok.io/api/stripe-webhook`
6. Copy the webhook secret to `.env.local`

---

## 💳 Test Cards

Use these test card numbers in Stripe Checkout:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0025 0000 3155` | ✅ Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0000 0000 0002` | ❌ Card declined |

**Details to fill:**
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

---

## ✅ Verify It's Working

### 1. Test Checkout Flow

1. Go to your website
2. Click "Professional Package" ($5,000)
3. Fill out the quote form
4. Select "Full Payment"
5. Click submit
6. You should be redirected to Stripe Checkout
7. Use test card: `4242 4242 4242 4242`
8. Complete payment
9. You should see the success page with payment details

### 2. Check Stripe Dashboard

1. Go to [Stripe Dashboard → Payments](https://dashboard.stripe.com/payments)
2. You should see your test payment
3. Click on it to view details

### 3. Check Emails

You should receive 2 emails:
- **Customer confirmation** - Sent to the email used in checkout
- **Admin notification** - Sent to your `NOTIFICATION_EMAIL`

If emails aren't working, check your Resend API key.

### 4. Check Webhook Events

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your endpoint
3. You should see successful events:
   - `checkout.session.completed` ✅
   - `payment_intent.succeeded` ✅

---

## 🚀 Go Live (Production)

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle from "Test mode" to "Live mode"
2. Go to API keys
3. Copy your **LIVE** publishable and secret keys
4. Update Vercel environment variables:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   ```

### 2. Update Webhook

1. Create new webhook endpoint for production URL
2. Copy the LIVE webhook secret
3. Update Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### 3. Test Real Payment

⚠️ **Use a real card** - You'll be charged!

Or test with a refundable payment:
1. Make a payment
2. Immediately refund it in Stripe Dashboard

---

## 💡 Features Included

### ✅ One-Time Payments
- Full payment option
- 50% deposit option (automatically calculated)
- 3-month installment option

### ✅ Checkout Features
- Secure hosted checkout page (Stripe-branded)
- Multiple payment methods (credit card, debit card)
- Built-in fraud detection
- Mobile-optimized
- PCI compliance (Stripe handles it)
- Promotion codes support
- Automatic receipts

### ✅ Email Notifications
- Customer confirmation email with beautiful HTML template
- Admin notification with customer details
- Stripe receipt email (automatic)

### ✅ Payment Link Generation
- Custom payment links for post-call proposals
- Send personalized links after discovery calls
- Track which links are paid

---

## 📊 What Gets Tracked

### Customer Data
- Name
- Email
- Business name
- Phone number (collected at checkout)
- Billing address (collected at checkout)

### Payment Data
- Amount paid
- Package selected
- Payment type (full/deposit/installment)
- Order ID (Stripe session ID)
- Timestamp

### Metadata (Attached to Payment)
- Original quote message
- Business name
- Discovery call notes (for payment links)

---

## 🔒 Security Best Practices

### ✅ What We Do
- Never store card numbers (Stripe handles it)
- Webhook signature verification
- HTTPS only
- Environment variables for secrets
- Input validation and sanitization

### ⚠️ What You Should Do
- Never commit `.env.local` to Git
- Rotate API keys quarterly
- Monitor Stripe Dashboard for suspicious activity
- Enable Stripe Radar (fraud detection)
- Set up email alerts for large payments

---

## 🛠 Troubleshooting

### Payment Not Working

**Problem:** Form submission doesn't redirect to Stripe

**Solutions:**
1. Check browser console for errors
2. Verify `STRIPE_PUBLISHABLE_KEY` is set correctly
3. Check that Stripe.js loaded: View Source → search for "stripe"
4. Verify API endpoint: `/api/create-checkout-session` returns 200

**Problem:** "No such customer" error

**Solution:** This is normal in test mode - Stripe creates customers automatically

### Webhook Not Receiving Events

**Problem:** Payments succeed but no emails sent

**Solutions:**
1. Check webhook endpoint URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` matches dashboard
3. Check Vercel function logs: `vercel logs`
4. Test webhook manually in Stripe Dashboard

### Emails Not Sending

**Problem:** Webhook succeeds but no emails

**Solutions:**
1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for failed sends
3. Verify `NOTIFICATION_EMAIL` is set
4. Check spam folder

---

## 📞 Support

### Stripe Support
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

### Common Issues
1. **"Invalid API Key"** → Check you're using the right key (test vs live)
2. **"Webhook signature verification failed"** → Update `STRIPE_WEBHOOK_SECRET`
3. **"Amount must be an integer"** → We multiply by 100 to convert to cents
4. **Checkout not loading** → Check CORS settings in API route

---

## 🎯 Next Steps

After Stripe is working:
1. ✅ Test with real card in live mode
2. ✅ Set up Stripe Radar rules (fraud detection)
3. ✅ Configure email branding in Stripe
4. ✅ Add your logo to checkout
5. ✅ Set up recurring billing (for subscriptions - Phase 6)
6. ✅ Integrate with accounting software (QuickBooks, Xero)

---

**Your Stripe integration is production-ready!** 🎉
