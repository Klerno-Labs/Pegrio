/* ========================================
   STRIPE WEBHOOK HANDLER
   Handles Stripe events (payments, subscriptions)
   ======================================== */

import { sql } from './_db.js';
import { createOrder } from './create-order.js';

/**
 * Webhook handler for Stripe events
 * Processes payment confirmations, subscription changes, etc.
 *
 * IMPORTANT: Configure this URL in Stripe Dashboard:
 * https://dashboard.stripe.com/webhooks
 * Endpoint URL: https://your domain.com/api/stripe-webhook
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

// Initialize email service
const resend = new Resend(process.env.RESEND_API_KEY);

// Raw body parser is needed for webhook signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Get raw body from request
 */
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

/**
 * Main webhook handler
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Get raw body
        const rawBody = await getRawBody(req);

        // Verify webhook signature
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

        console.log(`✅ Webhook verified: ${event.type}`);

    } catch (err) {
        console.error(`❌ Webhook signature verification failed:`, err.message);
        return res.status(400).json({
            error: 'Webhook signature verification failed',
            message: err.message
        });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCancelled(event.data.object);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            default:
                console.log(`ℹ️  Unhandled event type: ${event.type}`);
        }

        // Return success response
        return res.status(200).json({ received: true, type: event.type });

    } catch (error) {
        console.error(`❌ Error handling webhook:`, error);
        return res.status(500).json({
            error: 'Webhook handler failed',
            message: error.message
        });
    }
}

/**
 * Handle checkout session completed
 * Works for both direct checkout sessions AND payment links
 */
async function handleCheckoutCompleted(session) {
    console.log('💰 Checkout completed:', session.id);

    const {
        id: sessionId,
        customer_email: email,
        amount_total: amount,
        metadata,
        payment_link: paymentLinkId,
        payment_intent: paymentIntent,
        customer_details,
    } = session;

    // Metadata may come from checkout session or payment link
    let resolvedMetadata = metadata || {};

    // If this came from a payment link, fetch the payment link metadata
    if (paymentLinkId && (!resolvedMetadata.packageName)) {
        try {
            const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);
            resolvedMetadata = { ...resolvedMetadata, ...paymentLink.metadata };
        } catch (err) {
            console.error('Failed to fetch payment link metadata:', err.message);
        }
    }

    const {
        packageName,
        customerName,
        customerEmail: metadataEmail,
        business,
        paymentType,
        originalPrice,
        quoteId
    } = resolvedMetadata;

    const resolvedEmail = email || metadataEmail;

    // ─── WEBSITE BUILD ORDER FLOW ───
    if (resolvedMetadata.order_type === 'website_build') {
        await handleWebsiteBuildOrder({
            session,
            sessionId,
            email: resolvedEmail,
            amount,
            metadata: resolvedMetadata,
            paymentIntent,
            customerDetails: customer_details,
        });
        return;
    }

    // ─── LEGACY FLOW (quotes / general checkout) ───

    // Send confirmation email to customer
    if (resolvedEmail) {
        await sendCustomerConfirmation({
            email: resolvedEmail,
            customerName,
            packageName: packageName || 'Website Package',
            amount: amount / 100,
            originalPrice: originalPrice ? parseInt(originalPrice) : amount / 100,
            paymentType,
            sessionId
        });
    }

    // Send notification email to admin
    await sendAdminNotification({
        email: resolvedEmail,
        customerName,
        business,
        packageName: packageName || 'Website Package',
        amount: amount / 100,
        paymentType,
        sessionId
    });

    // Update quote in database — prefer quoteId match, fall back to email
    await updateQuotePaymentStatus({
        quoteId,
        sessionId,
        email: resolvedEmail,
        amount: amount / 100,
        status: 'paid'
    });

    console.log(`✅ Checkout processed for ${resolvedEmail}`);
}

/**
 * Handle website build order (from the /order wizard)
 * Creates order in DB and sends questionnaire email
 */
