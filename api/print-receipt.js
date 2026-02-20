/* ========================================
   PRINT RECEIPT API
   Sends receipt to thermal printer via PrintNode
   ======================================== */

import { sql } from './_db.js';

/**
 * Print receipt when order is fulfilled
 * Integrates with PrintNode for thermal printing
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { quoteId } = req.body;

        if (!quoteId) {
            return res.status(400).json({ error: 'Quote ID required' });
        }

        // Get quote from database
        const result = await sql`
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
                created_at
            FROM quotes
            WHERE id = ${quoteId}
        `;

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        const quote = result.rows[0];

        // Generate receipt content (ESC/POS commands for thermal printer)
        const receipt = generateReceiptContent(quote);

        // Send to PrintNode
        const printed = await sendToPrintNode(receipt);

        if (printed) {
            // Update quote status to fulfilled
            await sql`
                UPDATE quotes
                SET payment_status = 'fulfilled'
                WHERE id = ${quoteId}
            `;

            return res.status(200).json({
                success: true,
                message: 'Receipt printed successfully',
                quoteId
            });
        } else {
            throw new Error('Print job failed');
        }

    } catch (error) {
        console.error('Print error:', error);
        return res.status(500).json({
            error: 'Failed to print receipt',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Generate receipt content for thermal printer
 * 58mm/80mm thermal printer compatible
 */
function generateReceiptContent(quote) {
    const lineWidth = 48; // Characters per line for 58mm printer
    const centerText = (text) => {
        const padding = Math.max(0, Math.floor((lineWidth - text.length) / 2));
        return ' '.repeat(padding) + text;
    };
    const line = '='.repeat(lineWidth);
    const dashLine = '-'.repeat(lineWidth);

    const price = (quote.package_price / 100).toFixed(2);
    const tax = (quote.package_price * 0.08 / 100).toFixed(2); // 8% tax example
    const total = (parseFloat(price) + parseFloat(tax)).toFixed(2);

    const receipt = `
${centerText('PEGRIO')}
${centerText('AI-Powered Websites')}
${centerText('pegrio.com')}
${line}

Order #${quote.id}
Date: ${new Date(quote.created_at).toLocaleString()}

${dashLine}
CUSTOMER INFORMATION
${dashLine}
Name: ${quote.customer_name}
${quote.business_name ? `Business: ${quote.business_name}` : ''}
Email: ${quote.customer_email}
${quote.phone ? `Phone: ${quote.phone}` : ''}

${dashLine}
ORDER DETAILS
${dashLine}
Package: ${quote.package}
Price: $${price}
${quote.payment_type === 'deposit' ? '(Deposit Payment)' : ''}

${quote.message ? `\nNotes:\n${quote.message}\n` : ''}

${dashLine}
Subtotal:                    $${price}
Tax (8%):                     $${tax}
${line}
TOTAL DUE:                   $${total}
${line}

${centerText('⚠️ PAYMENT REQUIRED AT PICKUP ⚠️')}
${centerText('Pay at counter with your POS')}

${dashLine}
${centerText('Thank you for choosing Pegrio!')}
${centerText('Questions? Email hello@pegrio.com')}
${dashLine}




`.trim();

    return receipt;
}

/**
 * Send print job to PrintNode
 */
async function sendToPrintNode(content) {
    const PRINTNODE_API_KEY = process.env.PRINTNODE_API_KEY;
    const PRINTER_ID = process.env.PRINTNODE_PRINTER_ID;

    if (!PRINTNODE_API_KEY) {
        console.warn('PrintNode not configured - receipt not printed');
        console.log('Receipt would have printed:\n', content);
        return false; // Don't fail if PrintNode not configured
    }

    try {
        const response = await fetch('https://api.printnode.com/printjobs', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(PRINTNODE_API_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                printerId: PRINTER_ID,
                title: `Receipt - Order #${Date.now()}`,
                contentType: 'raw_base64',
                content: Buffer.from(content).toString('base64'),
                source: 'Pegrio Admin'
            })
        });

        if (!response.ok) {
            throw new Error(`PrintNode API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Print job sent:', result);
        return true;

    } catch (error) {
        console.error('❌ PrintNode error:', error);
        return false;
    }
}
