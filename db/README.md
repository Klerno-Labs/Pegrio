# Database Setup

## Vercel Postgres Setup

### 1. Create Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Name it: `pegrio-db`
6. Select region closest to your users
7. Click **Create**

### 2. Run Schema
1. In Vercel Dashboard, click on your database
2. Go to **Query** tab
3. Copy and paste the contents of `schema.sql`
4. Click **Run Query**

This creates:
- ✅ `quotes` table with all fields
- ✅ Indexes for performance
- ✅ Auto-update timestamp trigger
- ✅ 2 sample quotes for testing

### 3. Verify Setup
Run this query in Vercel Query tab:
```sql
SELECT * FROM quotes;
```

You should see 2 test quotes!

### 4. Environment Variables
Vercel automatically adds these to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

Your API routes will automatically use these via `@vercel/postgres` package.

## Schema Overview

### Quotes Table
Stores all quote submissions from your website.

**Key Fields:**
- Customer info: name, email, business, phone
- Package: name, price (in cents), payment type
- Payment: Stripe session ID, status, amount paid
- Marketing: source, UTM parameters
- Metadata: IP, user agent, timestamps

**Payment Statuses:**
- `pending` - Quote submitted, payment not completed
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

## Sample Queries

### Get all quotes
```sql
SELECT * FROM quotes ORDER BY created_at DESC;
```

### Get stats
```sql
SELECT
    COUNT(*) as total_quotes,
    COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_quotes,
    SUM(amount_paid) FILTER (WHERE payment_status = 'paid') as total_revenue
FROM quotes;
```

### Get recent quotes
```sql
SELECT *
FROM quotes
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## Testing Locally

For local development, Vercel automatically provides the database credentials when you run:
```bash
vercel dev
```

No need to set up a local Postgres instance!