async function handleWebsiteBuildOrder(data) {
    const { session, sessionId, email, amount, metadata, paymentIntent, customerDetails } = data;

    const tierNum = parseInt(metadata.tier || '1');
    const tierNames = { 1: 'Starter', 2: 'Growth', 3: 'Enterprise' };
    const tierName = tierNames[tierNum] || 'Starter';
    const customerName = customerDetails?.name || metadata.customerName || '';
    const customerPhone = customerDetails?.phone || '';
    const businessName = metadata.business || '';
    const maintenancePlan = metadata.maintenance_plan || 'none';

    let addOns = [];
    try {
        addOns = JSON.parse(metadata.add_ons || '[]');
    } catch (e) {
        console.error('Failed to parse add_ons metadata:', e.message);
    }

    const totalAmount = parseInt(metadata.total_amount || '0');
    const depositAmount = parseInt(metadata.deposit_amount || '0');

    try {
        // Use the portal token from Stripe metadata (shared with Agency OS)
        const portalToken = metadata.portal_token || null;

        // Create the order in the database
        const order = await createOrder({
            customer_name: customerName,
            customer_email: email,
            business_name: businessName,
            phone: customerPhone,
            tier: tierNum,
            maintenance_plan: maintenancePlan,
            add_ons: addOns,
            total_amount: totalAmount,
            deposit_amount: depositAmount,
            stripe_session_id: sessionId,
            stripe_payment_intent: typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id || null,
            portal_token: portalToken,
        });

        console.log(`✅ Website build order #${order.id} created`);

        // Build portal URL — Agency OS receives the same token via its own Stripe webhook
        const portalUrl = process.env.AGENCY_OS_URL
            ? `${process.env.AGENCY_OS_URL}/portal/${order.portal_token}`
            : null;

        // Send questionnaire email to customer
        if (email) {
            await sendQuestionnaireEmail({
                email,
                customerName,
                tierName,
                totalAmount,
                depositAmount,
                balanceAmount: totalAmount - depositAmount,
                portalToken: order.portal_token,
                maintenancePlan,
                portalUrl,
            });
        }

        // Send admin notification for the new order
        await sendAdminNotification({
            email,
            customerName,
            business: businessName,
            packageName: `${tierName} Website Build`,
            amount: depositAmount,
            paymentType: 'deposit',
            sessionId,
        });

    } catch (error) {
        console.error('❌ Failed to process website build order:', error);
        throw error;
    }
}

/**
 * Send questionnaire email with portal link
 */
