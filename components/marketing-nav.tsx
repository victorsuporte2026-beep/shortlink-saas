'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BrandLockup } from '@/components/brand'

const navItems = [
  { href: '#plataforma', label: 'Plataforma' },
  { href: '#solucoes', label: 'Soluções' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#precos', label: 'Preços' },
  { href: '#contato', label: 'Contato' },
]

export function MarketingHeader({ isAuthed }: { isAuthed: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const primaryHref = isAuthed ? '/dashboard/links' : '/signup'
  const secondaryHref = isAuthed ? '/dashboard' : '/login'

  return (
    <header className="marketing-header">
      <div className="container marketing-header-inner">
        <BrandLockup href="/" size="large" />

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="marketing-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="marketing-navigation" className={`marketing-navigation ${isOpen ? 'is-open' : ''}`}>
          <nav className="marketing-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="marketing-header-actions">
            <Link className="button secondary" href={secondaryHref} onClick={() => setIsOpen(false)}>
              {isAuthed ? 'Painel' : 'Entrar'}
            </Link>
            <Link className="button" href={primaryHref} onClick={() => setIsOpen(false)}>
              {isAuthed ? 'Criar link' : 'Começar grátis'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
