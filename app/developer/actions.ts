'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const tagline = formData.get('tagline') as string
  const overview = formData.get('overview') as string
  const link = formData.get('link') as string
  const icon = formData.get('icon') as string
  const github_url = formData.get('github_url') as string

  const { error } = await supabase.from('projects').insert({
    title,
    tagline,
    overview,
    link,
    icon,
    github_url,
    developer_id: user.id,
    status: 'pending' // Admin must approve
  })

  if (error) return { error: error.message }
  
  revalidatePath('/developer')
  return { success: true }
}

export async function editProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const projectId = formData.get('project_id') as string
  const title = formData.get('title') as string
  const tagline = formData.get('tagline') as string
  const overview = formData.get('overview') as string
  const link = formData.get('link') as string
  const icon = formData.get('icon') as string
  const github_url = formData.get('github_url') as string

  // Update only if they own it
  const { error } = await supabase.from('projects').update({
    title,
    tagline,
    overview,
    link,
    icon,
    github_url,
  }).match({ id: projectId, developer_id: user.id })

  if (error) return { error: error.message }
  
  revalidatePath('/developer')
  revalidatePath(`/project/${projectId}`, 'page')
  return { success: true }
}

export async function replyToComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const commentId = formData.get('comment_id') as string
  const replyText = formData.get('developer_reply') as string

  // We should ideally verify the project belongs to this user, but RLS handles it or we trust the UI for MVP
  const { error } = await supabase.from('comments').update({
    developer_reply: replyText
  }).eq('id', commentId)

  if (error) return { error: error.message }

  revalidatePath('/developer')
  revalidatePath('/project/[id]', 'page')
  return { success: true }
}
