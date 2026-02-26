/* ========================================
   PEGRIO DATABASE SCHEMA
   Vercel Postgres - Run this in Query tab
   ======================================== */

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    -- Primary key
    id SERIAL PRIMARY KEY,

    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(50),

    -- Quote details
    package VARCHAR(100) NOT NULL,
    package_price INTEGER NOT NULL, -- Price in cents
    payment_type VARCHAR(50) DEFAULT 'full', -- 'full' or 'deposit'
    message TEXT,

    -- Payment tracking
    stripe_session_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    amount_paid INTEGER DEFAULT 0, -- Amount in cents

    -- Marketing attribution
    source VARCHAR(100) DEFAULT 'website',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),

    -- Technical metadata
    ip_address VARCHAR(50),
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(payment_status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_stripe ON quotes(stripe_session_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO quotes (
    customer_name,
    customer_email,
    business_name,
    phone,
    package,
    package_price,
    payment_type,
    message,
    payment_status,
    source
) VALUES
(
    'John Doe',
    'john@example.com',
    'Doe''s Restaurant',
    '555-0123',
    'Professional Package',
    500000, -- $5,000.00 in cents
    'full',
    'Looking forward to working together!',
    'pending',
    'website'
),
(
    'Jane Smith',
    'jane@example.com',
    'Smith''s Cafe',
    '555-0456',
    'Premium Package',
    800000, -- $8,000.00 in cents
    'deposit',
    'Need help with my restaurant website.',
    'paid',
    'website'
);

-- Update the paid quote with paid_at timestamp and amount
UPDATE quotes
SET paid_at = CURRENT_TIMESTAMP,
    amount_paid = package_price
WHERE customer_email = 'jane@example.com';

-- Verify the table was created
SELECT
    COUNT(*) as total_quotes,
    COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_quotes,
    COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_quotes
FROM quotes;


/* ========================================
   ORDERS TABLES
   Website build orders with portal tracking
   ======================================== */

-- Orders table (website build orders)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  phone VARCHAR(50),
  tier INTEGER NOT NULL,
  maintenance_plan VARCHAR(50),
  add_ons JSONB DEFAULT '[]',
  total_amount INTEGER NOT NULL,
  deposit_amount INTEGER,
  balance_amount INTEGER,
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  portal_token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'paid',
  intake_answers JSONB,
  preview_url VARCHAR(500),
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER NOT NULL DEFAULT 2,
  revision_notes JSONB DEFAULT '[]',
  delivery_type VARCHAR(50),
  repo_url VARCHAR(500),
  project_path VARCHAR(500),
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_events (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(portal_token);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id);

-- Auto-update updated_at for orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
