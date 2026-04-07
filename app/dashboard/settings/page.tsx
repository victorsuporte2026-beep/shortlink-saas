import { updateWorkspaceSettings } from '@/app/actions'
import { requireWorkspace } from '@/lib/data'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  const { supabase, user, workspace } = await requireWorkspace()

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  return (
    <div className="page-stack">
      {params.error ? <div className="alert error">{params.error}</div> : null}
      {params.success ? <div className="alert success">{params.success}</div> : null}

      <form className="form card" action={updateWorkspaceSettings}>
        <div className="section-head">
          <div>
            <h2>Configurações</h2>
            <p className="muted small">Ajuste seu nome e o nome do workspace.</p>
          </div>
        </div>

        <div className="grid cols-2 compact">
          <label className="field">
            <span>Seu nome</span>
            <input name="full_name" type="text" defaultValue={profile?.full_name || ''} required />
          </label>

          <label className="field">
            <span>Nome do workspace</span>
            <input name="workspace_name" type="text" defaultValue={workspace.name} required />
          </label>
        </div>

        <div className="grid cols-2 compact">
          <label className="field">
            <span>Email</span>
            <input type="email" value={profile?.email || user.email || ''} disabled />
          </label>

          <label className="field">
            <span>Slug do workspace</span>
            <input type="text" value={workspace.slug} disabled />
          </label>
        </div>

        <button className="button" type="submit">
          Salvar configurações
        </button>
      </form>
    </div>
  )
}
