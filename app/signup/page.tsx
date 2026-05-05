import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signup } from '@/app/actions'
import { BrandLockup } from '@/components/brand'
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
    <main className="auth-wrapper brand-auth">
      <div className="auth-card card">
        <BrandLockup href="/" size="large" />
        <div>
          <h1>Solicitar acesso</h1>
          <p>Seu cadastro será revisado pelo administrador antes da liberação do painel.</p>
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
            Enviar solicitação
          </button>
        </form>

        <p className="muted small">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  )
}
