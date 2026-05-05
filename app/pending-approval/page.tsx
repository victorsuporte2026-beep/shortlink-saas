import Link from 'next/link'
import { BrandLockup } from '@/components/brand'

export default async function PendingApprovalPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; email?: string }>
}) {
  const params = await searchParams
  const isRejected = params.status === 'rejected'

  return (
    <main className="auth-wrapper brand-auth">
      <section className="auth-card card approval-state-card">
        <BrandLockup href="/" size="large" />
        <div>
          <h1>{isRejected ? 'Acesso não aprovado' : 'Cadastro em análise'}</h1>
          <p>
            {isRejected
              ? 'Seu cadastro foi revisado e não está liberado para acessar o painel neste momento.'
              : 'Recebemos seu cadastro. O acesso ao QRLytics precisa ser aprovado pelo administrador antes do primeiro login.'}
          </p>
        </div>

        <div className="approval-note">
          <strong>Administrador responsável</strong>
          <span>victorsuporte2026@gmail.com</span>
        </div>

        <Link className="button full" href="/login">
          Voltar para o login
        </Link>
      </section>
    </main>
  )
}
