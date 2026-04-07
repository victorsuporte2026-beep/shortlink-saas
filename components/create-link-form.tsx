import { createLink } from '@/app/actions'

export function CreateLinkForm() {
  return (
    <form className="form card" action={createLink}>
      <div className="section-head">
        <div>
          <h2>Criar novo link</h2>
          <p className="muted small">Se deixar o slug em branco, o sistema gera um automaticamente.</p>
        </div>
      </div>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Título</span>
          <input name="title" type="text" placeholder="Ex: Campanha VB" required />
        </label>

        <label className="field">
          <span>Slug customizado</span>
          <input name="slug" type="text" placeholder="Ex: vb" />
        </label>
      </div>

      <label className="field">
        <span>URL de destino</span>
        <input name="destination_url" type="url" placeholder="https://wa.me/..." required />
      </label>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Descrição</span>
          <textarea name="description" placeholder="Uso interno, campanha, observações..."></textarea>
        </label>

        <label className="field">
          <span>Expira em</span>
          <input name="expires_at" type="datetime-local" />
        </label>
      </div>

      <button className="button" type="submit">
        Criar link
      </button>
    </form>
  )
}
