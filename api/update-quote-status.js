import { sql } from './_db.js'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isValidCookie(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { quoteId, status } = req.body

    if (!quoteId || !status) {
      return res.status(400).json({ error: 'Missing quoteId or status' })
    }

    const validStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const result = await sql`
      UPDATE quotes
      SET payment_status = ${status},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${quoteId}
      RETURNING id, payment_status
    `

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' })
    }

    return res.status(200).json({
      success: true,
      quote: result.rows[0],
    })
  } catch (error) {
    console.error('Error updating quote status:', error)
    return res.status(500).json({ error: 'Failed to update status' })
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
