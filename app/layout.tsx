import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShortLink SaaS',
  description: 'Seu próprio encurtador de links com QR Code e analytics usando Next.js + Supabase.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
