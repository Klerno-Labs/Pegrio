CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(50),
    package VARCHAR(100) NOT NULL,
    package_price INTEGER NOT NULL,
    payment_type VARCHAR(50) DEFAULT 'full',
    message TEXT,
    stripe_session_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount_paid INTEGER DEFAULT 0,
    source VARCHAR(100) DEFAULT 'website',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO quotes (customer_name, customer_email, business_name, phone, package, package_price, payment_type, message, payment_status, source)
VALUES 
('John Doe', 'john@example.com', 'Doe''s Restaurant', '555-0123', 'Professional Package', 249900, 'full', 'Looking forward to working together!', 'pending', 'website'),
('Jane Smith', 'jane@example.com', 'Smith''s Cafe', '555-0456', 'Premium Package', 499900, 'deposit', 'Need help with my restaurant website.', 'paid', 'website');

SELECT COUNT(*) as total FROM quotes;
