import { ElevenLabsClient } from 'elevenlabs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'

const client = new ElevenLabsClient({
  xiApiKey: process.env.ELEVENLABS_KEY,
})

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const voiceId = searchParams.get('voiceId') as string
  const text = searchParams.get('text') as string

  console.log(text)
  const stream = await client.textToSpeech.convertAsStream(voiceId, {
    text,
    voice_settings: {
      similarity_boost: 0.5,
      stability: 0.5,
    },
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_192',
  })
  return new Response(
    new ReadableStream({
      start: async (controller) => {
        for await (const chunk of stream) {
          controller.enqueue(chunk)
        }
      },
    })
  )
}
