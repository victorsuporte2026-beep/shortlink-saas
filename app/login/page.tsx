import Link from 'next/link'
import { redirect } from 'next/navigation'
import { login } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="auth-wrapper">
      <div className="auth-card card">
        <div>
          <span className="eyebrow">ShortLink SaaS</span>
          <h1>Entrar</h1>
          <p>Use seu email e senha para acessar o painel.</p>
        </div>

        {params.error ? <div className="alert error">{params.error}</div> : null}
        {params.message ? <div className="alert success">{params.message}</div> : null}

        <form className="form" action={login}>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" placeholder="voce@empresa.com" required />
          </label>
          <label className="field">
            <span>Senha</span>
            <input name="password" type="password" placeholder="Sua senha" required />
          </label>
          <button className="button full" type="submit">
            Entrar
          </button>
        </form>

        <p className="muted small">
          Ainda não tem conta? <Link href="/signup">Criar conta</Link>
        </p>
      </div>
    </main>
  )
}
