import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="auth-wrapper">
      <div className="auth-card card">
        <h1>Página não encontrada</h1>
        <p className="muted">O endereço que você tentou abrir não existe.</p>
        <Link className="button" href="/">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
