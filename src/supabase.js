import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 未配置')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// ── 会话操作 ──
export async function getSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createSession(title = '新对话') {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ title })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSession(id, updates) {
  const { error } = await supabase
    .from('sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) throw error
}

// ── 消息操作 ──
export async function getMessages(sessionId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .eq('visible', true)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data
}

export async function saveMessage(sessionId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ session_id: sessionId, role, content })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function hideMessages(ids) {
  const { error } = await supabase
    .from('messages')
    .update({ visible: false })
    .in('id', ids)
  if (error) throw error
}

// ── 设置操作 ──
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw error
  return data
}
