/* ========================================
   GET ORDER API
   Fetch full order data + events by portal token
   ======================================== */

import { sql } from '../_db.js';

/**
 * GET /api/portal/get-order?token=xxx
 * Returns full order data with timeline events
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Fetch order
        const orderResult = await sql`
            SELECT
                id,
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
                payment_status,
                portal_token,
                status,
                intake_answers,
                preview_url,
                revision_count,
                max_revisions,
                revision_notes,
                delivery_type,
                delivered_at,
                created_at,
                updated_at
            FROM orders
            WHERE portal_token = ${token}
            LIMIT 1
        `;

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Fetch order events
        const eventsResult = await sql`
            SELECT
                id,
                order_id,
                event_type,
                details,
                created_at
            FROM order_events
            WHERE order_id = ${order.id}
            ORDER BY created_at ASC
        `;

        return res.status(200).json({
            success: true,
            order,
            events: eventsResult.rows
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({
            error: 'Failed to fetch order',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
