// Serverless function for form submission (Vercel/Netlify compatible)
// Deploy this to /api/submit-quote

/**
 * Quote Submission API Endpoint
 * Handles form submissions and sends emails
 */

// Environment variables needed:
// - SENDGRID_API_KEY or RESEND_API_KEY
// - NOTIFICATION_EMAIL (where to send quotes)

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body;

        // Validate required fields
        if (!formData.name || !formData.email || !formData.business) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'email', 'business']
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Rate limiting check (simple implementation)
        // In production, use Redis or a proper rate limiting service
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // TODO: Implement rate limiting

        // Send email notification
        await sendEmailNotification(formData);

        // Optionally: Store in database
        // await storeQuoteInDatabase(formData);

        // Return success
        return res.status(200).json({
            success: true,
            message: 'Quote request received successfully'
        });

    } catch (error) {
        console.error('Error processing quote:', error);
        return res.status(500).json({
            error: 'Failed to process quote request',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Send email notification using SendGrid or Resend
 */
async function sendEmailNotification(formData) {
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'hello@pegrio.com';

    // Option 1: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: notificationEmail,
            from: notificationEmail, // Must be verified in SendGrid
            subject: `New Quote Request: ${formData.package} - ${formData.business}`,
            html: generateEmailHTML(formData),
            text: generateEmailText(formData)
        };

        await sgMail.send(msg);
    }

    // Option 2: Using Resend (recommended - easier setup)
    else if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: `Pegrio <${notificationEmail}>`,
            to: notificationEmail,
            subject: `New Quote Request: ${formData.package} - ${formData.business}`,
            html: generateEmailHTML(formData)
        });
    }

    // Option 3: Send confirmation email to customer
    if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: `Pegrio <${notificationEmail}>`,
            to: formData.email,
            subject: 'Thank you for your quote request!',
            html: generateCustomerConfirmationHTML(formData)
        });
    }
}

/**
 * Generate HTML email for admin notification
 */
function generateEmailHTML(formData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0071e3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f5f5f7; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: 600; color: #666; }
        .value { color: #1d1d1f; }
        .package-badge { background: #0071e3; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Quote Request!</h1>
        </div>
        <div class="content">
            <div class="package-badge">${formData.package} - ${formData.price}</div>

            <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.name}</div>
            </div>

            <div class="field">
                <div class="label">Business:</div>
                <div class="value">${formData.business}</div>
            </div>

            <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
            </div>

            <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${formData.phone || 'Not provided'}</div>
            </div>

            <div class="field">
                <div class="label">Payment Type:</div>
                <div class="value">${formData.paymentType}</div>
            </div>

            ${formData.message ? `
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message}</div>
            </div>
            ` : ''}

            <div class="field">
                <div class="label">Submitted:</div>
                <div class="value">${new Date(formData.timestamp).toLocaleString()}</div>
            </div>

            <div class="field">
                <div class="label">User Agent:</div>
                <div class="value" style="font-size: 12px; color: #888;">${formData.userAgent || 'Unknown'}</div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Generate plain text email
 */
function generateEmailText(formData) {
    return `
New Quote Request

Package: ${formData.package} - ${formData.price}
Payment Type: ${formData.paymentType}

Contact Information:
Name: ${formData.name}
Business: ${formData.business}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Message: ${formData.message || 'None'}

Submitted: ${new Date(formData.timestamp).toLocaleString()}
    `;
}

/**
 * Generate customer confirmation email
 */
function generateCustomerConfirmationHTML(formData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 40px 30px; }
        .footer { background: #f5f5f7; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">✨ Thank You, ${formData.name}!</h1>
        </div>
        <div class="content">
            <p>We've received your quote request for the <strong>${formData.package}</strong>.</p>

            <p>Our team will review your requirements and send you a detailed proposal within 24 hours to <strong>${formData.email}</strong>.</p>

            <h3>What's Next?</h3>
            <ul>
                <li>We'll review your project requirements</li>
                <li>Prepare a customized proposal and timeline</li>
                <li>Schedule a discovery call (if needed)</li>
                <li>Get started on your amazing website!</li>
            </ul>

            <p>If you have any questions in the meantime, just reply to this email!</p>

            <p>Best regards,<br>The Pegrio Team</p>
        </div>
        <div class="footer">
            <p>Pegrio | AI-Powered Websites<br>
            <a href="https://pegrio.com">pegrio.com</a></p>
        </div>
    </div>
</body>
</html>
    `;
}
