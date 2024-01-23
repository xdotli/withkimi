import { Paragraph, YStack, Button, Text } from '@my/ui'
// import { Audio } from 'expo-av'

export const HomeScreen = () => {
  const handleSubmit = async () => {
    const audio = new Audio(
      'http://localhost:3000/api/elevenlabs?text=Hello%20World&voiceId=21m00Tcm4TlvDq8ikWAM'
    )
    await audio.play()
  }

  const fetchAudio = async (text: string): Promise<Blob> => {
    const options = {
      method: 'POST',
      headers: {
        'xi-api-key': '90da05876a9d94415010e6254c1d5a0f',
        'Content-Type': 'application/json',
      },
      body: '{"model_id":"eleven_multilingual_v2","text":"this is a test string"}',
    }
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/',
      options
    )
    return await response.blob()
  }

  const playFetched = async () => {
    const audioBlob = await fetch('/api/blob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Hello World' }),
    })
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target && typeof e.target.result === 'string') {
        console.log(e.target.result)
        const audioData = e.target?.result?.split(',')[1]
        console.log(audioData)
      }
    }
    reader.readAsDataURL(audioBlob)
  }

  return (
    <YStack gap="$4" p="$4">
      <Button
        width="$20"
        height="$6"
        borderRadius="$12"
        backgroundColor="#A191DA"
        onPress={() => {
          // setBorderColor('lightgray')
          // stopRecognizing()
          handleSubmit()
        }}
      >
        <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
          Play
        </Text>
      </Button>
      <Button
        width="$20"
        height="$6"
        borderRadius="$12"
        backgroundColor="#A191DA"
        onPress={() => {
          playFetched()
        }}
      >
        <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
          Play Fetched
        </Text>
      </Button>
    </YStack>
  )
}
