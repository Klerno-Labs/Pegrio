import { sql } from '@vercel/postgres'
import crypto from 'crypto'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Cookie auth
  if (!isValidCookie(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { quoteId, customerName, customerEmail, amount, packageName, paymentType } = req.body

    if (!customerEmail || !amount || !packageName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create Stripe Price + Payment Link
    const amountInCents = Math.round(amount * 100)

    const price = await stripe.prices.create({
      unit_amount: amountInCents,
      currency: 'usd',
      product_data: {
        name: `${packageName} - Pegrio Web Development`,
        metadata: {
          customerName: customerName || '',
          quoteId: quoteId?.toString() || '',
          customQuote: 'true',
        },
      },
    })

    const domain = process.env.DOMAIN || 'pegrio.com'

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: { url: `https://${domain}?payment=success` },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
      metadata: {
        customerName: customerName || '',
        customerEmail,
        quoteId: quoteId?.toString() || '',
        packageName,
        paymentType,
      },
    })

    // Update quote with stripe link
    if (quoteId) {
      await sql`
        UPDATE quotes
        SET stripe_session_id = ${paymentLink.id},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${quoteId}
      `
    }

    // Send branded email with payment link
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const depositNote = paymentType === 'deposit'
      ? '<p style="color:#6B7280;font-size:14px;margin-top:8px;">This is a 50% deposit. The remaining balance will be due upon project completion.</p>'
      : ''

    await resend.emails.send({
      from: `Pegrio <noreply@${domain}>`,
      to: customerEmail,
      subject: `Your ${packageName} Invoice - Pegrio`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#1A0A2E 0%,#6B3FA0 100%);color:white;padding:40px 30px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="margin:0;font-size:28px;font-weight:800;">Pegrio</h1>
            <p style="margin:8px 0 0;opacity:0.9;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Web Development</p>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <p style="font-size:16px;">Hi ${customerName || 'there'},</p>
            <p style="font-size:16px;">Thank you for choosing Pegrio! Here are the details for your project:</p>

            <div style="background:#F8F5F0;padding:24px;border-radius:8px;margin:24px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6B7280;font-size:14px;">Package</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1A0A2E;">${packageName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6B7280;font-size:14px;">Amount Due</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;font-size:24px;color:#6B3FA0;">$${amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6B7280;font-size:14px;">Payment Type</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1A0A2E;">${paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'}</td>
                </tr>
              </table>
            </div>

            ${depositNote}

            <div style="text-align:center;margin:32px 0;">
              <a href="${paymentLink.url}" style="display:inline-block;background:linear-gradient(135deg,#6B3FA0,#1A0A2E);color:white;padding:16px 40px;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">
                Pay Now — $${amount.toLocaleString()}
              </a>
            </div>

            <p style="font-size:14px;color:#6B7280;text-align:center;">Payment is secured by Stripe. You can pay with credit card, debit card, or bank transfer.</p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

            <div style="text-align:center;color:#6B7280;font-size:13px;">
              <p><strong>What happens next?</strong></p>
              <p>Once payment is received, we will schedule your project kickoff call within 24 hours.</p>
              <p style="margin-top:20px;">Pegrio Web Development<br>www.pegrio.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Notify admin
    await resend.emails.send({
      from: `Pegrio <noreply@${domain}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Payment Link Sent: ${packageName} - ${customerName}`,
      html: `<p>Payment link sent to <strong>${customerName}</strong> (${customerEmail}) for <strong>$${amount.toLocaleString()}</strong> (${packageName}).</p><p><a href="${paymentLink.url}">Payment Link</a></p>`,
    })

    return res.status(200).json({
      success: true,
      paymentUrl: paymentLink.url,
    })
  } catch (error) {
    console.error('Error sending payment email:', error)
    return res.status(500).json({ error: 'Failed to send payment email' })
  }
}

function isValidCookie(req) {
  const cookieHeader = req.headers.cookie || ''
  const match = cookieHeader.match(/pegrio_admin_token=([^;]+)/)
  if (!match) return false

  const token = match[1]
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const expectedHash = crypto.createHash('sha256').update(adminPassword).digest('hex')
  return token === expectedHash
}
