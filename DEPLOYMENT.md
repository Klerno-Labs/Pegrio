# 🚀 Deployment Guide - Pegrio Website

Complete guide to deploying your production-ready Pegrio website.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Updated analytics IDs in `analytics.js`
- [ ] Created email service account (SendGrid/Resend)
- [ ] Generated API keys for email service
- [ ] Updated contact email addresses
- [ ] Replaced placeholder images (if needed)
- [ ] Tested all forms locally
- [ ] Verified all links work
- [ ] Checked mobile responsiveness

---

## 🎯 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ Zero configuration
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Serverless functions support
- ✅ Automatic deployments from Git
- ✅ Free tier available

### Step-by-Step Deployment

#### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect settings
5. Click "Deploy"

#### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# OR
RESEND_API_KEY=re_xxxxxxxxxxxxx

NOTIFICATION_EMAIL=hello@yourdomain.com
NODE_ENV=production
```

#### 4. Add Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

#### 5. Deploy API Function

Your API endpoint will be available at:
```
https://yourdomain.com/api/submit-quote
```

---

## 🌐 Option 2: Deploy to Netlify

### Step-by-Step Deployment

#### 1. Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Build settings:
   - Build command: (leave empty for static site)
   - Publish directory: `.`
5. Click "Deploy site"

#### 2. Configure Environment Variables

In Site Settings → Build & deploy → Environment:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# OR
RESEND_API_KEY=re_xxxxxxxxxxxxx

NOTIFICATION_EMAIL=hello@yourdomain.com
NODE_ENV=production
```

#### 3. Add Netlify Functions

For the API endpoint, you need to move the API file:

```bash
mkdir netlify/functions
cp api/submit-quote.js netlify/functions/
```

Update the form submission URL in `script.js`:
```javascript
const response = await fetch('/.netlify/functions/submit-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

---

## 📧 Email Service Setup

### Option A: Resend (Recommended - Easiest)

1. Go to [resend.com](https://resend.com)
2. Sign up for free account (3,000 emails/month free)
3. Verify your domain or use onboarding domain
4. Create API key
5. Add to environment variables

**Install package:**
```bash
npm install resend
```

### Option B: SendGrid

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up (100 emails/day free)
3. Verify sender email
4. Create API key with "Mail Send" permissions
5. Add to environment variables

**Install package:**
```bash
npm install @sendgrid/mail
```

---

## 🔧 Configuration

### 1. Update Analytics IDs

Edit `analytics.js`:

```javascript
config: {
    googleAnalyticsId: 'G-YOUR-GA4-ID',      // Replace this
    facebookPixelId: 'YOUR-PIXEL-ID',         // Replace this
    clarityId: 'YOUR-CLARITY-ID',             // Replace this (optional)
}
```

#### Get Google Analytics 4 ID:
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property
3. Copy Measurement ID (G-XXXXXXXXXX)

#### Get Facebook Pixel ID:
1. Go to [facebook.com/events_manager](https://facebook.com/events_manager)
2. Create Pixel
3. Copy Pixel ID

### 2. Update Contact Information

Update in `index.html` and `api/submit-quote.js`:
- Email addresses
- Phone numbers
- Social media links
- Business address

### 3. Update OpenGraph Image

Create a 1200x630px image and:
1. Save as `og-image.jpg` in root directory
2. Or update the URL in `index.html` meta tags

---

## 🧪 Testing Before Go-Live

### 1. Test Form Submission

```bash
curl -X POST https://yourdomain.com/api/submit-quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "business": "Test Business",
    "package": "Professional Package",
    "price": "$5,000",
    "paymentType": "full",
    "message": "Test message",
    "timestamp": "2026-02-16T12:00:00.000Z"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Quote request received successfully"
}
```

### 2. Test Analytics

1. Open browser DevTools → Network tab
2. Click a package button
3. Verify Google Analytics request sent
4. Check GA4 Real-Time reports

### 3. Test PWA

1. Open in Chrome
2. DevTools → Application → Service Workers
3. Verify service worker registered
4. Test "Add to Home Screen"

### 4. Test Accessibility

1. Run Lighthouse audit in DevTools
2. Target: 95+ accessibility score
3. Test keyboard navigation
4. Test with screen reader

---

## 📈 Performance Optimization

### After Deployment:

#### 1. Enable Compression

Vercel/Netlify enable this automatically. For other hosts:

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

#### 2. Monitor Performance

Use these tools monthly:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 🔒 Security Best Practices

### Post-Deployment:

1. **Enable HTTPS Only**
   - Force HTTPS redirects
   - Enable HSTS header

2. **Configure CSP**
   - Already in `vercel.json` and `_headers`
   - Monitor CSP reports

3. **Rate Limiting**
   - Add rate limiting to API endpoint
   - Use Vercel Edge Config or Upstash Redis

4. **Monitor for Issues**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor uptime (UptimeRobot, Pingdom)

---

## 🐛 Troubleshooting

### Form Submissions Not Working

1. Check API endpoint URL
2. Verify environment variables set correctly
3. Check email service API key is valid
4. Review server logs for errors
5. Test API endpoint directly (see Testing section)

### Analytics Not Tracking

1. Verify Measurement ID is correct
2. Check browser ad blockers disabled
3. View Network tab for blocked requests
4. Confirm analytics.js is loading

### PWA Not Installing

1. Must be served over HTTPS
2. Check service worker registration
3. Verify manifest.json is accessible
4. Ensure icons exist in /icons/ directory

### Images Not Loading

1. Check image URLs are correct
2. Verify images uploaded to deployment
3. Check Content Security Policy allows image domain
4. Test with browser cache disabled

---

## 📞 Support

If you need help deploying:

1. Check Vercel/Netlify documentation
2. Review error logs in deployment dashboard
3. Test locally first: `python3 -m http.server 8000`
4. Open DevTools Console for JavaScript errors

---

## ✅ Post-Launch Checklist

After successful deployment:

- [ ] Test all forms and buttons
- [ ] Verify analytics tracking
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Business Profile
- [ ] Monitor performance for first week
- [ ] Set up backup/monitoring alerts

---

**Congratulations! Your top 0.01% quality website is now live! 🎉**
