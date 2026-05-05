import { approveUserAccess, rejectUserAccess } from '@/app/actions'
import { requireMasterUser, getApprovalLabel } from '@/lib/approvals'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDateTime } from '@/lib/links'

function statusClass(status?: string | null) {
  if (status === 'approved') return 'badge success'
  if (status === 'rejected') return 'badge danger-badge'
  return 'badge warning-badge'
}

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  await requireMasterUser()
  const supabase = createAdminClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, approval_status, created_at, approved_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const pending = (profiles || []).filter((profile: any) => profile.approval_status === 'pending')
  const reviewed = (profiles || []).filter((profile: any) => profile.approval_status !== 'pending')

  return (
    <div className="page-stack">
      {params.error ? <div className="alert error">{params.error}</div> : null}
      {params.success ? <div className="alert success">{params.success}</div> : null}

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Aprovações de acesso</h2>
            <p className="muted small">
              Revise novos cadastros antes de liberar o uso do painel QRLytics.
            </p>
          </div>
          <span className="badge warning-badge">{pending.length} pendente(s)</span>
        </div>

        {!pending.length ? (
          <p className="muted">Nenhum cadastro pendente no momento.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((profile: any) => (
                  <tr key={profile.id}>
                    <td>
                      <strong>{profile.full_name || 'Sem nome informado'}</strong>
                      <p className="muted small">{profile.email}</p>
                    </td>
                    <td>
                      <span className={statusClass(profile.approval_status)}>
                        {getApprovalLabel(profile.approval_status)}
                      </span>
                    </td>
                    <td>{formatDateTime(profile.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <form action={approveUserAccess}>
                          <input type="hidden" name="id" value={profile.id} />
                          <button className="button small-btn" type="submit">
                            Aprovar
                          </button>
                        </form>
                        <form action={rejectUserAccess}>
                          <input type="hidden" name="id" value={profile.id} />
                          <button className="button danger small-btn" type="submit">
                            Rejeitar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Histórico recente</h2>
            <p className="muted small">Últimos usuários já revisados pelo administrador.</p>
          </div>
        </div>

        {!reviewed.length ? (
          <p className="muted">Ainda não há usuários revisados.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Aprovado em</th>
                </tr>
              </thead>
              <tbody>
                {reviewed.map((profile: any) => (
                  <tr key={profile.id}>
                    <td>
                      <strong>{profile.full_name || 'Sem nome informado'}</strong>
                      <p className="muted small">{profile.email}</p>
                    </td>
                    <td>
                      <span className={statusClass(profile.approval_status)}>
                        {getApprovalLabel(profile.approval_status)}
                      </span>
                    </td>
                    <td>{formatDateTime(profile.approved_at || profile.created_at)}</td>
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
