'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkIsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'super_admin'
}

export async function updateProjectStatus(formData: FormData) {
  if (!(await checkIsAdmin())) return
  
  const supabase = await createClient()
  const projectId = formData.get('project_id') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('projects').update({ status }).eq('id', projectId)
  if (error) console.error(error.message)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateUserRole(formData: FormData) {
  if (!(await checkIsAdmin())) return

  const supabase = await createClient()
  const targetUserId = formData.get('user_id') as string
  const role = formData.get('role') as string // 'user', 'developer', 'banned'

  const { error } = await supabase.from('profiles').update({ role }).eq('id', targetUserId)
  if (error) console.error(error.message)

  revalidatePath('/admin')
}
