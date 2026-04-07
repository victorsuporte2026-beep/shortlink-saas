# ShortLink SaaS

Seu próprio encurtador de links estilo Bitly, com login, painel, QR Code por link, analytics básicos e Supabase no backend.

## O que vem pronto

- Cadastro e login com Supabase Auth
- Workspace automático ao criar a conta
- CRUD de links curtos
- Slug customizado ou automático
- Redirecionamento público por `/{slug}`
- QR Code por link com download em PNG
- Analytics básicos com cliques, data, device e localização quando disponível
- SQL completo para criar tabelas, funções, triggers, índices e políticas RLS

## Stack

- Next.js App Router
- React
- Supabase Auth + Postgres
- `@supabase/ssr` para auth SSR
- `qrcode` para gerar QR no cliente

## 1. Criar o projeto Supabase

Crie um projeto no Supabase.

Depois, pegue estes valores:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Crie um arquivo `.env.local` usando `.env.example` como base.

## 2. Rodar o SQL no Supabase

No painel do Supabase:

1. Abra **SQL Editor**
2. Cole o conteúdo de `supabase/migrations/001_init.sql`
3. Execute

Esse SQL cria:

- tipos
- tabelas
- índices
- funções
- triggers
- políticas RLS
- trigger de criação automática de workspace ao cadastrar usuário

## 3. Configurar Auth

No Supabase:

### Authentication > Providers > Email

- Ative Email/Password
- Para testes locais, você pode desativar confirmação de email
- Em produção, é melhor manter confirmação de email ativa

### Authentication > URL Configuration

Adicione:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/login`

Depois, em produção, troque para o seu domínio real.

## 4. Instalar dependências

```bash
npm install
```

## 5. Rodar localmente

```bash
npm run dev
```

Abra:

```bash
http://localhost:3000
```

## 6. Fluxo do sistema

1. Usuário cria conta
2. Trigger do banco cria `profile` + `workspace` + `workspace_members`
3. Usuário entra no painel
4. Cria um link curto
5. O sistema gera um slug customizado ou automático
6. O painel mostra o link curto
7. O usuário baixa o QR Code
8. Quando alguém acessa `/{slug}`:
   - o sistema busca o destino
   - registra o evento em `click_events`
   - trigger incrementa `click_count`
   - redireciona para a URL final

## 7. Variáveis de ambiente

Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8. Deploy

### Frontend

Suba no Vercel.

### Variáveis no Vercel

Configure as mesmas variáveis do `.env.local`.

### No Supabase

Atualize a **Site URL** e as **Redirect URLs** para o domínio final.

Exemplo:

- `https://app.seudominio.com`
- `https://app.seudominio.com/login`

## 9. Como transformar isso em SaaS mesmo

Esse projeto já é o núcleo do produto. Os próximos passos naturais seriam:

- múltiplos workspaces por usuário
- convite de membros
- tags e campanhas
- exportação CSV
- domínio customizado por cliente
- assinatura e cobrança
- API pública
- limites por plano
- QR com identidade visual

## 10. Observações importantes

- O redirecionamento usa a **service role key** apenas no servidor, dentro do Route Handler público. Nunca exponha essa chave no navegador.
- O app usa RLS para as tabelas internas do painel.
- O QR aponta para o link curto, não para o destino final. Isso é o que te dá controle de verdade.

## 11. Estrutura do projeto

```bash
app/
components/
lib/
supabase/migrations/001_init.sql
proxy.ts
```

## 12. Melhorias rápidas que você pode fazer depois

- trocar o root domain por subdomínio tipo `go.seudominio.com`
- adicionar UTM builder
- criar dashboard por campanha
- criar expiração automática e fallback customizado
- bloquear destinos suspeitos
- adicionar rate limit no redirect
