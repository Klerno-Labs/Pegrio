/* ========================================
   VERIFY PORTAL TOKEN API
   Validates a portal token and returns order data
   ======================================== */

import { sql } from '../_db.js';

/**
 * GET /api/portal/verify-token?token=xxx
 * Returns order data if token is valid, 404 if not
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
        const result = await sql`
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

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired portal token' });
        }

        const order = result.rows[0];

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Error verifying portal token:', error);
        return res.status(500).json({
            error: 'Failed to verify token',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
