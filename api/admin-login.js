import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return res.status(500).json({ error: 'Admin password not configured' })
    }

    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Generate a hashed token from the password
    const token = crypto.createHash('sha256').update(adminPassword).digest('hex')

    // Set httpOnly cookie
    res.setHeader('Set-Cookie', [
      `pegrio_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ])

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
