import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signup } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
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
          <h1>Criar conta</h1>
          <p>Ao cadastrar, o sistema cria seu perfil e um workspace inicial automaticamente.</p>
        </div>

        {params.error ? <div className="alert error">{params.error}</div> : null}

        <form className="form" action={signup}>
          <label className="field">
            <span>Nome</span>
            <input name="full_name" type="text" placeholder="Seu nome" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" placeholder="voce@empresa.com" required />
          </label>
          <label className="field">
            <span>Senha</span>
            <input name="password" type="password" placeholder="Crie uma senha forte" minLength={6} required />
          </label>
          <button className="button full" type="submit">
            Criar conta
          </button>
        </form>

        <p className="muted small">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  )
}
