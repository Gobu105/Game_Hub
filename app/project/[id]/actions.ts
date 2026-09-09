'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitFeedback(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit feedback.' }
  }

  const projectId = formData.get('project_id') as string
  const text = formData.get('text') as string
  const type = formData.get('type') as string // 'review' or 'bug'
  const rating = formData.get('rating') ? parseInt(formData.get('rating') as string) : null

  const isBugReport = type === 'bug'
  
  // For now, we will use the user's email prefix as their display name if they don't have a profile name set
  const userName = user.email ? user.email.split('@')[0] : 'Anonymous User'

  const { error } = await supabase
    .from('comments')
    .insert([
      {
        project_id: projectId,
        user_id: user.id,
        user_name: userName,
        text: text,
        rating: isBugReport ? null : rating,
        is_bug_report: isBugReport,
        status: isBugReport ? 'Open' : null
      }
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/project/${projectId}`)
  return { success: true }
}
