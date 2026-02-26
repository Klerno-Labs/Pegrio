/* ========================================
   SUBMIT REVIEW API
   Handles client review actions: approve, request changes, start fresh
   ======================================== */

import { sql } from '../_db.js';

/**
 * POST /api/portal/submit-review
 * Body: { token, action, notes?, reference_url? }
 * action: "approve" | "changes" | "fresh"
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token, action, notes, reference_url } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    if (!action || !['approve', 'changes', 'fresh'].includes(action)) {
        return res.status(400).json({ error: 'Valid action is required (approve, changes, fresh)' });
    }

    try {
        // Fetch current order
        const orderResult = await sql`
            SELECT id, status, revision_count, max_revisions, revision_notes,
                   customer_name, customer_email, business_name, tier
            FROM orders
            WHERE portal_token = ${token}
            LIMIT 1
        `;

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Verify order is in a reviewable state
        if (order.status !== 'review') {
            return res.status(400).json({
                error: 'Order is not in review status',
                currentStatus: order.status
            });
        }

        // ─── APPROVE ───
        if (action === 'approve') {
            await sql`
                UPDATE orders
                SET
                    status = 'approved',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${order.id}
            `;

            await sql`
                INSERT INTO order_events (order_id, event_type, details, created_at)
                VALUES (
                    ${order.id},
                    'design_approved',
                    ${JSON.stringify({
                        message: 'Client approved the design',
                        revision_count: order.revision_count
                    })}::jsonb,
                    CURRENT_TIMESTAMP
                )
            `;

            // Send email notifications
            await sendReviewEmails(order, 'approved', null);

            return res.status(200).json({
                success: true,
                action: 'approve',
                newStatus: 'approved',
                message: 'Design approved successfully'
            });
        }

        // ─── REQUEST CHANGES or START FRESH ───
        const currentRevisionCount = order.revision_count || 0;
        const maxRevisions = order.max_revisions || 2;

        // Check revision limit
        if (currentRevisionCount >= maxRevisions) {
            return res.status(400).json({
                error: 'Revision limit reached',
                revision_count: currentRevisionCount,
                max_revisions: maxRevisions,
                message: `You have used all ${maxRevisions} revisions. Additional revisions are $250 each. Please contact us at support@pegrio.com.`
            });
        }

        // Build revision note entry
        const revisionNote = {
            type: action, // "changes" or "fresh"
            notes: notes || '',
            reference_url: reference_url || null,
            submitted_at: new Date().toISOString(),
            revision_number: currentRevisionCount + 1
        };

        // Get existing revision notes array
        const existingNotes = order.revision_notes || [];
        const updatedNotes = [...existingNotes, revisionNote];

        // Update order
        await sql`
            UPDATE orders
            SET
                status = 'revision',
                revision_count = ${currentRevisionCount + 1},
                revision_notes = ${JSON.stringify(updatedNotes)}::jsonb,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${order.id}
        `;

        // Create order event
        const eventType = action === 'fresh' ? 'revision_fresh_start' : 'revision_requested';
        await sql`
            INSERT INTO order_events (order_id, event_type, details, created_at)
            VALUES (
                ${order.id},
                ${eventType},
                ${JSON.stringify({
                    message: action === 'fresh'
                        ? 'Client requested a fresh start'
                        : 'Client requested design changes',
                    notes: notes || '',
                    reference_url: reference_url || null,
                    revision_number: currentRevisionCount + 1,
                    remaining: maxRevisions - (currentRevisionCount + 1)
                })}::jsonb,
                CURRENT_TIMESTAMP
            )
        `;

        // Send email notifications
        await sendReviewEmails(order, action, { notes, reference_url, revisionNumber: currentRevisionCount + 1 });

        return res.status(200).json({
            success: true,
            action,
            newStatus: 'revision',
            revision_count: currentRevisionCount + 1,
            max_revisions: maxRevisions,
            remaining: maxRevisions - (currentRevisionCount + 1),
            message: action === 'fresh'
                ? 'Fresh start request submitted'
                : 'Change request submitted'
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({
            error: 'Failed to submit review',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Send email notifications for review actions
 */
