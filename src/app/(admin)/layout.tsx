import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Admin Dashboard | Pegrio',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page doesn't need auth check
  return <AdminShell>{children}</AdminShell>
}
