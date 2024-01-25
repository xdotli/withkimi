/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, View, Text, YStack, XStack, Avatar, ScrollView } from '@my/ui'
import { getEventSource, getFirstNCharsOrLess, getChatType, MODELS } from 'app/utils/chat'
import { IOpenAIMessages, IOpenAIStateWithIndex } from 'app/utils/chatTypes'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { useVoiceRecognition } from 'app/utils/useVoiceRecognition'
import LottieView from 'lottie-react-native'
import { useRef, useState, useEffect } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import Sound from 'react-native-sound'
import uuid from 'react-native-uuid'
import { WebView } from 'react-native-webview'
import { useRouter } from 'solito/router'
import { set } from 'zod'

import { DropdownMenuExample } from './menu'

import { size } from '../../../ui/src/themes/token-size'

export const HomeScreen = () => {
  const safeAreaInsets = useSafeAreaInsets()
  const [isLiked, setIsLiked] = useState(false)

  const chatType = MODELS.gptTurbo

  // openai chatgpt
  const [openAiCompleted, setOpenAiCompleted] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [lastRes, setLastRes] = useState<string>('')
  const [openaiMessages, setOpenaiMessages] = useState<IOpenAIMessages[]>([])
  const [openaiResponse, setOpenaiResponse] = useState<IOpenAIStateWithIndex>({
    messages: [],
    index: uuid.v4().toString(),
  })

  const router = useRouter()
  const [elapsedTime, setElapsedTime] = useState<number | null>(null)

  const { state, startRecognizing, stopRecognizing, destroyRecognizer } = useVoiceRecognition()

  const animation = useRef<LottieView>(null)
  const isFirstRun = useRef(true)

  const toSpeech = async () => {
    // if (openAiCompleted) {

    // }
    console.log(openAiCompleted, 'l50')
    const startTime = Date.now()
    const text = openaiResponse.messages[openaiResponse.messages.length - 1].assistant

    const uri = `https://withkimi-next.vercel.app/api/elevenlabs?text=${text}&voiceId=21m00Tcm4TlvDq8ikWAM`
    const soundObj = new Sound(uri, '', (error) => {
      if (error) {
        console.error('Error loading sound:', error)
        return
      }
      // Play the sound
      soundObj.play((success) => {
        if (success) {
          console.log('successfully finished playing')
          // Release the sound resource when playback is complete
          soundObj.release()
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    })

    const endTime = Date.now()
    const elapsed = endTime - startTime
    setElapsedTime(elapsed)
  }

  const handleSubmit = async () => {
    setInput(state.results[0])
  }

  async function chat() {
    if (!input) return
    generateOpenaiResponse()
  }

  useEffect(() => {
    if (input && input.length > 0) {
      generateOpenaiResponse()
    }
    return () => {
      setInput('')
    }
  }, [input])

  useEffect(() => {
    console.log(openAiCompleted, 'l94')
    if (openAiCompleted) {
      toSpeech()
    }
    return () => {
      setOpenAiCompleted(false)
    }
  }, [openAiCompleted])

  async function generateOpenaiResponse() {
    try {
      // set message state for openai to have context on previous conversations
      let messagesRequest = openaiMessages

      if (openaiResponse.messages.length) {
        messagesRequest = [
          ...messagesRequest,
          {
            role: 'assistant',
            content: getFirstNCharsOrLess(
              openaiResponse.messages[openaiResponse.messages.length - 1].assistant
            ),
          },
        ]
      }
      messagesRequest = [...messagesRequest, { role: 'user', content: input }]
      setOpenaiMessages(messagesRequest)
      console.log('input', input)
      console.log('messageRequest', messagesRequest)

      // set local openai state to dislay user's most recent question
      const openaiArray = [
        ...openaiResponse.messages,
        {
          user: input,
          assistant: '',
        },
      ]
      console.log(openaiArray)
      setOpenaiResponse((c) => ({
        index: c.index,
        messages: JSON.parse(JSON.stringify(openaiArray)),
      }))

      let localResponse = ''
      const eventSourceArgs = {
        body: {
          messages: messagesRequest,
          model: chatType.label,
        },
        type: getChatType(chatType),
      }
      setInput('')
      const eventSource = getEventSource(eventSourceArgs)

      console.log('about to open listener...')
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const listener = (event: any) => {
        if (event.type === 'open') {
          setOpenAiCompleted(false)
          setLastRes('')
          // console.log(openAiCompleted, 'l150')
          console.log('Open SSE connection.')
        } else if (event.type === 'message') {
          if (event.data !== '[DONE]') {
            if (localResponse.length < 850) {
              scrollViewRef.current?.scrollTo({
                animated: true,
              })
            }
            // if (!JSON.parse(event.data).content) return
            localResponse = localResponse + JSON.parse(event.data).content
            openaiArray[openaiArray.length - 1].assistant = localResponse
            setOpenaiResponse((c) => ({
              index: c.index,
              messages: JSON.parse(JSON.stringify(openaiArray)),
            }))
          } else {
            setOpenAiCompleted(true)
            // console.log(openAiCompleted, 'l168')
            setLastRes(localResponse)
            eventSource.close()
          }
        } else if (event.type === 'error') {
          console.error('Connection error:', event.message)

          eventSource.close()
        } else if (event.type === 'exception') {
          console.error('Error:', event.message, event.error)

          eventSource.close()
        }
      }
      eventSource.addEventListener('open', listener)
      eventSource.addEventListener('message', listener)
      eventSource.addEventListener('error', listener)
    } catch (err) {
      console.log('error in generateOpenaiResponse: ', err)
    }
  }

  useEffect(() => {
    if (isFirstRun.current) {
      if (isLiked) {
        animation.current?.play(59, 59)
      } else {
        animation.current?.play(0, 0)
      }
      isFirstRun.current = false
    } else if (isLiked) {
      animation.current?.play(19, 59)
    } else {
      animation.current?.play(0, 19)
    }
  }, [isLiked])

  return (
    <YStack
      style={{
        height: '100%',
        width: '100%',
      }}
      jc="space-between"
    >
      <ImageBackground source={require('packages/app/assets/bg.png')} style={{ ...styles.image }}>
        <XStack jc="space-between" marginTop={safeAreaInsets.top} marginBottom="$-8" zIndex={1000}>
          <DropdownMenuExample />
          <Button>Profile</Button>
        </XStack>

        <YStack width="$20" pos="absolute" bottom="$20" left="$11" zIndex={1000} gap="$2">
          {/* <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
            Your message: {JSON.stringify(state, null, 2)}
          </Text>
          <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
            Your message: {!state.isRecording ? state.results[0] : 'Recording...'}
          </Text>
          <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
            Elapsed Time: {elapsedTime}ms
          </Text> */}
          <ScrollView style={{ height: 120, backgroundColor: 'rgba(252,251,251,0.72)' }}>
            {openaiResponse.messages.length === 0 ? (
              <Text fontSize="$4" padding="$3">
                {input}
              </Text>
            ) : (
              <Text fontSize="$4" padding="$3">
                {openaiResponse.messages[openaiResponse.messages.length - 1].assistant}
              </Text>
            )}
          </ScrollView>
        </YStack>

        <YStack pos="absolute" top="$34" right="$2" zIndex={1000}>
          <Avatar circular size={50} borderColor="white" borderWidth={2}>
            <Avatar.Image
              resizeMode="contain"
              width={48}
              height={48}
              source={{ uri: require('packages/app/assets/avatar.png') }}
            />
          </Avatar>
          <Button
            borderWidth="$0"
            variant="outlined"
            padding="$0"
            my="$5"
            onPress={() => setIsLiked(!isLiked)}
          >
            <LottieView
              ref={animation}
              style={{ width: 75, height: 75, marginLeft: -10 }}
              source={require('packages/app/assets/like-2.json')}
              autoPlay={false}
              loop={false}
            />
          </Button>
        </YStack>
        <WebView
          // position="absolute"
          style={{ backgroundColor: 'transparent' }}
          source={{ uri: 'https://live2d-one.vercel.app/nekomi.html' }}
          // incognito
        />
        <XStack jc="center" marginBottom={safeAreaInsets.bottom}>
          <Button
            width="$20"
            height="$6"
            borderRadius="$12"
            backgroundColor="#A191DA"
            onPressIn={() => {
              startRecognizing()
            }}
            onPressOut={() => {
              stopRecognizing()
              handleSubmit()
              chat()
            }}
          >
            <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
              Hold to Record
            </Text>
          </Button>
        </XStack>
      </ImageBackground>
    </YStack>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
})
