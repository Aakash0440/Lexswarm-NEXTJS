'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export async function signUpEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/cases` }
  })
  if (error) throw error
}

export async function signInPhone(phone) {
  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) throw error
}

export async function verifyOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone, token, type: 'sms'
  })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getUserCases() {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function saveCase(caseData) {
  const { data, error } = await supabase
    .from('cases')
    .insert([caseData])
    .select()
  if (error) throw error
  return data[0]
}