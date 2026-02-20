import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CalendlyModal from '@/components/CalendlyModal'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <CalendlyModal />
    </>
  )
}
