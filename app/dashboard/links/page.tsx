import Link from 'next/link'
import { CreateLinkForm } from '@/components/create-link-form'
import { LinkTools } from '@/components/link-tools'
import { deleteLink, toggleLinkStatus } from '@/app/actions'
import { requireWorkspace } from '@/lib/data'
import { formatDateTime, getShortUrl } from '@/lib/links'

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  const { supabase, workspace } = await requireWorkspace()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  return (
    <div className="page-stack">
      {params.error ? <div className="alert error">{params.error}</div> : null}
      {params.success ? <div className="alert success">{params.success}</div> : null}

      <CreateLinkForm />

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Seus links</h2>
            <p className="muted small">Gerencie, copie, pause e edite cada link curto.</p>
          </div>
        </div>

        {!links?.length ? (
          <p className="muted">Você ainda não criou nenhum link.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Cliques</th>
                  <th>Último clique</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link: any) => (
                  <tr key={link.id}>
                    <td>
                      <strong>{link.title}</strong>
                      <p className="muted small">{link.destination_url}</p>
                    </td>
                    <td>
                      <code>{getShortUrl(link.slug)}</code>
                    </td>
                    <td>
                      <span className={link.is_active ? 'badge success' : 'badge'}>
                        {link.is_active ? 'Ativo' : 'Pausado'}
                      </span>
                    </td>
                    <td>{link.click_count}</td>
                    <td>{formatDateTime(link.last_clicked_at)}</td>
                    <td>
                      <div className="row-actions">
                        <Link className="button secondary small-btn" href={`/dashboard/links/${link.id}`}>
                          Editar
                        </Link>

                        <form action={toggleLinkStatus}>
                          <input type="hidden" name="id" value={link.id} />
                          <input type="hidden" name="next_state" value={(!link.is_active).toString()} />
                          <button className="button secondary small-btn" type="submit">
                            {link.is_active ? 'Pausar' : 'Ativar'}
                          </button>
                        </form>

                        <form action={deleteLink}>
                          <input type="hidden" name="id" value={link.id} />
                          <button className="button danger small-btn" type="submit">
                            Excluir
                          </button>
                        </form>
                      </div>

                      <div className="row-tools">
                        <LinkTools shortUrl={getShortUrl(link.slug)} title={link.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
