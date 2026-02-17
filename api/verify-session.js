/* ========================================
   VERIFY STRIPE SESSION
   Verify payment after redirect from Stripe
   ======================================== */

/**
 * Verify Stripe Checkout Session
 * Called on success page to confirm payment
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({
                error: 'Missing session_id',
                message: 'session_id parameter is required'
            });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session) {
            return res.status(404).json({
                error: 'Session not found',
                message: 'Invalid session_id'
            });
        }

        // Extract data
        const {
            id: sessionId,
            payment_status,
            customer_email: customerEmail,
            amount_total: amountTotal,
            metadata
        } = session;

        // Check payment status
        if (payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Payment not completed',
                paymentStatus: payment_status
            });
        }

        // Return success data
        return res.status(200).json({
            success: true,
            sessionId,
            customerEmail,
            amount: amountTotal,
            packageName: metadata.packageName || 'Website Package',
            paymentType: metadata.paymentType || 'full',
            customerName: metadata.customerName || '',
            business: metadata.business || '',
            timestamp: metadata.timestamp || new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error verifying session:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
