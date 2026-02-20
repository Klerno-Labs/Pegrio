export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Clear the auth cookie
  res.setHeader('Set-Cookie', [
    `pegrio_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  ])

  return res.status(200).json({ success: true })
}
