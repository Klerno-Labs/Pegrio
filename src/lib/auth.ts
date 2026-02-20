import { cookies } from 'next/headers'
import crypto from 'crypto'

export const COOKIE_NAME = 'pegrio_admin_token'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function generateToken(password: string): string {
  const timestamp = Date.now().toString()
  return crypto
    .createHash('sha256')
    .update(`${password}:${timestamp}`)
    .digest('hex')
}

export function verifyToken(token: string): boolean {
  // Token is valid if it was generated with the correct admin password
  // We store the hashed password in the cookie and compare
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  const expectedHash = hashPassword(adminPassword)
  return token === expectedHash
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)
}
