'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// Existing Email/Password Functions
// Helper to convert usernames to a dummy email for Supabase Auth
function getEmailFromIdentifier(identifier: string) {
  if (identifier.includes('@')) return identifier;
  return `${identifier}@gamehub.local`;
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const identifier = formData.get('identifier') as string
  const email = getEmailFromIdentifier(identifier)

  const data = {
    email,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) redirect(`/login?error=${error.message}`)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const identifier = formData.get('identifier') as string
  const username = formData.get('username') as string
  const email = getEmailFromIdentifier(identifier)

  const data = {
    email,
    password: formData.get('password') as string,
    options: {
      data: {
        role: formData.get('role') as string || 'user',
        username: username,
      }
    }
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) redirect(`/login?error=${error.message}`)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// Removed OAuth functions as per user request
