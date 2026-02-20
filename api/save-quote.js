/* ========================================
   SAVE QUOTE API
   Store quote submissions in Vercel Postgres
   ======================================== */

import { sql } from './_db.js';

/**
 * Save quote to database
 * Called before redirecting to Stripe checkout
 */
export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            customerName,
            customerEmail,
            businessName,
            phone,
            packageName,
            packagePrice,
            paymentType,
            message,
            source,
            utmSource,
            utmMedium,
            utmCampaign
        } = req.body;

        // Validate required fields
        if (!customerName || !customerEmail || !packageName || !packagePrice) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['customerName', 'customerEmail', 'packageName', 'packagePrice']
            });
        }

        // Get IP address
        const ipAddress = req.headers['x-forwarded-for'] ||
                         req.headers['x-real-ip'] ||
                         req.connection.remoteAddress;

        // Get user agent
        const userAgent = req.headers['user-agent'];

        // Convert price to cents if it's in dollars
        const priceInCents = typeof packagePrice === 'number' && packagePrice < 1000
            ? packagePrice * 100
            : packagePrice;

        // Insert into database
        const result = await sql`
            INSERT INTO quotes (
                customer_name,
                customer_email,
                business_name,
                phone,
                package,
                package_price,
                payment_type,
                message,
                source,
                utm_source,
                utm_medium,
                utm_campaign,
                ip_address,
                user_agent,
                payment_status
            ) VALUES (
                ${customerName},
                ${customerEmail},
                ${businessName || null},
                ${phone || null},
                ${packageName},
                ${priceInCents},
                ${paymentType || 'full'},
                ${message || null},
                ${source || 'website'},
                ${utmSource || null},
                ${utmMedium || null},
                ${utmCampaign || null},
                ${ipAddress},
                ${userAgent},
                'pending'
            )
            RETURNING id, created_at
        `;

        const quote = result.rows[0];

        // Send notification email to admin
        await sendAdminNotification({
            quoteId: quote.id,
            customerName,
            customerEmail,
            businessName,
            packageName,
            packagePrice: priceInCents / 100,
            paymentType,
            message,
            createdAt: quote.created_at
        });

        // Return quote ID
        return res.status(200).json({
            success: true,
            quoteId: quote.id,
            message: 'Quote saved successfully'
        });

    } catch (error) {
        console.error('Error saving quote:', error);

        return res.status(500).json({
            error: 'Failed to save quote',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Send notification email to admin
 */
async function sendAdminNotification(data) {
    const {
        quoteId,
        customerName,
        customerEmail,
        businessName,
        packageName,
        packagePrice,
        paymentType,
        message,
        createdAt
    } = data;

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured - skipping email notification');
        return;
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const domain = process.env.DOMAIN || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                }
                .content {
                    background: white;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                }
                .info-row {
                    display: flex;
                    padding: 12px 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                .info-label {
                    font-weight: 600;
                    width: 150px;
                    color: #6b7280;
                }
                .info-value {
                    flex: 1;
                    color: #111827;
                }
                .message-box {
                    background: #f9fafb;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                    border-left: 4px solid #667eea;
                }
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: 600;
                }
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    background: #fbbf24;
                    color: #78350f;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🎉 New Quote Request!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.95;">Someone just requested a quote on your website</p>
            </div>
            <div class="content">
                <p><span class="status-badge">⏳ Payment Pending</span></p>

                <h2 style="margin-top: 20px;">Customer Information</h2>
                <div class="info-row">
                    <div class="info-label">Name:</div>
                    <div class="info-value">${customerName}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
                </div>
                ${businessName ? `
                <div class="info-row">
                    <div class="info-label">Business:</div>
                    <div class="info-value">${businessName}</div>
                </div>
                ` : ''}

                <h2 style="margin-top: 30px;">Quote Details</h2>
                <div class="info-row">
                    <div class="info-label">Package:</div>
                    <div class="info-value"><strong>${packageName}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Price:</div>
                    <div class="info-value"><strong>$${packagePrice.toLocaleString()}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Payment Type:</div>
                    <div class="info-value">${paymentType}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Quote ID:</div>
                    <div class="info-value">#${quoteId}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Submitted:</div>
                    <div class="info-value">${new Date(createdAt).toLocaleString()}</div>
                </div>

                ${message ? `
                <h2 style="margin-top: 30px;">Customer Message</h2>
                <div class="message-box">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                ` : ''}

                <div style="text-align: center;">
                    <a href="${protocol}://${domain}/admin" class="cta-button">
                        View in Admin Dashboard →
                    </a>
                </div>

                <div class="footer">
                    <p><strong>Next Steps:</strong></p>
                    <p style="margin: 10px 0;">The customer will complete payment on Stripe.<br>You'll receive another email when payment is confirmed.</p>
                    <p style="margin-top: 20px; font-size: 12px;">This is an automated notification from Pegrio</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: `Pegrio <noreply@${domain}>`,
            to: process.env.NOTIFICATION_EMAIL,
            subject: `🎉 New Quote Request: ${packageName} - ${customerName}`,
            html: emailHtml
        });

        console.log('Admin notification sent for quote #' + quoteId);
    } catch (error) {
        console.error('Failed to send admin notification:', error);
        // Don't throw - quote is still saved even if email fails
    }
}
