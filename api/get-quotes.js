/* ========================================
   GET QUOTES API
   Fetch all quotes for admin dashboard
   ======================================== */

import { sql } from '@vercel/postgres';
import crypto from 'crypto';

/**
 * Get all quotes from database
 * Supports filtering, search, and pagination
 */
export default async function handler(req, res) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check authentication (cookie or Bearer token)
        if (!isValidAuth(req)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get query parameters
        const {
            status,        // Filter by payment status
            package: pkg,  // Filter by package
            search,        // Search by name, email, or business
            limit = '100', // Limit results
            offset = '0',  // Pagination offset
            sort = 'created_at', // Sort field
            order = 'DESC' // Sort order
        } = req.query;

        // Build WHERE clause
        const conditions = [];
        const params = [];

        if (status) {
            conditions.push(`payment_status = $${params.length + 1}`);
            params.push(status);
        }

        if (pkg) {
            conditions.push(`package = $${params.length + 1}`);
            params.push(pkg);
        }

        if (search) {
            const searchParam = `%${search}%`;
            conditions.push(`(customer_name ILIKE $${params.length + 1} OR customer_email ILIKE $${params.length + 1} OR business_name ILIKE $${params.length + 1})`);
            params.push(searchParam);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // Validate sort field to prevent SQL injection
        const validSortFields = ['created_at', 'customer_name', 'package', 'payment_status', 'package_price'];
        const sortField = validSortFields.includes(sort) ? sort : 'created_at';

        // Validate order
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Fetch quotes
        const quotesQuery = `
            SELECT
                id,
                customer_name,
                customer_email,
                business_name,
                phone,
                package,
                package_price,
                payment_type,
                message,
                stripe_session_id,
                payment_status,
                amount_paid,
                source,
                utm_source,
                utm_medium,
                utm_campaign,
                created_at,
                paid_at
            FROM quotes
            ${whereClause}
            ORDER BY ${sortField} ${sortOrder}
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;

        params.push(parseInt(limit), parseInt(offset));

        const result = await sql.query(quotesQuery, params);

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM quotes ${whereClause}`;
        const countResult = await sql.query(countQuery, params.slice(0, -2)); // Remove limit/offset
        const total = parseInt(countResult.rows[0].total);

        // Get summary stats
        const statsResult = await sql`
            SELECT
                COUNT(*) as total_quotes,
                COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_quotes,
                COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_quotes,
                SUM(amount_paid) FILTER (WHERE payment_status = 'paid') as total_revenue,
                COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as quotes_last_7_days,
                COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as quotes_last_30_days
            FROM quotes
        `;

        const stats = statsResult.rows[0];

        // Calculate conversion rate
        const conversionRate = stats.total_quotes > 0
            ? (stats.paid_quotes / stats.total_quotes * 100).toFixed(1)
            : 0;

        // Return data
        return res.status(200).json({
            success: true,
            quotes: result.rows,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: total > parseInt(offset) + parseInt(limit)
            },
            stats: {
                totalQuotes: parseInt(stats.total_quotes),
                paidQuotes: parseInt(stats.paid_quotes),
                pendingQuotes: parseInt(stats.pending_quotes),
                totalRevenue: parseInt(stats.total_revenue || 0) / 100, // Convert to dollars
                quotesLast7Days: parseInt(stats.quotes_last_7_days),
                quotesLast30Days: parseInt(stats.quotes_last_30_days),
                conversionRate: parseFloat(conversionRate)
            }
        });

    } catch (error) {
        console.error('Error fetching quotes:', error);

        return res.status(500).json({
            error: 'Failed to fetch quotes',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Authentication check - supports both cookie and Bearer token
 */
function isValidAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return false;

    // Check cookie first (admin dashboard)
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/pegrio_admin_token=([^;]+)/);
    if (match) {
        const expectedHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
        if (match[1] === expectedHash) return true;
    }

    // Fall back to Bearer token
    const authToken = req.headers.authorization;
    return authToken === `Bearer ${adminPassword}`;
}
