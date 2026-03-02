/* ========================================
   CREATE STRIPE CHECKOUT SESSION
   API endpoint for creating Stripe checkout
   ======================================== */

/**
 * Serverless function to create Stripe Checkout session
 * Vercel/Netlify compatible
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://pegrio.com',
    'https://www.pegrio.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

function getCorsOrigin(req) {
    const origin = req.headers.origin || req.headers.referer || '';
    return ALLOWED_ORIGINS.find(o => origin.startsWith(o)) || ALLOWED_ORIGINS[0];
}

// CORS headers
function getHeaders(req) {
    return {
        'Access-Control-Allow-Origin': getCorsOrigin(req),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
    // Set CORS headers
    const corsHeaders = getHeaders(req);
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
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

        // Determine if this is a website build order
        const isWebsiteBuild = metadata.order_type === 'website_build';

        // Calculate final price
        let finalPrice = price;
        let description = packageName;

        if (paymentType === 'deposit') {
            // For website builds, the price is already the deposit amount
            if (isWebsiteBuild) {
                finalPrice = price;
                description = `${packageName} - 50% Deposit`;
            } else {
                // 50% deposit for legacy flow
                finalPrice = Math.round(price * 0.5);
                description = `${packageName} - 50% Deposit (${finalPrice} of ${price})`;
            }
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

        // Build success URL — website build orders go to /order/success
        const successUrl = isWebsiteBuild
            ? `${protocol}://${domain}/order/success?session_id={CHECKOUT_SESSION_ID}`
            : `${protocol}://${domain}/success?session_id={CHECKOUT_SESSION_ID}`;

        const cancelUrl = isWebsiteBuild
            ? `${protocol}://${domain}/order`
            : `${protocol}://${domain}/#pricing`;

        // Build metadata — include website build fields if applicable
        const sessionMetadata = {
            packageName,
            originalPrice: price.toString(),
            paymentType: paymentType || 'full',
            customerName: customerName || '',
            business: metadata.business || metadata.business_name || '',
            message: metadata.message || '',
            timestamp: metadata.timestamp || new Date().toISOString(),
        };

        // Add website build metadata
        if (isWebsiteBuild) {
            sessionMetadata.order_type = 'website_build';
            sessionMetadata.tier = metadata.tier || '';
            sessionMetadata.maintenance_plan = metadata.maintenance_plan || 'none';
            sessionMetadata.add_ons = metadata.add_ons || '[]';
            sessionMetadata.total_amount = metadata.total_amount || '0';
            sessionMetadata.deposit_amount = metadata.deposit_amount || '0';
            sessionMetadata.balance_amount = metadata.balance_amount || '0';
            // Shared portal token — both Pegrio and Agency OS use this
            sessionMetadata.portal_token = crypto.randomUUID();
        }

        // Build line items
        const lineItems = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: packageName,
                        description: description,
                        images: [`${protocol}://${domain}/images/logo.png`],
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ];

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],

            line_items: lineItems,

            mode: 'payment',

            // Customer information
            customer_email: customerEmail || undefined,

            // Success and cancel URLs
            success_url: successUrl,
            cancel_url: cancelUrl,

            // Metadata (will be sent to webhook)
            metadata: sessionMetadata,

            // Email receipt
            payment_intent_data: {
                receipt_email: customerEmail || undefined,
                metadata: {
                    packageName,
                    customerName: customerName || '',
                    ...(isWebsiteBuild ? { order_type: 'website_build', tier: metadata.tier || '' } : {}),
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
