import { requireWorkspace } from '@/lib/data'
import { formatDateTime } from '@/lib/links'

function getDailySeries(events: any[]) {
  const labels = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: 0,
    }
  })

  for (const event of events) {
    const key = new Date(event.clicked_at).toISOString().slice(0, 10)
    const item = labels.find((entry) => entry.key === key)
    if (item) item.value += 1
  }

  return labels
}

export default async function AnalyticsPage() {
  const { supabase, workspace } = await requireWorkspace()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: recentEvents }, { data: links }] = await Promise.all([
    supabase
      .from('click_events')
      .select('id, clicked_at, country, city, referer, device_type, links!inner(title, slug)')
      .eq('workspace_id', workspace.id)
      .gte('clicked_at', thirtyDaysAgo)
      .order('clicked_at', { ascending: false })
      .limit(100),
    supabase
      .from('links')
      .select('id, title, slug, click_count, last_clicked_at')
      .eq('workspace_id', workspace.id)
      .order('click_count', { ascending: false })
      .limit(10),
  ])

  const weekEvents = (recentEvents || []).filter((event: any) => event.clicked_at >= sevenDaysAgo)
  const dailySeries = getDailySeries(weekEvents)
  const maxValue = Math.max(...dailySeries.map((item) => item.value), 1)

  return (
    <div className="page-stack">
      <section className="card">
        <div className="section-head">
          <div>
            <h2>Cliques nos últimos 7 dias</h2>
            <p className="muted small">Visão rápida do volume de acessos por dia.</p>
          </div>
        </div>

        <div className="chart-row">
          {dailySeries.map((item) => (
            <div key={item.key} className="chart-item">
              <div className="chart-bar-wrap">
                <div className="chart-bar" style={{ height: `${(item.value / maxValue) * 100}%` }} />
              </div>
              <strong>{item.value}</strong>
              <span className="muted small">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid cols-2">
        <article className="card">
          <h2>Links mais clicados</h2>
          {!links?.length ? (
            <p className="muted">Ainda não existem dados suficientes.</p>
          ) : (
            <div className="stack-list">
              {links.map((link: any) => (
                <div key={link.id} className="list-item">
                  <div>
                    <strong>{link.title}</strong>
                    <p className="muted small">/{link.slug}</p>
                  </div>
                  <div className="list-item-right">
                    <span className="badge">{link.click_count} cliques</span>
                    <span className="muted small">{formatDateTime(link.last_clicked_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <h2>Eventos recentes</h2>
          {!recentEvents?.length ? (
            <p className="muted">Ainda não existem eventos registrados.</p>
          ) : (
            <div className="stack-list">
              {recentEvents.map((event: any) => {
                const link = Array.isArray(event.links) ? event.links[0] : event.links
                return (
                  <div key={event.id} className="list-item">
                    <div>
                      <strong>{link?.title || 'Link removido'}</strong>
                      <p className="muted small">
                        {event.city || event.country ? [event.city, event.country].filter(Boolean).join(', ') : 'Localização indisponível'}
                      </p>
                    </div>
                    <div className="list-item-right">
                      <span className="badge subtle">{event.device_type || 'desconhecido'}</span>
                      <span className="muted small">{formatDateTime(event.clicked_at)}</span>
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
