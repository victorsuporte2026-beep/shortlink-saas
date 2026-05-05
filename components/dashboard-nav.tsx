'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Resumo' },
  { href: '/dashboard/links', label: 'Links' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Configurações' },
]

export function DashboardNav({ isMaster = false }: { isMaster?: boolean }) {
  const pathname = usePathname()
  const navItems = isMaster
    ? [...items.slice(0, 3), { href: '/dashboard/approvals', label: 'Aprovações' }, items[3]]
    : items

  return (
    <nav className="sidebar-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href} className={isActive ? 'nav-link active' : 'nav-link'}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
