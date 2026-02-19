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
    249900, -- $2,499.00 in cents
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
    499900, -- $4,999.00 in cents
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
