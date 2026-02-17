# Vercel Setup Guide

Complete guide to deploying Pegrio on Vercel with Postgres database.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy to Vercel

```bash
cd /path/to/Pegrio
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** pegrio (or your choice)
- **Directory?** ./
- **Override settings?** No

### Step 4: Add Vercel Postgres

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **pegrio** project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name: **pegrio-db**
7. Select region: **US East** (or closest to you)
8. Click **Create**

### Step 5: Initialize Database Schema

In your project dashboard:

1. Go to **Storage** → **pegrio-db**
2. Click **Query** tab
3. Copy the contents of `db/schema.sql`
4. Paste into the query editor
5. Click **Execute**

You should see:
```
✅ Table quotes created
✅ Table projects created
✅ Table contacts created
✅ Table admin_users created
```

### Step 6: Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```bash
# Stripe (Required for payments)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Required for notifications)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourdomain.com
NOTIFICATION_EMAIL=your-email@example.com

# Admin Dashboard (Required)
ADMIN_PASSWORD=your-secure-password-here

# Domain
DOMAIN=yourdomain.com

# Optional: Analytics
GOOGLE_ANALYTICS_ID=G-...
FACEBOOK_PIXEL_ID=...
```

3. Click **Save** for each variable

### Step 7: Redeploy

```bash
vercel --prod
```

## 🎉 You're Live!

Your site is now live at: `https://pegrio.vercel.app` (or your custom domain)

### Test Your Setup

1. **Test Quote Form:**
   - Go to your site
   - Fill out a quote request
   - Complete payment on Stripe
   - Check your email for confirmation

2. **Test Admin Dashboard:**
   - Go to `https://yourdomain.com/admin`
   - Enter your `ADMIN_PASSWORD`
   - See all your quotes!

---

## 📊 Admin Dashboard

### Accessing the Dashboard

1. Navigate to: `https://yourdomain.com/admin`
2. Enter your admin password (set in environment variables)
3. View all quote submissions

### Dashboard Features

- **Stats Overview:**
  - Total quotes
  - Pending vs paid
  - Total revenue
  - Conversion rate
  - Last 30 days activity

- **Quote Management:**
  - View all submissions
  - Filter by status (pending/paid/failed)
  - Filter by package
  - Sort by date, customer, package, price
  - Click email to contact customer

- **Export:**
  - Copy table data
  - Use browser's print to PDF

### Changing Admin Password

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Find `ADMIN_PASSWORD`
4. Click **Edit**
5. Enter new password
6. Save and redeploy

---

## 🗄️ Database Management

### Viewing Data in Vercel

1. Go to Vercel Dashboard
2. Storage → pegrio-db
3. Click **Query** tab
4. Run SQL queries:

```sql
-- View all quotes
SELECT * FROM quotes ORDER BY created_at DESC;

-- View only paid quotes
SELECT * FROM quotes WHERE payment_status = 'paid';

-- Total revenue
SELECT SUM(amount_paid) / 100.0 AS total_revenue
FROM quotes
WHERE payment_status = 'paid';

-- Conversion rate
SELECT
    COUNT(*) FILTER (WHERE payment_status = 'paid') * 100.0 / COUNT(*) AS conversion_rate
FROM quotes;

-- Popular packages
SELECT package, COUNT(*) as count
FROM quotes
GROUP BY package
ORDER BY count DESC;
```

### Database Backup

**Automatic:**
- Vercel Postgres automatically backs up your database daily
- Retention: 7 days on Hobby plan, 30 days on Pro

**Manual Export:**
1. Go to Storage → pegrio-db
2. Click **Data** tab
3. Select **quotes** table
4. Copy data or export to CSV

---

## 🔔 Email Notifications

You'll receive emails for:

1. **New Quote Request** (as soon as form is submitted)
   - Customer info
   - Package selected
   - Message
   - Status: Pending

2. **Payment Confirmed** (after Stripe payment succeeds)
   - Same info as above
   - Status: Paid
   - Amount paid

### Email Setup (Resend)

