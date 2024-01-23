import { ElevenLabsClient } from 'elevenlabs'
import type { NextApiRequest, NextApiResponse } from 'next'
const client = new ElevenLabsClient({
  xiApiKey: process.env.ELEVENLABS_KEY,
})
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const voiceId = req.query.voiceId as string
  const text = req.query.text as string
  const stream = await client.textToSpeech.convertAsStream(voiceId, {
    text,
    voice_settings: {
      similarity_boost: 0.5,
      stability: 0.5,
    },
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_32',
  })
  for await (const chunk of stream) {
    res.write(chunk)
  }
  res.end()
}
export default handler
