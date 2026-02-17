/* ========================================
   CREATE STRIPE CHECKOUT SESSION
   API endpoint for creating Stripe checkout
   ======================================== */

/**
 * Serverless function to create Stripe Checkout session
 * Vercel/Netlify compatible
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

/**
 * Main handler function
 */
export default async function handler(req, res) {
    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ success: true });
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'This endpoint only accepts POST requests'
        });
    }

    try {
        const {
            packageName,
            price,
            paymentType,
            customerEmail,
            customerName,
            metadata = {}
        } = req.body;

        // Validation
        if (!packageName || !price) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'packageName and price are required'
            });
        }

        // Calculate final price
        let finalPrice = price;
        let description = packageName;

        if (paymentType === 'deposit') {
            // 50% deposit
            finalPrice = Math.round(price * 0.5);
            description = `${packageName} - 50% Deposit (${finalPrice} of ${price})`;
        } else if (paymentType === 'installment') {
            // 3 monthly installments
            finalPrice = Math.round(price / 3);
            description = `${packageName} - First of 3 Monthly Payments`;
        }

        // Convert to cents for Stripe
        const amountInCents = finalPrice * 100;

        // Get domain for success/cancel URLs
        const domain = process.env.DOMAIN || req.headers.host || 'localhost:3000';
        const protocol = domain.includes('localhost') ? 'http' : 'https';

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],

            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: packageName,
                            description: description,
                            images: [`${protocol}://${domain}/images/logo.png`], // Add your logo
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],

            mode: 'payment',

            // Customer information
            customer_email: customerEmail,

            // Success and cancel URLs
            success_url: `${protocol}://${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${protocol}://${domain}/#pricing`,

            // Metadata (will be sent to webhook)
            metadata: {
                packageName,
                originalPrice: price.toString(),
                paymentType: paymentType || 'full',
                customerName: customerName || '',
                business: metadata.business || '',
                message: metadata.message || '',
                timestamp: metadata.timestamp || new Date().toISOString(),
            },

            // Email receipt
            payment_intent_data: {
                receipt_email: customerEmail,
                metadata: {
                    packageName,
                    customerName: customerName || '',
                }
            },

            // Allow promotion codes
            allow_promotion_codes: true,

            // Billing address collection
            billing_address_collection: 'required',

            // Phone number collection
            phone_number_collection: {
                enabled: true
            },

            // Custom text
            custom_text: {
                submit: {
                    message: 'Secure payment processed by Stripe'
                }
            }
        });

        // Log the session creation
        console.log(`✅ Checkout session created: ${session.id}`);

        // Return session ID to client
        return res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('❌ Error creating checkout session:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
