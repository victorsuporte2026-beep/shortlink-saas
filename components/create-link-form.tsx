import { createLink } from '@/app/actions'

export function CreateLinkForm() {
  return (
    <form className="form card" action={createLink}>
      <div className="section-head">
        <div>
          <h2>Criar novo link</h2>
          <p className="muted small">
            Crie um link rastreável para cada tela, campanha ou ponto de divulgação.
          </p>
        </div>
      </div>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Nome do link</span>
          <input
            name="title"
            type="text"
            placeholder="Ex: Tela Recepção"
            required
          />
        </label>

        <label className="field">
          <span>Slug (link curto)</span>
          <input
            name="slug"
            type="text"
            placeholder="Ex: tela-recepcao"
          />
        </label>
      </div>

      <label className="field">
        <span>Link de destino</span>
        <input
          name="destination_url"
          type="url"
          placeholder="Ex: https://wa.me/"
          required
        />
      </label>

      <div className="grid cols-2 compact">
        <label className="field">
          <span>Descrição (opcional)</span>
          <textarea
            name="description"
            placeholder="Ex: QR da recepção - campanha de abril"
          ></textarea>
        </label>

        <label className="field">
          <span>Data de expiração (opcional)</span>
          <input name="expires_at" type="datetime-local" />
        </label>
      </div>

      <button className="button" type="submit">
        Criar link
      </button>
    </form>
  )
}
