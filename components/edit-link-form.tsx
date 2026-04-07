import { updateLink } from '@/app/actions'

function toDatetimeLocal(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  const tzOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
}

export function EditLinkForm({ link }: { link: any }) {
  return (
    <form className="form card" action={updateLink}>
      <input type="hidden" name="id" value={link.id} />

      <div className="section-head">
        <div>
          <h2>Editar link</h2>
          <p className="muted small">Atualize título, slug, destino e status do link.</p>
        </div>
      </div>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Título</span>
          <input name="title" type="text" defaultValue={link.title} required />
        </label>

        <label className="field">
          <span>Slug</span>
          <input name="slug" type="text" defaultValue={link.slug} required />
        </label>
      </div>

      <label className="field">
        <span>URL de destino</span>
        <input name="destination_url" type="url" defaultValue={link.destination_url} required />
      </label>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Descrição</span>
          <textarea name="description" defaultValue={link.description || ''}></textarea>
        </label>

        <label className="field">
          <span>Expira em</span>
          <input name="expires_at" type="datetime-local" defaultValue={toDatetimeLocal(link.expires_at)} />
        </label>
      </div>

      <label className="checkbox-row">
        <input name="is_active" type="checkbox" defaultChecked={link.is_active} />
        <span>Link ativo</span>
      </label>

      <button className="button" type="submit">
        Salvar alterações
      </button>
    </form>
  )
}
