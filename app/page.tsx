import Link from 'next/link'
import { BrandLockup, QRLyticsMark } from '@/components/brand'
import { MarketingHeader } from '@/components/marketing-nav'
import { createClient } from '@/lib/supabase/server'

const solutions = [
  {
    icon: 'URL',
    title: 'Encurtador de URL',
    text: 'Encurte links, personalize URLs e acompanhe o desempenho de cada acesso.',
  },
  {
    icon: 'QR',
    title: 'QR Codes Dinâmicos',
    text: 'Crie QR Codes editáveis, profissionais e rastreáveis para campanhas, negócios e eventos.',
  },
  {
    icon: 'LP',
    title: 'Páginas de Destino',
    text: 'Monte landing pages simples e eficazes para converter tráfego vindo de QR Codes e links.',
  },
  {
    icon: 'RT',
    title: 'Analytics em Tempo Real',
    text: 'Veja escaneamentos, cliques, localização, dispositivos e resultados das campanhas.',
  },
  {
    icon: 'ID',
    title: 'Domínio Personalizado',
    text: 'Fortaleça sua marca com links e QR Codes com identidade própria.',
  },
  {
    icon: 'API',
    title: 'API e Integrações',
    text: 'Conecte a QRLytics com seus sistemas e automatize sua operação.',
  },
]

const benefits = [
  'Criação rápida e intuitiva',
  'QR Codes dinâmicos e editáveis',
  'Métricas em tempo real',
  'Plataforma 100% online',
  'Ideal para empresas, agências e eventos',
  'Segurança e confiabilidade',
  'Interface simples e poderosa',
]

const steps = [
  {
    title: 'Crie',
    text: 'Gere QR Codes, links curtos ou páginas personalizadas.',
  },
  {
    title: 'Compartilhe',
    text: 'Use em campanhas, embalagens, cartões, anúncios e materiais físicos.',
  },
  {
    title: 'Analise',
    text: 'Acompanhe escaneamentos, cliques e resultados em tempo real.',
  },
]

const metrics = [
  { label: 'Escaneamentos', value: '48.2k' },
  { label: 'Cliques', value: '31.8k' },
  { label: 'Conversões', value: '7.4k' },
  { label: 'Dispositivos', value: '12' },
  { label: 'Localização', value: '86%' },
  { label: 'Engajamento', value: '24.6%' },
]

const plans = [
  {
    name: 'Starter',
    focus: 'Para pequenos negócios que precisam começar com links e QR Codes rastreáveis.',
    price: 'R$ 0',
    features: ['Links curtos essenciais', 'QR Codes básicos', 'Analytics inicial'],
  },
  {
    name: 'Growth',
    focus: 'Para empresas em crescimento que precisam medir campanhas com mais controle.',
    price: 'R$ 49',
    features: ['QR Codes dinâmicos', 'Domínio personalizado', 'Relatórios por campanha'],
    highlighted: true,
  },
  {
    name: 'Pro Business',
    focus: 'Para agências e operações robustas com alto volume e gestão centralizada.',
    price: 'Sob consulta',
    features: ['Workspaces avançados', 'API e integrações', 'Suporte prioritário'],
  },
]

