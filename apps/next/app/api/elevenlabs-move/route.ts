import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest } from 'next/server'

const client = new ElevenLabsClient({
  xiApiKey: process.env.ELEVENLABS_KEY,
})

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const voiceId = searchParams.get('voiceId') as string
  const text = searchParams.get('text') as string

  console.log(text)
  const stream = await client.textToSpeech.convert(voiceId, {
    text,
    voice_settings: {
      similarity_boost: 0.5,
      stability: 0.5,
    },
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_192',
  })

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
  })

  return new Response(
    new ReadableStream({
      start: async (controller) => {
        for await (const chunk of stream) {
          controller.enqueue(chunk)
        }
      },
    }),
    { headers }
  )
}

function elevenlabs() {
  const options = {
    method: 'POST',
    headers: {
      'xi-api-key': '90da05876a9d94415010e6254c1d5a0f',
      'Content-Type': 'application/json',
    },
    body: '{"text":"Let us always meet each other with smile, for the smile is the beginning of love. ","model_id":"eleven_multilingual_v2","voice_settings":{"similarity_boost":1,"stability":1}}',
  }

  fetch('https://api.elevenlabs.io/v1/text-to-speech/gl87S7Mk0fjwqqPOtnfD/stream', options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err))
}
