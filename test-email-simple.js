/**
 * Simple Email Test - Tests Resend directly
 * No database required!
 */

import { config } from 'dotenv';
config(); // Load .env

console.log('🧪 Testing Resend Email...\n');
console.log('📧 Sending to:', process.env.NOTIFICATION_EMAIL);
console.log('🔑 API Key configured:', process.env.RESEND_API_KEY ? '✅ Yes' : '❌ No');

if (!process.env.RESEND_API_KEY) {
    console.error('\n❌ ERROR: RESEND_API_KEY not found in .env file');
    process.exit(1);
}

if (!process.env.NOTIFICATION_EMAIL) {
    console.error('\n❌ ERROR: NOTIFICATION_EMAIL not found in .env file');
    process.exit(1);
}

// Import Resend
const { Resend } = await import('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Test data
const testQuoteData = {
    quoteId: 999,
    customerName: 'Test Customer',
    customerEmail: 'customer@test.com',
    businessName: 'Test Restaurant',
    packageName: 'Professional Package',
    packagePrice: 24.99,
    paymentType: 'full',
    message: 'This is a test email to verify Resend integration is working correctly!',
    createdAt: new Date().toISOString()
};

// Email HTML (simplified version from api/save-quote.js)
const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #10b981;
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">🧪 Test Email - Resend Integration</h1>
        <p style="margin: 10px 0 0 0;">This is a test to verify your email notifications work!</p>
    </div>
    <div class="content">
        <p><span class="status-badge">✅ TEST MODE</span></p>

        <h2>Customer Information</h2>
        <div class="info-row"><strong>Name:</strong> ${testQuoteData.customerName}</div>
        <div class="info-row"><strong>Email:</strong> ${testQuoteData.customerEmail}</div>
        <div class="info-row"><strong>Business:</strong> ${testQuoteData.businessName}</div>

        <h2>Quote Details</h2>
        <div class="info-row"><strong>Package:</strong> ${testQuoteData.packageName}</div>
        <div class="info-row"><strong>Price:</strong> $${testQuoteData.packagePrice.toLocaleString()}</div>
        <div class="info-row"><strong>Payment Type:</strong> ${testQuoteData.paymentType}</div>
        <div class="info-row"><strong>Quote ID:</strong> #${testQuoteData.quoteId}</div>

        <h2>Customer Message</h2>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
            ${testQuoteData.message}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p><strong>✅ If you received this email, your Resend integration is working perfectly!</strong></p>
            <p>When real customers submit quotes, you'll get emails just like this.</p>
        </div>
    </div>
</body>
</html>
`;

// Send the test email
console.log('\n⏳ Sending test email...\n');

try {
    const result = await resend.emails.send({
        from: 'Pegrio Test <onboarding@resend.dev>', // Using Resend's test domain
        to: process.env.NOTIFICATION_EMAIL,
        subject: '🧪 Test Email - Pegrio Resend Integration',
        html: emailHtml
    });

    console.log('✅ SUCCESS! Email sent!');
    console.log('\n📬 Email Details:');
    console.log('   To:', process.env.NOTIFICATION_EMAIL);
    console.log('   Email ID:', result.data?.id || result.id);
    console.log('\n💡 Check your inbox at:', process.env.NOTIFICATION_EMAIL);
    console.log('\n⚠️  Note: Email is from "onboarding@resend.dev" (Resend test domain)');
    console.log('   To use your custom domain, verify it in Resend dashboard');

} catch (error) {
    console.error('\n❌ ERROR sending email:');
    console.error('   Message:', error.message);

    if (error.message.includes('API key')) {
        console.error('\n💡 Fix: Check your RESEND_API_KEY in .env file');
    } else if (error.message.includes('email')) {
        console.error('\n💡 Fix: Check your NOTIFICATION_EMAIL in .env file');
    }

    console.error('\nFull error:', error);
}
