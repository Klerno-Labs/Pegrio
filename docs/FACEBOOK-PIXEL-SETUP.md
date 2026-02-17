# 📘 Facebook Pixel Setup Guide

## What is Facebook Pixel?

Facebook Pixel tracks visitor actions on your website, helping you:
- Measure ad effectiveness
- Build targeted audiences for ads
- Track conversions from Facebook/Instagram ads
- Retarget website visitors

**Note**: Only needed if you plan to run Facebook/Instagram ads.

---

## Step 1: Access Facebook Events Manager

1. Go to **[facebook.com/events_manager](https://facebook.com/events_manager)**
2. Sign in to your Facebook account
3. Select your business (or create one if first time)

## Step 2: Create a Pixel

1. Click **"Connect Data Sources"** or the **+** button
2. Select **"Web"**
3. Select **"Facebook Pixel"**
4. Click **"Connect"**

## Step 3: Name Your Pixel

1. **Pixel Name**: `Pegrio Website Pixel`
2. **Website URL**: `https://yourdomain.com` (optional)
3. Click **"Create Pixel"**

## Step 4: Get Your Pixel ID

After creating the pixel, you'll see:

```
Pixel ID: 123456789012345
```

**This is your Facebook Pixel ID!** Copy it (just the numbers).

## Step 5: Skip Manual Installation

Facebook will offer setup options:
1. ❌ **Manually add pixel code** - Skip this (we already have it!)
2. ❌ **Use a partner integration** - Skip this
3. ✅ Click **"Continue"** or **"Done"**

We already have Facebook Pixel integrated in your website!

## Step 6: Add to Your Website

1. Open `/Users/hatfield/Desktop/Pegrio/analytics.js`
2. Find line 12:
   ```javascript
   facebookPixelId: 'YOUR_PIXEL_ID',  // Replace this
   ```
3. Replace with your actual Pixel ID:
   ```javascript
   facebookPixelId: '123456789012345',  // Your real ID
   ```
4. Save the file

## Step 7: Verify It's Working

### Method 1: Facebook Pixel Helper Extension
1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) for Chrome
2. Visit your website
3. Click the extension icon
4. Should show: ✅ "PageView" event detected

### Method 2: Events Manager
1. Go to **Events Manager**
2. Click your pixel
3. Click **"Test Events"**
4. Enter your website URL
5. Open your website
6. You should see events appearing in real-time!

### Method 3: Browser DevTools
1. Open your website
2. Press `F12` → **Network** tab
3. Filter by "facebook"
4. Click a button
5. Should see requests to `facebook.com/tr`

## What Gets Tracked

Your Pegrio website automatically tracks:
- ✅ **PageView** - Every page view
- ✅ **Lead** - Form submissions (quote requests) 💰
- ✅ **Package_Viewed** - When someone clicks a pricing package
- ✅ **Demo_Clicked** - When someone views a demo site
- ✅ **CTA_Clicked** - Call-to-action button clicks

## Set Up Conversions

1. In **Events Manager**, click your pixel
2. Go to **"Aggregated Event Measurement"**
3. Click **"Configure Web Events"**
4. Add **"Lead"** as a conversion event
5. Assign it value priority 1
6. Save

This tells Facebook that "Lead" events are important conversions!

## Privacy & Compliance

Your website already includes:
- ✅ Respect for Do Not Track setting
- ✅ GDPR-friendly implementation
- ✅ Event data minimization

**Recommended**: Add a cookie consent banner if targeting EU users.

## Using Facebook Pixel for Ads

### 1. Build Custom Audiences
**Events Manager** → **Audiences** → **Create Audience**
- Website visitors (last 30/60/90 days)
- People who viewed pricing
- People who submitted quote (exclude - they already converted!)

### 2. Track Ad Performance
When running Facebook/Instagram ads:
- See which ads drive quote requests
- Calculate cost per lead
- Optimize for "Lead" events

### 3. Retargeting
- Show ads to people who visited but didn't submit quote
- Exclude people who already submitted (save money!)
- Create lookalike audiences from converters

## Troubleshooting

### Pixel not detected?
1. Check Pixel ID is correct in `analytics.js`
2. Deploy the updated file to your live site
3. Disable ad blockers
4. Clear browser cache

### Events not showing?
1. Check browser console for errors (`F12` → Console)
2. Verify `analytics.js` loaded (Network tab)
3. Wait a few minutes - events can take 1-5 minutes to appear

### Privacy errors?
1. Make sure you have a Privacy Policy page
2. Add cookie consent if needed
3. Check Facebook's Business Tools Terms

## Testing Conversions

1. Fill out your quote form
2. Submit it
3. Go to **Events Manager** → **Test Events**
4. Should see **"Lead"** event with:
   - Package name
   - Price value
   - Currency (USD)

## Pro Tips

1. **Don't use Pixel if not running ads** - Just leave it blank or set to null
2. **Test before running ads** - Verify events work first!
3. **Track value** - We automatically send package price with Lead events
4. **Create custom conversions** - For specific packages or price tiers
5. **Monitor regularly** - Check Events Manager weekly

---

## Quick Reference

```javascript
// In analytics.js
config: {
    googleAnalyticsId: 'G-XXXXXXXXXX',     // Get from Google Analytics
    facebookPixelId: '123456789012345',     // Get from Facebook Events Manager
    clarityId: 'abc123xyz',                 // Optional - Microsoft Clarity
    respectDoNotTrack: true                 // Privacy-friendly
}
```

---

**Next**: Deploy to production and test both GA4 and Facebook Pixel together!
