/* ========================================
   SUBSCRIBE LEAD API
   Add email to ConvertKit/Mailchimp
   ======================================== */

/**
 * Subscribe a lead to email marketing service
 * Supports ConvertKit (recommended) and Mailchimp
 */

// ConvertKit is cleaner for creators/small businesses
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            email,
            firstName,
            lastName,
            tagId,
            leadMagnet,
            source
        } = req.body;

        // Validation
        if (!email || !firstName) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'email and firstName are required'
            });
        }

        // Subscribe to ConvertKit
        const result = await subscribeToConvertKit({
            email,
            firstName,
            lastName,
            tagId,
            leadMagnet,
            source
        });

        // Send welcome email with lead magnet
        await sendLeadMagnetEmail({
            email,
            firstName,
            leadMagnet
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully subscribed',
            subscriber: result
        });

    } catch (error) {
        console.error('❌ Subscribe error:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

/**
 * Subscribe to ConvertKit
 */
async function subscribeToConvertKit(data) {
    if (!CONVERTKIT_API_KEY) {
        console.warn('⚠️  ConvertKit API key not set - skipping subscription');
        return { skipped: true };
    }

    try {
        const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: CONVERTKIT_API_KEY,
                email: data.email,
                first_name: data.firstName,
                fields: {
                    last_name: data.lastName || '',
                    lead_magnet: data.leadMagnet || '',
                    source: data.source || 'website'
                },
                tags: data.tagId ? [data.tagId] : []
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'ConvertKit subscription failed');
        }

        const result = await response.json();
        console.log('✅ Subscribed to ConvertKit:', data.email);

        return result.subscription;

    } catch (error) {
        console.error('❌ ConvertKit error:', error);
        throw error;
    }
}

/**
 * Send lead magnet email with download link
 */
async function sendLeadMagnetEmail(data) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  Resend API key not set - skipping email');
        return;
    }

    // Map lead magnet to file URL
    const leadMagnetFiles = {
        'Ultimate Website Launch Checklist': {
            url: `${process.env.DOMAIN || 'https://pegrio.com'}/downloads/website-launch-checklist.pdf`,
            fileName: 'Website-Launch-Checklist.pdf'
        },
        'Website ROI Calculator': {
            url: `${process.env.DOMAIN || 'https://pegrio.com'}/downloads/website-roi-calculator.pdf`,
            fileName: 'Website-ROI-Calculator.pdf'
        },
        'Modern Web Design Guide 2026': {
            url: `${process.env.DOMAIN || 'https://pegrio.com'}/downloads/web-design-guide-2026.pdf`,
            fileName: 'Web-Design-Guide-2026.pdf'
        }
    };

    const file = leadMagnetFiles[data.leadMagnet] || leadMagnetFiles['Ultimate Website Launch Checklist'];

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
            to: data.email,
            subject: `Here's your ${data.leadMagnet}! 📥`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
                        .download-button { display: inline-block; padding: 16px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📥 Your Free Resource is Ready!</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${data.firstName},</p>

                            <p>Thanks for downloading <strong>${data.leadMagnet}</strong>!</p>

                            <p>Click the button below to download your free PDF:</p>

                            <center>
                                <a href="${file.url}" class="download-button" download="${file.fileName}">
                                    Download ${data.leadMagnet} →
                                </a>
                            </center>

                            <p><small>Link not working? Copy and paste this URL into your browser:<br>
                            ${file.url}</small></p>

                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

                            <h3>What's Next?</h3>
                            <p>If you're thinking about building a new website, here's how we can help:</p>

                            <ul>
                                <li><strong>Free Discovery Call</strong> - Let's discuss your vision (no pressure!)</li>
                                <li><strong>Custom Proposal</strong> - Get exact pricing for your project</li>
                                <li><strong>6-Week Timeline</strong> - From design to launch</li>
                            </ul>

                            <p>Ready to chat? <a href="https://calendly.com/your-username/discovery-call">Book a free 30-minute call →</a></p>

                            <p>Have questions? Just reply to this email!</p>

                            <p>Best,<br>
                            The Pegrio Team</p>
                        </div>

                        <div class="footer">
                            <p>Pegrio - AI-Powered Business Websites</p>
                            <p>You're receiving this because you requested ${data.leadMagnet} from our website.</p>
                            <p><a href="#">Unsubscribe</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log(`✅ Lead magnet email sent to ${data.email}`);

    } catch (error) {
        console.error('❌ Failed to send lead magnet email:', error);
        // Don't throw - subscription already succeeded
    }
}
