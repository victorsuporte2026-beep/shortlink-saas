import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EditLinkForm } from '@/components/edit-link-form'
import { LinkTools } from '@/components/link-tools'
import { requireWorkspace } from '@/lib/data'
import { getShortUrl } from '@/lib/links'

export default async function EditLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const { supabase, workspace } = await requireWorkspace()

  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('workspace_id', workspace.id)
    .eq('id', id)
    .maybeSingle()

  if (!link) notFound()

  const shortUrl = getShortUrl(link.slug)

  return (
    <div className="page-stack">
      <div className="row-between">
        <Link href="/dashboard/links" className="button secondary">
          Voltar para links
        </Link>
        <LinkTools shortUrl={shortUrl} title={link.title} />
      </div>

      {query.error ? <div className="alert error">{query.error}</div> : null}
      {query.success ? <div className="alert success">{query.success}</div> : null}

      <section className="card subtle">
        <p className="muted small">Link curto</p>
        <code className="big-code">{shortUrl}</code>
      </section>

      <EditLinkForm link={link} />
    </div>
  )
}
