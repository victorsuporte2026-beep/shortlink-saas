import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getAuthedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return { supabase, user }
}

export async function getCurrentWorkspace(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('role, workspaces!inner(id, name, slug, owner_user_id, created_at, updated_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  const workspace = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces

  return {
    role: data.role,
    workspace,
  }
}

export async function requireWorkspace() {
  const { supabase, user } = await getAuthedUser()
  const current = await getCurrentWorkspace(supabase, user.id)

  if (!current?.workspace) {
    throw new Error('Nenhum workspace encontrado para este usuário.')
  }

  return {
    supabase,
    user,
    workspace: current.workspace,
    role: current.role,
  }
}

export async function getDashboardMetrics(workspaceId: string) {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    totalLinksResult,
    activeLinksResult,
    clicksSevenDaysResult,
    topLinksResult,
    recentClicksResult,
  ] = await Promise.all([
    supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('is_active', true),
    supabase
      .from('click_events')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .gte('clicked_at', sevenDaysAgo),
    supabase
      .from('links')
      .select('id, title, slug, click_count, last_clicked_at')
      .eq('workspace_id', workspaceId)
      .order('click_count', { ascending: false })
      .limit(5),
    supabase
      .from('click_events')
      .select('id, clicked_at, country, city, device_type, referer, links!inner(title, slug)')
      .eq('workspace_id', workspaceId)
      .order('clicked_at', { ascending: false })
      .limit(10),
  ])

  return {
    totalLinks: totalLinksResult.count || 0,
    activeLinks: activeLinksResult.count || 0,
    clicksSevenDays: clicksSevenDaysResult.count || 0,
    topLinks: topLinksResult.data || [],
    recentClicks: recentClicksResult.data || [],
  }
}