async function sendQuestionnaireEmail(data) {
    const { email, customerName, tierName, totalAmount, depositAmount, balanceAmount, portalToken, maintenancePlan, portalUrl: agencyPortalUrl } = data;

    const domain = process.env.DOMAIN || 'www.pegrio.com';
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    // Use Agency OS portal URL if available, otherwise fall back to Pegrio portal
    const portalUrl = agencyPortalUrl || `${protocol}://${domain}/portal/intake/${portalToken}`;

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
            to: email,
            subject: `Welcome to Pegrio! Start Your Website Questionnaire`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #6B3FA0 0%, #4a2d70 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px; }
                        .success-icon { font-size: 48px; margin-bottom: 16px; }
                        .amount { font-size: 28px; font-weight: bold; color: #6B3FA0; margin: 16px 0; }
                        .details { background: #f8f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6B3FA0; }
                        .detail-row { margin: 8px 0; }
                        .detail-label { font-weight: 600; color: #555; }
                        .btn { display: inline-block; padding: 16px 32px; background: #6B3FA0; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 24px 0; }
                        .btn:hover { background: #5a3490; }
                        .steps { margin-top: 24px; }
                        .step { display: flex; align-items: flex-start; margin: 12px 0; }
                        .step-num { background: #6B3FA0; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
                        .footer { text-align: center; margin-top: 24px; color: #888; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="success-icon">&#10003;</div>
                            <h1 style="margin: 0; font-size: 24px;">Payment Confirmed!</h1>
                            <p style="margin: 8px 0 0; opacity: 0.9;">Your ${tierName} website build is officially underway.</p>
                        </div>
                        <div class="content">
                            <p>Hi ${customerName || 'there'},</p>
                            <p>Thank you for choosing Pegrio! We're thrilled to start building your new website.</p>

                            <div class="details">
                                <div class="detail-row"><span class="detail-label">Package:</span> ${tierName} Website Build</div>
                                <div class="detail-row"><span class="detail-label">Total Project Cost:</span> $${totalAmount.toLocaleString()}</div>
                                <div class="detail-row"><span class="detail-label">Deposit Paid:</span> $${depositAmount.toLocaleString()}</div>
                                <div class="detail-row"><span class="detail-label">Balance Due at Launch:</span> $${balanceAmount.toLocaleString()}</div>
                                ${maintenancePlan !== 'none' ? `<div class="detail-row"><span class="detail-label">Maintenance Plan:</span> ${maintenancePlan.charAt(0).toUpperCase() + maintenancePlan.slice(1)}</div>` : ''}
                            </div>

                            <h2 style="color: #6B3FA0; font-size: 20px;">Next Step: Tell Us About Your Business</h2>
                            <p>Please complete the website questionnaire so we can understand your vision, brand, and goals. This helps us design a website that perfectly represents your business.</p>

                            <div style="text-align: center;">
                                <a href="${portalUrl}" class="btn">Start Your Website Questionnaire &rarr;</a>
                            </div>

                            <div class="steps">
                                <h3 style="font-size: 16px; color: #333;">What Happens Next?</h3>
                                <div class="step">
                                    <span class="step-num">1</span>
                                    <div><strong>Complete the Questionnaire</strong><br/>Tell us about your business, style preferences, and goals.</div>
                                </div>
                                <div class="step">
                                    <span class="step-num">2</span>
                                    <div><strong>Design Phase</strong><br/>Our team creates mockups for your review and feedback.</div>
                                </div>
                                <div class="step">
                                    <span class="step-num">3</span>
                                    <div><strong>Development</strong><br/>We build your website with pixel-perfect precision.</div>
                                </div>
                                <div class="step">
                                    <span class="step-num">4</span>
                                    <div><strong>Launch!</strong><br/>Final review, balance payment, and your site goes live.</div>
                                </div>
                            </div>

                            <p style="margin-top: 24px;">If you have any questions, just reply to this email or reach out at <a href="mailto:hello@pegrio.com">hello@pegrio.com</a>.</p>

                            <p>Welcome to the Pegrio family!</p>
                            <p>Best regards,<br/>The Pegrio Team</p>
                        </div>
                        <div class="footer">
                            <p>Pegrio - AI-Powered Business Websites</p>
                            <p>hello@pegrio.com | www.pegrio.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log(`✅ Questionnaire email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send questionnaire email:`, error);
    }
}

/**
 * Handle payment succeeded
 */
async function handlePaymentSucceeded(paymentIntent) {
    console.log('✅ Payment succeeded:', paymentIntent.id);

    // Additional processing if needed
    // This event fires after checkout.session.completed
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);

    // Send failure notification
    // Track failed payment for follow-up
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
    console.log('📅 Subscription created:', subscription.id);

    // TODO: Save subscription to database
    // TODO: Send welcome email
    // TODO: Provision access to portal
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
    console.log('🔄 Subscription updated:', subscription.id);

    // TODO: Update database
    // TODO: Handle plan changes, billing updates
}

/**
 * Handle subscription cancelled
 */
async function handleSubscriptionCancelled(subscription) {
    console.log('🚫 Subscription cancelled:', subscription.id);

    // TODO: Revoke access
    // TODO: Send cancellation confirmation
}

/**
 * Handle invoice paid (for subscriptions)
 */
async function handleInvoicePaid(invoice) {
    console.log('📄 Invoice paid:', invoice.id);

    // TODO: Send receipt
    // TODO: Extend subscription
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
    console.log('❌ Invoice payment failed:', invoice.id);

    // TODO: Send dunning email
    // TODO: Update subscription status
}

/**
 * Send confirmation email to customer
 */
async function sendCustomerConfirmation(data) {
    const { email, customerName, packageName, amount, paymentType, sessionId } = data;

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
            to: email,
            subject: `Payment Confirmed - Welcome to Pegrio! 🎉`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
                        .success-icon { font-size: 48px; margin-bottom: 20px; }
                        .amount { font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; }
                        .details { background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
                        .next-steps { margin-top: 30px; }
                        .next-steps ol { padding-left: 20px; }
                        .next-steps li { margin: 10px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="success-icon">✓</div>
                            <h1>Payment Successful!</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${customerName || 'there'},</p>

                            <p>Thank you for choosing Pegrio! We're excited to build your amazing website.</p>

                            <div class="amount">$${amount.toLocaleString()}</div>

                            <div class="details">
                                <div class="detail-row">
                                    <span><strong>Package:</strong></span>
                                    <span>${packageName}</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Payment Type:</strong></span>
                                    <span>${paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'}</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Order ID:</strong></span>
                                    <span>${sessionId.substring(0, 20)}...</span>
                                </div>
                            </div>

                            <div class="next-steps">
                                <h2>What Happens Next?</h2>
                                <ol>
                                    <li><strong>Check Your Email:</strong> You'll receive a detailed receipt from Stripe</li>
                                    <li><strong>Kickoff Call:</strong> Our team will contact you within 24 hours to schedule your project kickoff</li>
                                    <li><strong>Project Questionnaire:</strong> We'll send you a form to gather all the details about your vision</li>
                                    <li><strong>Design Phase:</strong> Your dedicated designer will create mockups for your review</li>
                                    <li><strong>Development:</strong> We'll build your site with pixel-perfect precision</li>
                                    <li><strong>Launch:</strong> We'll deploy your new website and provide training</li>
                                </ol>
                            </div>

                            <p>If you have any questions, just reply to this email or call us at (555) 123-4567.</p>

                            <p>Welcome to the Pegrio family!</p>

                            <p>Best regards,<br>The Pegrio Team</p>
                        </div>

                        <div class="footer">
                            <p>Pegrio - AI-Powered Business Websites</p>
                            <p>hello@pegrio.com | www.pegrio.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log(`✅ Confirmation email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send confirmation email:`, error);
    }
}

/**
 * Send notification email to admin
 */
async function sendAdminNotification(data) {
    const { email, customerName, business, packageName, amount, paymentType } = data;

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
            to: process.env.NOTIFICATION_EMAIL || 'hello@pegrio.com',
            subject: `🎉 New Payment: $${amount} - ${packageName}`,
            html: `
                <h2>New Payment Received!</h2>
                <p><strong>Amount:</strong> $${amount.toLocaleString()}</p>
                <p><strong>Package:</strong> ${packageName}</p>
                <p><strong>Payment Type:</strong> ${paymentType}</p>
                <hr>
                <p><strong>Customer:</strong> ${customerName || 'Not provided'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Business:</strong> ${business || 'Not provided'}</p>
                <hr>
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Contact customer within 24 hours</li>
                    <li>Schedule kickoff call</li>
                    <li>Send project questionnaire</li>
                </ol>
            `
        });

        console.log(`✅ Admin notification sent`);
    } catch (error) {
        console.error(`❌ Failed to send admin notification:`, error);
    }
}

/**
 * Update quote payment status in database
 * Prefers quoteId match, falls back to email match
 */
async function updateQuotePaymentStatus(data) {
    const { quoteId, sessionId, email, amount, status } = data;

    try {
        // sql imported from _db.js at top of file

        if (quoteId) {
            // Direct match by quote ID (from payment link metadata)
            await sql`
                UPDATE quotes
                SET
                    payment_status = ${status},
                    stripe_session_id = ${sessionId},
                    amount_paid = ${Math.round(amount * 100)},
                    paid_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${parseInt(quoteId)}
            `;
            console.log(`✅ Quote #${quoteId} updated: ${status}`);
        } else if (email) {
            // Fall back to email match (most recent pending quote)
            await sql`
                UPDATE quotes
                SET
                    payment_status = ${status},
                    stripe_session_id = ${sessionId},
                    amount_paid = ${Math.round(amount * 100)},
                    paid_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE customer_email = ${email}
                    AND payment_status = 'pending'
                    AND created_at = (
                        SELECT MAX(created_at)
                        FROM quotes
                        WHERE customer_email = ${email}
                        AND payment_status = 'pending'
                    )
            `;
            console.log(`✅ Quote updated for ${email}: ${status}`);
        }
    } catch (error) {
        console.error(`❌ Failed to update quote status:`, error);
    }
}
