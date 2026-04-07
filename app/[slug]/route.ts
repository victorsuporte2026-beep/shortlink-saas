import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { detectDeviceType, hashIp } from '@/lib/links'

export const dynamic = 'force-dynamic'

function htmlResponse(title: string, message: string, status: number) {
  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #0f172a; color: #fff; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .box { max-width: 520px; background: #111827; border: 1px solid rgba(255,255,255,.08); padding: 32px; border-radius: 18px; }
          h1 { margin-top: 0; font-size: 28px; }
          p { color: #cbd5e1; line-height: 1.6; }
          a { color: #93c5fd; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>${title}</h1>
          <p>${message}</p>
          <p><a href="/">Voltar para a página inicial</a></p>
        </div>
      </body>
    </html>`,
    {
      status,
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: link, error } = await supabase
    .from('links')
    .select('id, workspace_id, slug, destination_url, is_active, expires_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !link) {
    return htmlResponse('Link não encontrado', 'Esse link curto não existe ou já foi removido.', 404)
  }

  if (!link.is_active) {
    return htmlResponse('Link pausado', 'Esse link foi pausado e não está disponível no momento.', 410)
  }

  if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
    return htmlResponse('Link expirado', 'Esse link expirou e não pode mais ser acessado.', 410)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    ''

  const referer = request.headers.get('referer')
  const userAgent = request.headers.get('user-agent')
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry')
  const city = request.headers.get('x-vercel-ip-city')

  await supabase.from('click_events').insert({
    link_id: link.id,
    workspace_id: link.workspace_id,
    ip_hash: hashIp(ip),
    country,
    city,
    referer,
    user_agent: userAgent,
    device_type: detectDeviceType(userAgent),
    path: `/${slug}`,
  })

  return NextResponse.redirect(link.destination_url, 307)
}
