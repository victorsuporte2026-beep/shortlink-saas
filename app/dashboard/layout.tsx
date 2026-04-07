import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/actions'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/lib/data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const current = await getCurrentWorkspace(supabase, user.id)
  const workspace = current?.workspace

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link href="/dashboard" className="brand large">
            ShortLink SaaS
          </Link>
          <p className="muted small">{workspace?.name || 'Workspace'}</p>
        </div>

        <DashboardNav />

        <form action={signOut} className="sidebar-footer">
          <button className="button secondary full" type="submit">
            Sair
          </button>
        </form>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header card subtle">
          <div>
            <h1>Painel</h1>
            <p className="muted">Gerencie links, QR Codes e analytics do seu encurtador.</p>
          </div>
          <div className="header-actions">
            <Link className="button" href="/dashboard/links">
              Novo link
            </Link>
          </div>
        </header>

        {children}
      </section>
    </main>
  )
}
