import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QRLytics',
  description: 'Plataforma profissional para QR Codes, links rastreáveis, páginas de destino e analytics.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
