// @ts-nocheck
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
      if (acc[key] === undefined || acc[key] === null) {
        acc[key] = value
      } else if (typeof acc[key] === 'string' && typeof value === 'string') {
        ;(acc[key] as string) += value
      } else if (typeof acc[key] === 'object' && !Array.isArray(acc[key])) {
        acc[key] = reduce(acc[key], value)
      }
    }
    return acc
  }

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
        // console.log('message:', messages)
        const stream = await openai.chat.completions.create({
          messages,
          //functions: null,
          model: models[model as modelOptions],
          stream: true,
        })
        let message = {} as ChatCompletionMessage
        for await (const part of stream) {
          message = messageReducer(message, part)
          // console.log(part)
          //res.write(JSON.stringify(part));
          //s.push(JSON.stringify(part));
          controller.enqueue(`${JSON.stringify(part.choices[0].delta)}\0`)
          // console.log(part)
        }
        messages.push(message)
        //console.log(message);
        // If there is no function call, we're done and can exit this loop
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
