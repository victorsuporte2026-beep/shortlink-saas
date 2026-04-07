'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBaseUrl, isValidDestinationUrl, sanitizeSlug } from '@/lib/links'
import { getCurrentWorkspace } from '@/lib/data'

function toQueryParam(value: string) {
  return encodeURIComponent(value)
}

async function requireUserAndWorkspace() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const current = await getCurrentWorkspace(supabase, user.id)

  if (!current?.workspace) {
    redirect('/login?error=' + toQueryParam('Workspace não encontrado'))
  }

  return { supabase, user, workspace: current.workspace, role: current.role }
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=' + toQueryParam(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const fullName = String(formData.get('full_name') || '').trim()
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getBaseUrl()}/login`,
    },
  })

  if (error) {
    redirect('/signup?error=' + toQueryParam(error.message))
  }

  redirect('/login?message=' + toQueryParam('Conta criada. Se a confirmação por email estiver ativa, confirme seu email antes de entrar.'))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login?message=' + toQueryParam('Sessão encerrada com sucesso.'))
}

export async function createLink(formData: FormData) {
  const { supabase, user, workspace } = await requireUserAndWorkspace()

  const title = String(formData.get('title') || '').trim()
  const slugRaw = String(formData.get('slug') || '').trim()
  const destinationUrl = String(formData.get('destination_url') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const expiresAtRaw = String(formData.get('expires_at') || '').trim()

  if (!title) {
    redirect('/dashboard/links?error=' + toQueryParam('Informe um título para o link.'))
  }

  if (!isValidDestinationUrl(destinationUrl)) {
    redirect('/dashboard/links?error=' + toQueryParam('Informe uma URL válida começando com http:// ou https://'))
  }

  const payload: Record<string, any> = {
    workspace_id: workspace.id,
    created_by: user.id,
    title,
    destination_url: destinationUrl,
    description: description || null,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
  }

  if (slugRaw) {
    payload.slug = sanitizeSlug(slugRaw)
  }

  const { error } = await supabase.from('links').insert(payload)

  if (error) {
    redirect('/dashboard/links?error=' + toQueryParam(error.message))
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/links')
  revalidatePath('/dashboard/analytics')
  redirect('/dashboard/links?success=' + toQueryParam('Link criado com sucesso.'))
}

export async function updateLink(formData: FormData) {
  const { supabase } = await requireUserAndWorkspace()

  const id = String(formData.get('id') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const slugRaw = String(formData.get('slug') || '').trim()
  const destinationUrl = String(formData.get('destination_url') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const expiresAtRaw = String(formData.get('expires_at') || '').trim()
  const isActive = formData.get('is_active') === 'on'

  if (!id || !title) {
    redirect('/dashboard/links?error=' + toQueryParam('Dados do link incompletos.'))
  }

  if (!isValidDestinationUrl(destinationUrl)) {
    redirect('/dashboard/links?error=' + toQueryParam('Informe uma URL válida começando com http:// ou https://'))
  }

  const updates: Record<string, any> = {
    title,
    destination_url: destinationUrl,
    description: description || null,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    is_active: isActive,
  }

  if (slugRaw) {
    updates.slug = sanitizeSlug(slugRaw)
  }

  const { error } = await supabase.from('links').update(updates).eq('id', id)

  if (error) {
    redirect('/dashboard/links/' + id + '?error=' + toQueryParam(error.message))
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/links')
  revalidatePath('/dashboard/analytics')
  redirect('/dashboard/links/' + id + '?success=' + toQueryParam('Link atualizado com sucesso.'))
}

export async function toggleLinkStatus(formData: FormData) {
  const { supabase } = await requireUserAndWorkspace()
  const id = String(formData.get('id') || '').trim()
  const isActive = String(formData.get('next_state') || '') === 'true'

  const { error } = await supabase.from('links').update({ is_active: isActive }).eq('id', id)

  if (error) {
    redirect('/dashboard/links?error=' + toQueryParam(error.message))
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/links')
  revalidatePath('/dashboard/analytics')
  redirect('/dashboard/links?success=' + toQueryParam(`Link ${isActive ? 'ativado' : 'pausado'} com sucesso.`))
}

export async function deleteLink(formData: FormData) {
  const { supabase } = await requireUserAndWorkspace()
  const id = String(formData.get('id') || '').trim()

  const { error } = await supabase.from('links').delete().eq('id', id)

  if (error) {
    redirect('/dashboard/links?error=' + toQueryParam(error.message))
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/links')
  revalidatePath('/dashboard/analytics')
  redirect('/dashboard/links?success=' + toQueryParam('Link removido com sucesso.'))
}

export async function updateWorkspaceSettings(formData: FormData) {
  const { supabase, user, workspace } = await requireUserAndWorkspace()
  const fullName = String(formData.get('full_name') || '').trim()
  const workspaceName = String(formData.get('workspace_name') || '').trim()

  const operations = []

  if (fullName) {
    operations.push(
      supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    )
  }

  if (workspaceName) {
    operations.push(
      supabase.from('workspaces').update({ name: workspaceName }).eq('id', workspace.id)
    )
  }

  const results = await Promise.all(operations)
  const failed = results.find((result: any) => result.error)

  if (failed?.error) {
    redirect('/dashboard/settings?error=' + toQueryParam(failed.error.message))
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  redirect('/dashboard/settings?success=' + toQueryParam('Configurações salvas com sucesso.'))
}