async function sendReviewEmails(order, action, details) {
    try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com';
        const adminEmail = process.env.NOTIFICATION_EMAIL || 'hello@pegrio.com';

        if (action === 'approved') {
            // Client confirmation
            if (order.customer_email) {
                await resend.emails.send({
                    from: fromEmail,
                    to: order.customer_email,
                    subject: 'Design Approved - Preparing Your Website for Delivery!',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #0a0a1a 0%, #2d8a4e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                                .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
                                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin:0;">Design Approved!</h1>
                                </div>
                                <div class="content">
                                    <p>Hi ${order.customer_name || 'there'},</p>
                                    <p>Great news! You've approved the design for <strong>${order.business_name || 'your website'}</strong>.</p>
                                    <p>We're now preparing your website for delivery. You'll receive another email with delivery options shortly.</p>
                                    <p>Thank you for choosing Pegrio!</p>
                                    <p>Best regards,<br>The Pegrio Team</p>
                                </div>
                                <div class="footer"><p>Pegrio | hello@pegrio.com | www.pegrio.com</p></div>
                            </div>
                        </body>
                        </html>
                    `
                });
            }

            // Admin notification
            await resend.emails.send({
                from: fromEmail,
                to: adminEmail,
                subject: `Design Approved: ${order.business_name || order.customer_name}`,
                html: `
                    <h2>Client Approved Design</h2>
                    <p><strong>Client:</strong> ${order.customer_name}</p>
                    <p><strong>Business:</strong> ${order.business_name}</p>
                    <p><strong>Tier:</strong> ${order.tier}</p>
                    <hr>
                    <p>Time to prepare for delivery!</p>
                `
            });
        } else {
            // Revision requested — notify admin
            await resend.emails.send({
                from: fromEmail,
                to: adminEmail,
                subject: `Revision Requested: ${order.business_name || order.customer_name} (${action === 'fresh' ? 'Fresh Start' : 'Changes'})`,
                html: `
                    <h2>${action === 'fresh' ? 'Fresh Start Requested' : 'Changes Requested'}</h2>
                    <p><strong>Client:</strong> ${order.customer_name}</p>
                    <p><strong>Business:</strong> ${order.business_name}</p>
                    <p><strong>Tier:</strong> ${order.tier}</p>
                    <p><strong>Revision #:</strong> ${details?.revisionNumber || '?'}</p>
                    <hr>
                    <p><strong>Notes:</strong></p>
                    <blockquote style="background:#f4f4f4;padding:16px;border-radius:8px;border-left:4px solid #6B3FA0;">${details?.notes || 'No notes provided'}</blockquote>
                    ${details?.reference_url ? `<p><strong>Reference URL:</strong> <a href="${details.reference_url}">${details.reference_url}</a></p>` : ''}
                `
            });

            // Confirm to client
            if (order.customer_email) {
                await resend.emails.send({
                    from: fromEmail,
                    to: order.customer_email,
                    subject: 'Revision Request Received - We\'re On It!',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #0a0a1a 0%, #6B3FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                                .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
                                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin:0;">Revision Request Received</h1>
                                </div>
                                <div class="content">
                                    <p>Hi ${order.customer_name || 'there'},</p>
                                    <p>We've received your revision request for <strong>${order.business_name || 'your website'}</strong>.</p>
                                    <p>Our team is reviewing your feedback and will get to work on the changes. You'll receive an email when the updated design is ready for review.</p>
                                    <p>Best regards,<br>The Pegrio Team</p>
                                </div>
                                <div class="footer"><p>Pegrio | hello@pegrio.com | www.pegrio.com</p></div>
                            </div>
                        </body>
                        </html>
                    `
                });
            }
        }
    } catch (emailError) {
        console.error('Failed to send review email:', emailError);
        // Don't fail the request if email fails
    }
}