const valuePoints = ['Fácil de usar', 'Visual profissional', 'Gestão centralizada', 'Inteligência de dados', 'Escalável']

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const appHref = user ? '/dashboard/links' : '/signup'

  return (
    <main className="marketing-shell dark-saas">
      <MarketingHeader isAuthed={Boolean(user)} />

      <section id="plataforma" className="container saas-hero">
        <div className="hero-copy">
          <h1>Tudo que você precisa para criar, gerenciar e analisar QR Codes e links inteligentes.</h1>
          <p>
            A QRLytics conecta sua marca ao público com QR Codes dinâmicos, links curtos rastreáveis,
            páginas de destino e relatórios em tempo real — tudo em uma plataforma unificada.
          </p>
          <div className="hero-actions">
            <Link className="button" href={appHref}>
              Começar gratuitamente
            </Link>
            <Link className="button secondary" href="#contato">
              Solicitar demonstração
            </Link>
          </div>
        </div>

        <div className="platform-preview" aria-label="Prévia visual da plataforma QRLytics">
          <div className="preview-glass preview-main">
            <div className="preview-topline">
              <div className="preview-brand">
                <QRLyticsMark />
                <span>
                  <strong>QRLytics</strong>
                  <small>Dashboard ativo</small>
                </span>
              </div>
              <span className="live-dot">Tempo real</span>
            </div>

            <div className="preview-grid">
              <div className="qr-showcase" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="preview-stats">
                <div>
                  <small>Escaneamentos</small>
                  <strong>18.742</strong>
                </div>
                <div>
                  <small>Cliques</small>
                  <strong>9.381</strong>
                </div>
                <div>
                  <small>Conversões</small>
                  <strong>2.406</strong>
                </div>
                <div>
                  <small>Engajamento</small>
                  <strong>24.6%</strong>
                </div>
              </div>
            </div>

            <div className="growth-card">
              <div>
                <small>Crescimento da campanha</small>
                <strong>+37%</strong>
              </div>
              <div className="growth-line" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solucoes" className="container landing-section">
        <div className="section-heading">
          <h2>Soluções para transformar cada acesso em oportunidade.</h2>
          <p>
            Uma plataforma para encurtar, criar, publicar, rastrear e otimizar campanhas digitais
            com a clareza que empresas precisam.
          </p>
        </div>

        <div className="solution-grid">
          {solutions.map((solution) => (
            <article className="solution-card" key={solution.title}>
              <span className="solution-icon">{solution.icon}</span>
              <h3>{solution.title}</h3>
              <p>{solution.text}</p>
              <Link href={appHref}>Saiba mais</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="recursos" className="container benefit-section">
        <div className="benefit-copy">
          <h2>Mais controle, mais dados, mais resultados</h2>
          <p>
            A QRLytics combina operação simples com uma camada analítica forte para você entender
            quais canais, materiais e campanhas realmente geram resposta.
          </p>
        </div>
        <div className="benefit-list">
          {benefits.map((benefit) => (
            <span key={benefit}>{benefit}</span>
          ))}
        </div>
      </section>

      <section className="container process-section">
        <div className="section-heading compact">
          <h2>Como funciona</h2>
          <p>O fluxo é simples para o time operar e poderoso para a gestão decidir.</p>
        </div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container analytics-section">
        <div className="analytics-dashboard">
          <div className="dashboard-headline">
            <h2>Dados que ajudam você a decidir melhor</h2>
            <p>
              Visualize escaneamentos, cliques, conversões, dispositivos, localização e taxa de
              engajamento com leitura rápida.
            </p>
          </div>
          <div className="metric-wall">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
          <div className="analytics-chart" aria-hidden="true">
            {[42, 68, 54, 78, 48, 86, 70, 92, 76].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="container landing-section pricing-section">
        <div className="section-heading">
          <h2>Planos para cada momento da sua operação</h2>
          <p>Comece simples e evolua para recursos avançados conforme suas campanhas crescem.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card ${plan.highlighted ? 'featured' : ''}`} key={plan.name}>
              {plan.highlighted ? <span className="plan-badge">Mais vendido</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.focus}</p>
              <strong>
                {plan.price}
                {plan.price.startsWith('R$') ? <small>/mês</small> : null}
              </strong>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link className="button" href={appHref}>
                Começar
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container value-section">
        <div>
          <h2>Uma plataforma feita para transformar acessos em inteligência</h2>
          <p>
            Links e QR Codes deixam de ser apenas pontos de entrada e passam a orientar decisões de
            marketing, vendas, atendimento e operação.
          </p>
        </div>
        <div className="value-points">
          {valuePoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section id="contato" className="container final-cta">
        <h2>Pronto para transformar seus QR Codes e links em resultados reais?</h2>
        <p>
          Comece agora com a QRLytics e tenha uma plataforma moderna para criar, rastrear e otimizar
          suas campanhas.
        </p>
        <div className="hero-actions">
          <Link className="button" href={appHref}>
            Começar grátis
          </Link>
          <Link className="button secondary" href="mailto:victorsuporte2026@gmail.com?subject=Demonstra%C3%A7%C3%A3o%20QRLytics">
            Falar com especialista
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <BrandLockup href="/" size="large" />
            <p>SaaS para QR Codes, links curtos, páginas de destino e analytics.</p>
          </div>
          <div>
            <strong>Produto</strong>
            <Link href="#solucoes">Soluções</Link>
            <Link href="#recursos">Recursos</Link>
            <Link href="#precos">Preços</Link>
          </div>
          <div>
            <strong>Empresa</strong>
            <Link href="#plataforma">Plataforma</Link>
            <Link href="#contato">Contato</Link>
            <Link href="/login">Entrar</Link>
          </div>
          <div>
            <strong>Suporte</strong>
            <Link href="mailto:victorsuporte2026@gmail.com">Atendimento</Link>
            <Link href="/signup">Começar grátis</Link>
            <Link href="#contato">Termos e privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
