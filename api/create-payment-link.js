/* ========================================
   CREATE PAYMENT LINK
   For custom quotes after discovery calls
   ======================================== */

/**
 * Create a Stripe Payment Link for custom proposals
 * Use this after discovery calls to send personalized payment links
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Auth check (cookie or Bearer)
    if (!isValidAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const {
            customerName,
            customerEmail,
            amount,
            description,
            metadata = {}
        } = req.body;

        // Validation
        if (!customerEmail || !amount || !description) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'customerEmail, amount, and description are required'
            });
        }

        // Convert to cents
        const amountInCents = amount * 100;

        // Create a Price (one-time payment)
        const price = await stripe.prices.create({
            unit_amount: amountInCents,
            currency: 'usd',
            product_data: {
                name: description,
                metadata: {
                    customerName: customerName || '',
                    customQuote: 'true',
                    ...metadata
                }
            }
        });

        // Create Payment Link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.DOMAIN || req.headers.host}/success`,
                },
            },
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true
            },
            customer_creation: 'always',
            metadata: {
                customerName: customerName || '',
                customerEmail,
                customQuote: 'true',
                ...metadata
            }
        });

        console.log(`✅ Payment link created: ${paymentLink.url}`);

        return res.status(200).json({
            success: true,
            paymentUrl: paymentLink.url,
            paymentLinkId: paymentLink.id
        });

    } catch (error) {
        console.error('❌ Error creating payment link:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

function isValidAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return false;

    // Cookie auth
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/pegrio_admin_token=([^;]+)/);
    if (match) {
        const expectedHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
        if (match[1] === expectedHash) return true;
    }

    // Bearer token
    const authToken = req.headers.authorization;
    return authToken === `Bearer ${adminPassword}`;
}
