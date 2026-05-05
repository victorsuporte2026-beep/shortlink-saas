import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export const MASTER_USER_EMAIL = 'victorsuporte2026@gmail.com'

export function normalizeEmail(email?: string | null) {
  return (email || '').trim().toLowerCase()
}

export function isMasterUserEmail(email?: string | null) {
  return normalizeEmail(email) === MASTER_USER_EMAIL
}

export function getApprovalLabel(status?: string | null) {
  if (status === 'approved') return 'Aprovado'
  if (status === 'rejected') return 'Rejeitado'
  return 'Pendente'
}

export async function getUserApprovalStatus(userId: string, email?: string | null): Promise<ApprovalStatus> {
  if (isMasterUserEmail(email)) return 'approved'

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('approval_status')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    return 'approved'
  }

  return (data?.approval_status as ApprovalStatus) || 'pending'
}

export async function ensureApprovedUser(user: { id: string; email?: string | null }) {
  const status = await getUserApprovalStatus(user.id, user.email)

  if (status !== 'approved') {
    redirect(`/pending-approval?status=${status}`)
  }
}

export async function requireMasterUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!isMasterUserEmail(user.email)) redirect('/dashboard')

  return { supabase, user }
}