1. Go to [resend.com](https://resend.com)
2. Sign up for free account (3,000 emails/month)
3. Add your domain:
   - Click **Domains**
   - Add domain: `yourdomain.com`
   - Add DNS records (SPF, DKIM)
   - Verify domain
4. Create API Key:
   - Go to **API Keys**
   - Click **Create API Key**
   - Name: `Pegrio`
   - Copy the key
5. Add to Vercel:
   - Environment Variables → `RESEND_API_KEY`
   - Paste the key
   - Save and redeploy

---

## 🔐 Security

### Admin Password Best Practices

- **Use a strong password:** At least 16 characters with mix of letters, numbers, symbols
- **Don't share:** Keep your admin password private
- **Rotate regularly:** Change password every 3-6 months
- **Use password manager:** Store in 1Password, Bitwarden, etc.

### Database Security

- ✅ Postgres connections are encrypted (TLS)
- ✅ Environment variables are secure
- ✅ Database is not publicly accessible
- ✅ Vercel handles security updates

### API Security

- All API routes verify authentication
- Stripe webhooks verify signature
- Admin routes require password
- HTTPS enforced on all pages

---

## 📈 Monitoring

### View Logs

```bash
vercel logs
```

Or in dashboard:
1. Go to project
2. **Deployments** tab
3. Click latest deployment
4. View **Runtime Logs**

### Check Database Usage

1. Storage → pegrio-db
2. **Settings** tab
3. View:
   - Storage used
   - Compute hours used
   - Connection count

### Free Tier Limits

**Vercel Hobby (Free):**
- 100 GB bandwidth/month
- 100 GB build execution time
- Unlimited deployments

**Postgres Hobby (Free):**
- 256 MB storage
- 60 hours compute/month
- 256 MB RAM
- 1 database

**Enough for:**
- ~50,000 quotes (at ~5KB each)
- ~1,000 quotes/month (plenty!)

---

## 🛠️ Troubleshooting

### "Failed to fetch quotes" error

**Solution:**
1. Check `ADMIN_PASSWORD` is set in Vercel
2. Try logging out and back in
3. Clear browser cache

### Quote not showing in dashboard

**Solution:**
1. Check logs: `vercel logs`
2. Verify database connection
3. Run this query:
   ```sql
   SELECT * FROM quotes ORDER BY created_at DESC LIMIT 10;
   ```

### Email not sending

**Solution:**
1. Verify `RESEND_API_KEY` is set
2. Check domain is verified in Resend
3. Check email quota (3,000/month on free plan)
4. View logs for error messages

### Payment not marking as paid

**Solution:**
1. Verify Stripe webhook is set up
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Test webhook in Stripe dashboard:
   - Developers → Webhooks
   - Click your webhook
   - Send test event

### Database connection error

**Solution:**
1. Verify database is created in Vercel
2. Check environment variables are set:
   ```bash
   vercel env ls
   ```
3. Schema might not be initialized - run `db/schema.sql` again

---

## 📞 Support

### Vercel Support
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Discord: [vercel.com/discord](https://vercel.com/discord)
- Email: support@vercel.com

### Need Help?
- Check logs first: `vercel logs`
- Search Vercel docs
- Ask in Vercel Discord

---

## 🎯 Next Steps

After setup is working:

1. **Add custom domain:**
   - Vercel dashboard → Settings → Domains
   - Add your domain
   - Update DNS records
   - SSL certificate auto-provisioned

2. **Test everything:**
   - Submit test quote
   - Complete test payment ($0.50 in test mode)
   - Check email notifications
   - Verify admin dashboard

3. **Go live:**
   - Switch Stripe to live mode
   - Update Stripe keys in Vercel
   - Test with real $0.50 transaction
   - Refund test transaction

4. **Phase 3:**
   - Client portal
   - Project tracking
   - File uploads
   - HubSpot/Pipedrive CRM

---

## 💰 Costs

### Free (Forever)
- Vercel Hobby plan: $0/month
- Vercel Postgres Hobby: $0/month
- Resend free tier: $0/month (3,000 emails)

### When to Upgrade

**Vercel Pro ($20/month):**
- Need more bandwidth
- Need password-protected deployments
- Need advanced analytics

**Postgres Pro ($20/month):**
- Database > 256 MB
- Need > 60 compute hours
- Need point-in-time recovery

**Resend Pro ($20/month):**
- Need > 3,000 emails/month
- Need email analytics
- Need dedicated IP

**You won't need to upgrade until:**
- 10,000+ visitors/month
- 100+ quotes/month
- This is PLENTY for starting out! 🚀

---

## ✅ Checklist

Before going live:

- [ ] Vercel project deployed
- [ ] Postgres database created
- [ ] Database schema initialized
- [ ] All environment variables set
- [ ] Stripe webhook configured
- [ ] Test quote submitted successfully
- [ ] Test payment completed
- [ ] Email notifications received
- [ ] Admin dashboard accessible
- [ ] Quote shows in dashboard as "paid"
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Stripe in live mode (when ready)

---

You're all set! 🎉

Your quote management system is now fully automated:
1. Customer submits quote → **Saved to database** → Email sent to you
2. Customer pays → **Updated to "paid"** → Email sent to you
3. View all quotes in one dashboard → **Manage everything easily**

No more checking Stripe, no more searching emails. Everything in one place! 🙌
