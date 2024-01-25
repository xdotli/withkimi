// pages/api/audio.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Extract text from the request body
    const { text } = await req.json()

    // Check if text is provided
    if (!text) {
      return Response.json({ error: 'No text provided' }, { status: 400 })
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
    return new NextResponse(audioBlob, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    // Handle any errors
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
