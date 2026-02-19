/**
 * Test Script - Resend Email Notification
 * Tests the quote submission email without needing the full site
 */

import { config } from 'dotenv';
config(); // Load .env file

// Import the save-quote API handler
const saveQuoteHandler = (await import('./api/save-quote.js')).default;

// Create mock request and response objects
const mockRequest = {
    method: 'POST',
    body: {
        customerName: 'Test Customer',
        customerEmail: 'customer@example.com',
        businessName: 'Test Restaurant',
        phone: '555-0123',
        packageName: 'Professional Package',
        packagePrice: 2499, // $24.99 in cents
        paymentType: 'full',
        message: 'This is a test quote submission to verify email notifications are working!',
        source: 'test-script',
        utmSource: 'test',
        utmMedium: 'script',
        utmCampaign: 'email-verification'
    },
    headers: {
        'x-forwarded-for': '127.0.0.1',
        'user-agent': 'Test Script / Email Verification'
    },
    connection: {
        remoteAddress: '127.0.0.1'
    }
};

const mockResponse = {
    statusCode: 200,
    responseBody: null,

    status(code) {
        this.statusCode = code;
        return this;
    },

    json(data) {
        this.responseBody = data;
        console.log('\n✅ API Response:');
        console.log(JSON.stringify(data, null, 2));
        return this;
    }
};

// Run the test
console.log('🧪 Testing Resend Email Notification...\n');
console.log('📧 Email will be sent to:', process.env.NOTIFICATION_EMAIL);
console.log('📝 Quote details:', {
    package: mockRequest.body.packageName,
    price: `$${(mockRequest.body.packagePrice / 100).toFixed(2)}`,
    customer: mockRequest.body.customerName
});
console.log('\n⏳ Sending email...\n');

try {
    await saveQuoteHandler(mockRequest, mockResponse);

    if (mockResponse.statusCode === 200) {
        console.log('\n✅ SUCCESS! Email sent successfully!');
        console.log('📬 Check your inbox at:', process.env.NOTIFICATION_EMAIL);
        console.log('\nQuote ID:', mockResponse.responseBody?.quoteId || 'N/A');
    } else {
        console.log('\n❌ ERROR:', mockResponse.responseBody);
    }
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
}
