# 📊 Google Analytics 4 Setup Guide

## Step 1: Create Google Analytics Account

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Click **"Start measuring"** or **"Create Account"**
3. Fill in:
   - **Account Name**: `Pegrio` (or your business name)
   - Check the data sharing settings you're comfortable with
4. Click **"Next"**

## Step 2: Create Property

1. Fill in:
   - **Property Name**: `Pegrio Website`
   - **Reporting Time Zone**: Your timezone
   - **Currency**: USD (or your currency)
2. Click **"Next"**

## Step 3: Business Information

1. Select:
   - **Industry**: Technology / Internet & Telecom
   - **Business Size**: Select your size
   - **How you intend to use Google Analytics**: Check relevant boxes
2. Click **"Create"**

## Step 4: Accept Terms

1. Read and accept the Terms of Service
2. Accept Data Processing Amendment (if in EU/UK)
3. Click **"I Accept"**

## Step 5: Set Up Data Stream

1. Click **"Web"** (since this is a website)
2. Fill in:
   - **Website URL**: `https://yourdomain.com` (or your Vercel URL for now)
   - **Stream Name**: `Pegrio Website`
   - Enable **Enhanced Measurement** (recommended)
3. Click **"Create Stream"**

## Step 6: Get Your Measurement ID

After creating the stream, you'll see:

```
MEASUREMENT ID
G-XXXXXXXXXX
```

**This is your Google Analytics ID!** Copy it.

## Step 7: Add to Your Website

1. Open `/Users/hatfield/Desktop/Pegrio/analytics.js`
2. Find line 11:
   ```javascript
   googleAnalyticsId: 'G-XXXXXXXXXX',  // Replace this
   ```
3. Replace `'G-XXXXXXXXXX'` with your actual ID:
   ```javascript
   googleAnalyticsId: 'G-ABC123DEF4',  // Your real ID
   ```
4. Save the file

## Step 8: Verify It's Working

### Method 1: Real-Time Reports
1. Go to **Analytics Dashboard**
2. Click **Reports** → **Realtime**
3. Open your website in another tab
4. You should see yourself as "1 user right now"

### Method 2: Browser DevTools
1. Open your website
2. Press `F12` → **Network** tab
3. Filter by "google-analytics"
4. Click a button on your site
5. You should see requests to `google-analytics.com/g/collect`

## Step 9: Set Up Conversions (Important!)

1. In GA4, go to **Admin** → **Events**
2. Click **"Create event"** or **"Mark as conversion"**
3. Find the event `generate_lead`
4. Toggle **"Mark as conversion"** to ON
5. This tracks form submissions as conversions!

## What Gets Tracked Automatically

Your Pegrio website tracks:
- ✅ Page views
- ✅ Scroll depth (25%, 50%, 75%, 90%, 100%)
- ✅ Time on page
- ✅ Button clicks (`Package_Viewed`, `CTA_Clicked`, `Demo_Clicked`)
- ✅ Form submissions (`generate_lead`) 💰
- ✅ Performance metrics (LCP, FID, CLS)

## Useful Reports to Check

### Traffic Sources
**Reports** → **Acquisition** → **Traffic acquisition**
- See where visitors come from (Google, Facebook, Direct, etc.)

### User Behavior
**Reports** → **Engagement** → **Pages and screens**
- See which pages get the most views
- See how long people spend on each page

### Conversions
**Reports** → **Engagement** → **Conversions**
- See how many quote requests you get
- Track conversion rate

### Real-Time
**Reports** → **Realtime**
- See who's on your site RIGHT NOW
- Great for testing

## Troubleshooting

### Not seeing data?
1. Check your Measurement ID is correct in `analytics.js`
2. Make sure you deployed the updated `analytics.js` file
3. Disable browser ad blockers
4. Wait 24-48 hours for historical reports (Real-time works immediately)

### Events not showing?
1. Check browser DevTools → Console for errors
2. Verify `analytics.js` is loading (check Network tab)
3. Make sure you're not in development mode with ad blockers

## Pro Tips

1. **Set up Goals**: Mark `generate_lead` as a conversion (see Step 9)
2. **Create Custom Reports**: Focus on metrics that matter for your business
3. **Enable Demographics**: Admin → Property Settings → Data Collection
4. **Link to Google Ads**: If you run ads, link your accounts for better tracking
5. **Set up Alerts**: Get notified of traffic spikes or drops

---

**Next**: Set up Facebook Pixel (see FACEBOOK-PIXEL-SETUP.md)
