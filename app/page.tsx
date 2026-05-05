import Link from 'next/link'
import { BrandLockup, QRLyticsMark } from '@/components/brand'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="marketing-shell">
      <header className="topbar container">
        <BrandLockup href="/" size="large" />
        <nav className="nav-row">
          {user ? (
            <Link className="button" href="/dashboard">
              Abrir painel
            </Link>
          ) : (
            <>
              <Link className="button secondary" href="/login">
                Entrar
              </Link>
              <Link className="button" href="/signup">
                Solicitar acesso
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero ql-hero container">
        <div className="hero-copy">
          <h1>QR Codes rastreáveis para campanhas que precisam provar resultado.</h1>
          <p>
            O QRLytics centraliza links curtos, QR Codes e métricas em um painel objetivo para acompanhar
            campanhas, ativações, pontos físicos e canais digitais com mais controle.
          </p>
          <div className="hero-actions">
            <Link className="button" href={user ? '/dashboard/links' : '/signup'}>
              {user ? 'Criar novo link' : 'Solicitar acesso'}
            </Link>
            <Link className="button secondary" href={user ? '/dashboard/analytics' : '/login'}>
              {user ? 'Ver analytics' : 'Entrar no painel'}
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Prévia do painel QRLytics">
          <div className="visual-header">
            <QRLyticsMark />
            <div>
              <strong>QRLytics</strong>
              <span>Live campaign view</span>
            </div>
          </div>
          <div className="visual-metric-row">
            <div>
              <span>Scans hoje</span>
              <strong>1.284</strong>
            </div>
            <div>
              <span>Links ativos</span>
              <strong>42</strong>
            </div>
          </div>
          <div className="visual-chart">
            {[44, 62, 38, 78, 56, 88, 72].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="visual-list">
            <span>qr.nextread.site/totem-apas</span>
            <strong>WhatsApp · 307 cliques</strong>
          </div>
        </div>
      </section>

      <section className="container feature-band">
        <article>
          <h2>Links curtos com governança</h2>
          <p>Crie slugs organizados, pause campanhas e preserve o controle do destino final.</p>
        </article>
        <article>
          <h2>QR Code pronto para operação</h2>
          <p>Baixe imagens em PNG com URLs limpas, usando o domínio profissional da marca.</p>
        </article>
        <article>
          <h2>Analytics para decisão</h2>
          <p>Acompanhe cliques, horários, dispositivos e origem para entender o desempenho.</p>
        </article>
      </section>

      <section className="container operations-section">
        <div>
          <h2>Feito para times que operam campanhas no mundo real.</h2>
          <p>
            Totens, impressos, eventos, vitrines e anúncios precisam de uma camada simples de medição.
            O QRLytics conecta cada ponto de divulgação a uma URL rastreável e administrável.
          </p>
        </div>
        <div className="operations-grid">
          <span>Domínio próprio para QR</span>
          <span>Aprovação de acesso</span>
          <span>Histórico de cliques</span>
          <span>Gestão por workspace</span>
        </div>
      </section>
    </main>
  )
}
