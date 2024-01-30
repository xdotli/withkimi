import { supabaseAdmin } from 'app/utils/supabase/admin'

export async function getChatMessages(chatId: number) {
  const res = await supabaseAdmin
    .from('message')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  if (res.error) {
    throw res.error
  }
  return res.data
}
export async function getChatOwnerId(chatId: number) {
  const res = await supabaseAdmin.from('chat').select('*').eq('id', chatId)
  return res.data?.at(0)?.user_id
}
