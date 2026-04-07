import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="site-shell">
      <header className="topbar container">
        <div className="brand">ShortLink SaaS</div>
        <nav className="nav-row">
          {user ? (
            <Link className="button" href="/dashboard">
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link className="button secondary" href="/login">
                Entrar
              </Link>
              <Link className="button" href="/signup">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero container card">
        <div className="hero-copy">
          <span className="eyebrow">MVP pronto para sair do papel</span>
          <h1>Seu próprio Bitly com QR Code, links curtos e analytics.</h1>
          <p>
            Crie links curtos, gere QR Codes, acompanhe cliques e controle tudo no seu próprio painel usando
            Next.js + Supabase.
          </p>
          <div className="hero-actions">
            <Link className="button" href={user ? '/dashboard/links' : '/signup'}>
              {user ? 'Criar meu primeiro link' : 'Começar agora'}
            </Link>
            <a className="button secondary" href="#como-funciona">
              Ver como funciona
            </a>
          </div>
        </div>
        <div className="hero-panel card subtle">
          <div className="mini-card">
            <span className="mini-label">Link curto</span>
            <strong>seudominio.com/vb</strong>
          </div>
          <div className="mini-card">
            <span className="mini-label">Destino</span>
            <strong>WhatsApp, landing page ou formulário</strong>
          </div>
          <div className="mini-card">
            <span className="mini-label">Rastreamento</span>
            <strong>Cliques, país, cidade, dispositivo e horário</strong>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="container grid cols-3">
        <article className="card">
          <h2>1. Crie o link</h2>
          <p>Você cadastra título, slug e URL de destino no painel.</p>
        </article>
        <article className="card">
          <h2>2. Gere o QR</h2>
          <p>Baixe o QR do link curto e use em peças, telas, cards e impressos.</p>
        </article>
        <article className="card">
          <h2>3. Acompanhe os acessos</h2>
          <p>O sistema registra clique, data, device, referer e localização quando disponível.</p>
        </article>
      </section>

      <section className="container card">
        <h2>O que este projeto já entrega</h2>
        <div className="grid cols-2 compact">
          <ul className="clean-list">
            <li>Cadastro e login com Supabase Auth</li>
            <li>Workspace automático por usuário</li>
            <li>CRUD de links curtos</li>
            <li>QR Code por link com download em PNG</li>
          </ul>
          <ul className="clean-list">
            <li>Redirecionamento público por slug</li>
            <li>Analytics básicos por link e por workspace</li>
            <li>RLS nas tabelas principais</li>
            <li>SQL único para criar tudo no Supabase</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
