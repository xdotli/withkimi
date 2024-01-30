import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from 'app/utils/supabase/admin'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import {
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions'
import { getChatMessages, getChatOwnerId } from 'utils/chat'
import { UNAUTHORIZED_ERROR, getUser } from 'utils/supabase-server'
import type { modelOptions } from 'utils/types'
export const dynamic = 'force-dynamic'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890'),
})

function messageReducer(
  previous: ChatCompletionMessage,
  item: ChatCompletionChunk
): ChatCompletionMessage {
  const reduce = (inputAcc: ChatCompletionMessage, delta: ChatCompletionChunk) => {
    const acc = { ...inputAcc }
    for (const [key, value] of Object.entries(delta)) {
      // @ts-ignore
      if (acc[key] === undefined || acc[key] === null) {
        // @ts-ignore
        acc[key] = value
        // @ts-ignore
      } else if (typeof acc[key] === 'string' && typeof value === 'string') {
        // @ts-ignore
        ;(acc[key] as string) += value
        // @ts-ignore
      } else if (typeof acc[key] === 'object' && !Array.isArray(acc[key])) {
        // @ts-ignore
        acc[key] = reduce(acc[key], value)
      }
    }
    return acc
  }
  // @ts-ignore
  return reduce(previous, item.choices[0].delta) as ChatCompletionMessage
}

export async function POST(req: NextRequest) {
  const user = await getUser(cookies(), req.headers)
  if (!user) {
    return UNAUTHORIZED_ERROR
  }
  const models = {
    gptTurbo: 'gpt-4-1106-preview',
    gpt: 'gpt-4',
  }
  let {
    content,
    chatId,
    isFirst,
    characterId,
  }: {
    content: string
    chatId?: number
    isFirst: boolean
    characterId?: number
  } = await req.json()
  // const { content: string, chatId: number } = await req.json()
  if (isFirst) {
    // create the chatId
    const { data, error } = await supabaseAdmin
      .from('character')
      .select()
      .eq('id', characterId!)
      .limit(1)
    if (error) {
      return new Response('FAILED TO CERATE CHAT', {
        status: 500,
      })
    }
    if (data == null || data.length == 0) {
      return new Response('FAILED TO CERATE CHAT', {
        status: 400,
      })
    }
    const character = data[0]
    // create chat
    const insertRes = await supabaseAdmin
      .from('chat')
      .insert({
        user_id: user.id,
        character_id: characterId!,
      })
      .select()
    const res = insertRes.data![0]
    // insert initial message to the chat
    await supabaseAdmin.from('message').insert({
      chat_id: res.id,
      content: {
        role: 'system',
        content: character.prompt,
      },
      is_user: false,
    })
    chatId = res.id
  }
  const chatOwnerId = await getChatOwnerId(chatId!)

  if (chatOwnerId != user.id) {
    console.log(chatId, chatOwnerId, user.id)
    // The chat doesn't belong to the user
    return NextResponse.json(
      {
        message: 'BAD REQUEST',
      },
      {
        status: 400,
      }
    )
  }
  // get chat history
  const messages = (await getChatMessages(chatId!)).map(
    (v) => JSON.parse(JSON.stringify(v.content!)) as ChatCompletionMessageParam
  )

  const newMessage = {
    role: 'user',
    content,
  } as ChatCompletionMessageParam
  messages.push(newMessage)
  await supabaseAdmin.from('message').insert({
    chat_id: chatId,
    content: {
      role: 'user',
      content,
    },
    is_user: true,
  })
  const stream = new ReadableStream({
    start: async (controller) => {
      while (true) {
        console.log('message:', messages)
        const stream = await openai.chat.completions.create({
          messages,
          //functions: null,
          model: models['gptTurbo'],
          stream: true,
          max_tokens: 40,
        })
        let message = {} as ChatCompletionMessage
        for await (const part of stream) {
          message = messageReducer(message, part)
          controller.enqueue(`${JSON.stringify(part.choices[0].delta)}\0`)
        }
        console.log('get response:', message)
        messages.push(message)
        await supabaseAdmin.from('message').insert({
          chat_id: chatId,
          content: JSON.parse(JSON.stringify(message)),
          is_user: false,
        })
        if (!message.function_call) {
          break
        }
        const functionValueMessage = {
          role: 'function' as const,
          name: message.function_call.name,
          content: JSON.stringify({}),
        }
        messages.push(functionValueMessage)
        await supabaseAdmin.from('message').insert({
          chat_id: chatId,
          content: functionValueMessage,
          is_user: false,
        })
        controller.enqueue('part finished\0')
      }
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      chat_id: chatId!.toString(),
    },
  })
}
