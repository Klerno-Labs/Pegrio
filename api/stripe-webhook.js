/* ========================================
   STRIPE WEBHOOK HANDLER
   Handles Stripe events (payments, subscriptions)
   ======================================== */

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
 */
async function handleCheckoutCompleted(session) {
    console.log('💰 Checkout completed:', session.id);

    const {
        id: sessionId,
        customer_email: email,
        amount_total: amount,
        metadata
    } = session;

    const {
        packageName,
        customerName,
        business,
        paymentType,
        originalPrice
    } = metadata;

    // Send confirmation email to customer
    await sendCustomerConfirmation({
        email,
        customerName,
        packageName,
        amount: amount / 100,
        originalPrice: originalPrice ? parseInt(originalPrice) : amount / 100,
        paymentType,
        sessionId
    });

    // Send notification email to admin
    await sendAdminNotification({
        email,
        customerName,
        business,
        packageName,
        amount: amount / 100,
        paymentType,
        sessionId
    });

    // TODO: Save to database (Supabase)
    // await saveOrderToDatabase({ sessionId, email, amount, metadata });

    console.log(`✅ Checkout processed for ${email}`);
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
