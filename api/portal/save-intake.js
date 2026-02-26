/* ========================================
   SAVE INTAKE QUESTIONNAIRE API
   Saves partial or complete intake answers
   ======================================== */

import { sql } from '../_db.js';

/**
 * POST /api/portal/save-intake
 * Body: { token, answers, submit? }
 * Merges answers into orders.intake_answers JSONB
 * If submit=true, also updates status to "building" and creates event
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token, answers, submit } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'Answers object is required' });
    }

    try {
        // Verify token and get current order
        const orderResult = await sql`
            SELECT id, intake_answers, status, customer_email, customer_name, business_name, tier
            FROM orders
            WHERE portal_token = ${token}
            LIMIT 1
        `;

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Merge new answers with existing answers
        const existingAnswers = order.intake_answers || {};
        const mergedAnswers = { ...existingAnswers, ...answers };

        if (submit) {
            // Final submission — update status to "building"
            await sql`
                UPDATE orders
                SET
                    intake_answers = ${JSON.stringify(mergedAnswers)}::jsonb,
                    status = 'building',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${order.id}
            `;

            // Create order event
            await sql`
                INSERT INTO order_events (order_id, event_type, details, created_at)
                VALUES (
                    ${order.id},
                    'intake_submitted',
                    ${JSON.stringify({
                        message: 'Client completed the intake questionnaire',
                        tier: order.tier
                    })}::jsonb,
                    CURRENT_TIMESTAMP
                )
            `;

            // Send confirmation email via Resend
            try {
                const { Resend } = require('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                if (order.customer_email) {
                    await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
                        to: order.customer_email,
                        subject: 'Questionnaire Received - We\'re Building Your Website!',
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                    .header { background: linear-gradient(135deg, #0a0a1a 0%, #6B3FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                                    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
                                    .highlight { background: #f3f0ff; padding: 16px; border-radius: 8px; border-left: 4px solid #6B3FA0; margin: 20px 0; }
                                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">
                                        <h1 style="margin:0;">We Got Your Answers!</h1>
                                        <p style="margin:8px 0 0; opacity:0.9;">Your website is now in production</p>
                                    </div>
                                    <div class="content">
                                        <p>Hi ${order.customer_name || 'there'},</p>
                                        <p>Thank you for completing the questionnaire for <strong>${order.business_name || 'your website'}</strong>. Our team is now hard at work bringing your vision to life.</p>
                                        <div class="highlight">
                                            <strong>What happens next?</strong>
                                            <ul style="margin:8px 0 0; padding-left:20px;">
                                                <li>Our designers will review your answers</li>
                                                <li>We'll start building your website</li>
                                                <li>You'll receive an email when it's ready for review</li>
                                            </ul>
                                        </div>
                                        <p>You can check on your project status anytime through your client portal.</p>
                                        <p>Best regards,<br>The Pegrio Team</p>
                                    </div>
                                    <div class="footer">
                                        <p>Pegrio - Premium Business Websites</p>
                                        <p>hello@pegrio.com | www.pegrio.com</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                        `
                    });
                }

                // Notify admin
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
                    to: process.env.NOTIFICATION_EMAIL || 'hello@pegrio.com',
                    subject: `Intake Complete: ${order.business_name || order.customer_name} (Tier ${order.tier})`,
                    html: `
                        <h2>Client Intake Submitted</h2>
                        <p><strong>Client:</strong> ${order.customer_name}</p>
                        <p><strong>Business:</strong> ${order.business_name}</p>
                        <p><strong>Tier:</strong> ${order.tier}</p>
                        <p><strong>Email:</strong> ${order.customer_email}</p>
                        <hr>
                        <p>The questionnaire answers are saved to the order. Time to start building!</p>
                        <pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:13px;overflow:auto;">${JSON.stringify(mergedAnswers, null, 2)}</pre>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send intake confirmation email:', emailError);
                // Don't fail the request if email fails
            }

            return res.status(200).json({
                success: true,
                submitted: true,
                message: 'Questionnaire submitted successfully'
            });

        } else {
            // Draft save — just update answers
            await sql`
                UPDATE orders
                SET
                    intake_answers = ${JSON.stringify(mergedAnswers)}::jsonb,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${order.id}
            `;

            return res.status(200).json({
                success: true,
                submitted: false,
                message: 'Draft saved'
            });
        }

    } catch (error) {
        console.error('Error saving intake:', error);
        return res.status(500).json({
            error: 'Failed to save intake',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
