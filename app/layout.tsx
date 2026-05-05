import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QRLytics',
  description: 'Plataforma profissional para QR Codes, links rastreáveis e analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
