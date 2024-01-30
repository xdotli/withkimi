import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
export const chatRouter = createTRPCRouter({
  createChat: protectedProcedure
    .input(
      z.object({
        characterId: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { supabase, user } }) => {
      // get character first
      const { data, error } = await supabase
        .from('character')
        .select()
        .eq('id', input.characterId)
        .limit(1)
      if (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: JSON.stringify(error) })
      }
      if (data == null || data.length == 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unknow character' })
      }
      const character = data[0]
      // create chat
      const insertRes = await supabase
        .from('chat')
        .insert({
          user_id: user.id,
          character_id: input.characterId,
        })
        .select()
      const res = insertRes.data![0]
      // insert initial message to the chat
      await supabase.from('message').insert({
        chat_id: res.id,
        content: {
          role: 'system',
          content: character.prompt,
        },
        is_user: false,
      })
      return res.id
    }),
  getChatHistory: protectedProcedure
    .input(
      z.object({
        chatId: z.number(),
      })
    )
    .query(async ({ input, ctx: { supabase, user } }) => {
      const res = await supabase.from('chat').select('*').eq('id', input.chatId)
      if (res.data?.at(0)?.user_id != user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unknow chat' })
      }
      return await supabase.from('message').select('*').eq('chat_id', input.chatId)
    }),
  getChats: protectedProcedure.query(async ({ ctx: { supabase, user } }) => {
    return await supabase.from('chat').select('*').eq('user_id', user.id)
  }),
})
