/* ========================================
   CREATE ORDER
   Creates a new website build order in the DB
   Called internally by stripe-webhook after payment
   ======================================== */

import { sql } from './_db.js';
import crypto from 'crypto';

/**
 * Create a new order in the database
 * @param {Object} data - Order data
 * @returns {Object} The created order with portal_token
 */
export async function createOrder(data) {
    const {
        customer_name,
        customer_email,
        business_name = null,
        phone = null,
        tier,
        maintenance_plan = 'none',
        add_ons = [],
        total_amount,
        deposit_amount,
        stripe_session_id = null,
        stripe_payment_intent = null,
        portal_token: provided_token = null,
    } = data;

    // Use pre-generated token from Stripe metadata, or generate a new one
    const portal_token = provided_token || crypto.randomUUID();

    // Set max revisions based on tier (1:1, 2:2, 3:3)
    const max_revisions = Math.min(Math.max(tier, 1), 3);

    // Calculate balance
    const balance_amount = total_amount - deposit_amount;

    try {
        // Insert the order
        const result = await sql`
            INSERT INTO orders (
                customer_name,
                customer_email,
                business_name,
                phone,
                tier,
                maintenance_plan,
                add_ons,
                total_amount,
                deposit_amount,
                balance_amount,
                stripe_session_id,
                stripe_payment_intent,
                payment_status,
                portal_token,
                status,
                max_revisions
            ) VALUES (
                ${customer_name},
                ${customer_email},
                ${business_name},
                ${phone},
                ${tier},
                ${maintenance_plan},
                ${JSON.stringify(add_ons)},
                ${total_amount},
                ${deposit_amount},
                ${balance_amount},
                ${stripe_session_id},
                ${stripe_payment_intent},
                'paid',
                ${portal_token},
                'paid',
                ${max_revisions}
            )
            RETURNING *
        `;

        const order = result.rows[0];

        // Create initial order event
        await sql`
            INSERT INTO order_events (order_id, event_type, details)
            VALUES (
                ${order.id},
                'payment.completed',
                ${JSON.stringify({
                    deposit_amount,
                    total_amount,
                    stripe_session_id,
                    tier,
                    maintenance_plan,
                })}
            )
        `;

        console.log(`✅ Order #${order.id} created with token ${portal_token}`);

        return order;
    } catch (error) {
        console.error('❌ Failed to create order:', error);
        throw error;
    }
}

/**
 * API endpoint handler (for direct API calls if needed)
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Basic auth check — only internal calls should create orders
    const authHeader = req.headers['x-internal-secret'];
    if (authHeader !== process.env.INTERNAL_API_SECRET && process.env.NODE_ENV !== 'development') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const order = await createOrder(req.body);

        return res.status(201).json({
            success: true,
            order: {
                id: order.id,
                portal_token: order.portal_token,
                status: order.status,
                total_amount: order.total_amount,
                deposit_amount: order.deposit_amount,
                balance_amount: order.balance_amount,
            },
        });
    } catch (error) {
        console.error('❌ Error creating order:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message,
        });
    }
}
