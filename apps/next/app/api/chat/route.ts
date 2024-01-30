import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'
import { ChatCompletionChunk, ChatCompletionMessage } from 'openai/resources/chat/completions'
import type { modelOptions } from 'utils/types'

export const dynamic = 'force-dynamic'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  const models = {
    gptTurbo: 'gpt-4-1106-preview',
    gpt: 'gpt-4',
  }
  const stream = new ReadableStream({
    start: async (controller) => {
      const { model, messages } = await req.json()

      while (true) {
        const stream = await openai.chat.completions.create({
          messages,
          model: models[model as modelOptions],
          stream: true,
          max_tokens: 40,
        })
        let message = {} as ChatCompletionMessage
        for await (const part of stream) {
          message = messageReducer(message, part)
          controller.enqueue(`${JSON.stringify(part.choices[0].delta)}\0`)
        }
        messages.push(message)
        if (!message.function_call) {
          break
        }
        messages.push({
          role: 'function' as const,
          name: message.function_call.name,
          content: JSON.stringify({}),
        })
        controller.enqueue('part finished\0')
      }
      controller.close()
    },
  })
  return new Response(stream)
}
