// pages/api/audio.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extract text from the request body
      const { text } = req.body

      // Check if text is provided
      if (!text) {
        return res.status(400).json({ error: 'No text provided' })
      }

      // Prepare options for the fetch call to the ElevenLabs API
      const options = {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: 'eleven_multilingual_v2',
          text,
        }),
      }

      // Call the ElevenLabs API
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/',
        options
      )

      // Return the audio blob
      const audioBlob = await response.blob()
      res.setHeader('Content-Type', 'audio/mpeg')
      res.send(audioBlob)
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
