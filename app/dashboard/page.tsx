import Link from 'next/link'
import { StatCard } from '@/components/stat-card'
import { getDashboardMetrics, requireWorkspace } from '@/lib/data'
import { formatDateTime, getShortUrl } from '@/lib/links'

export default async function DashboardHome() {
  const { workspace } = await requireWorkspace()
  const metrics = await getDashboardMetrics(workspace.id)

  return (
    <div className="page-stack">
      <section className="grid cols-3">
        <StatCard label="Total de links" value={metrics.totalLinks} />
        <StatCard label="Links ativos" value={metrics.activeLinks} />
        <StatCard label="Cliques nos últimos 7 dias" value={metrics.clicksSevenDays} />
      </section>

      <section className="grid cols-2">
        <article className="card">
          <div className="section-head">
            <div>
              <h2>Top links</h2>
              <p className="muted small">Os links com mais cliques no workspace.</p>
            </div>
            <Link href="/dashboard/links" className="button secondary">
              Ver todos
            </Link>
          </div>

          {metrics.topLinks.length === 0 ? (
            <p className="muted">Nenhum link cadastrado ainda.</p>
          ) : (
            <div className="stack-list">
              {metrics.topLinks.map((link: any) => (
                <div key={link.id} className="list-item">
                  <div>
                    <strong>{link.title}</strong>
                    <p className="muted small">{getShortUrl(link.slug)}</p>
                  </div>
                  <div className="list-item-right">
                    <span className="badge">{link.click_count} cliques</span>
                    <span className="muted small">Último clique: {formatDateTime(link.last_clicked_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="section-head">
            <div>
              <h2>Cliques recentes</h2>
              <p className="muted small">Últimos acessos registrados.</p>
            </div>
            <Link href="/dashboard/analytics" className="button secondary">
              Abrir analytics
            </Link>
          </div>

          {metrics.recentClicks.length === 0 ? (
            <p className="muted">Nenhum clique registrado ainda.</p>
          ) : (
            <div className="stack-list">
              {metrics.recentClicks.map((event: any) => {
                const link = Array.isArray(event.links) ? event.links[0] : event.links
                return (
                  <div key={event.id} className="list-item">
                    <div>
                      <strong>{link?.title || 'Link removido'}</strong>
                      <p className="muted small">/{link?.slug || 'sem-slug'}</p>
                    </div>
                    <div className="list-item-right">
                      <span className="badge subtle">{event.device_type || 'desconhecido'}</span>
                      <span className="muted small">
                        {formatDateTime(event.clicked_at)}
                        {event.city || event.country ? ` • ${[event.city, event.country].filter(Boolean).join(', ')}` : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
