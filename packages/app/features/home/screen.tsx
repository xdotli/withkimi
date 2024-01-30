/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Text, YStack, XStack, Avatar, ScrollView, HoldToRecordButton } from '@my/ui'
import { UserCircle2, Volume2, VolumeX, FileClock } from '@tamagui/lucide-icons'
import { getFirstNCharsOrLess, MODELS } from 'app/utils/chat'
import { IOpenAIMessages, IOpenAIStateWithIndex } from 'app/utils/chatTypes'
import { prompts } from 'app/utils/llm/constants'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { useVoiceRecognition } from 'app/utils/useVoiceRecognition'
import LottieView from 'lottie-react-native'
import { useRef, useState, useEffect } from 'react'
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
// @ts-ignore
import { fetch } from 'react-native-fetch-api'
import Sound from 'react-native-sound'
import uuid from 'react-native-uuid'
import { WebView } from 'react-native-webview'
import { useRouter } from 'solito/router'
import { WritableStream, ReadableStream, TransformStream } from 'web-streams-polyfill/ponyfill'

import { TextLineStream } from './_lineSplitter'
import BgmService from './bgm'
import { BottomSheet } from './bottom-sheet'
import { DropdownMenuExample } from './menu'

type Motions = 'Shake' | 'dance' | 'angry speaking' | 'speaking1' | 'sad' | 'happy1' | 'Idle'

export const HomeScreen = () => {
  const safeAreaInsets = useSafeAreaInsets()

  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

  const [motion, setMotion] = useState<Motions>('Idle')

  // background music
  const [bgmPause, setBgmPause] = useState<boolean>(false)
  const bgmService = BgmService.getInstance()

  // webview ref
  const webViewRef = useRef(null)

  // the state of Nekomi speaking
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)

  const chatType = MODELS.gptTurbo

  // openai chatgpt
  const [openAiCompleted, setOpenAiCompleted] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [openaiMessages, setOpenaiMessages] = useState<IOpenAIMessages[]>([
    { role: 'system', content: prompts.nekomi },
  ])
  const [openaiResponse, setOpenaiResponse] = useState<IOpenAIStateWithIndex>({
    messages: [],
    index: uuid.v4().toString(),
  })

  // const [elapsedTime, setElapsedTime] = useState<number | null>(null)

  const { state, startRecognizing, stopRecognizing, destroyRecognizer } = useVoiceRecognition()

  const animation = useRef<LottieView>(null)
  const isFirstRun = useRef(true)

  const toSpeech = async () => {
    // const startTime = Date.now()
    const text = openaiResponse.messages[openaiResponse.messages.length - 1].assistant

    const uri = `https://withkimi-next.vercel.app/api/elevenlabs?text=${text}&voiceId=OiPxMr8b7mL9wBqR0S9n`
    const soundObj = new Sound(uri, '', (error) => {
      if (error) {
        console.error('Error loading sound:', error)
        return
      }
      // Play the sound
      setIsSoundPlaying(true)
      soundObj.play((success) => {
        if (success) {
          console.log('successfully finished playing')
          // Release the sound resource when playback is complete
          soundObj.release()
        } else {
          console.log('playback failed due to audio decoding errors')
        }
        setIsSoundPlaying(false)
      })
    })
  }

  const handleSubmit = async () => {
    setInput(state.results[0])
  }

  async function chat() {
    if (!input) return
    generateOpenaiResponse()
  }

  async function generateMotion() {
    // call
    try {
      const response = await fetch('http://localhost:3000/api/motion', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            { role: 'system', content: prompts.motion },
            { role: 'user', content: input },
          ],
        }),
      })
      const json = await response.json()
      console.log(json)
      setMotion(json.motion)
    } catch (err) {
      console.log('error in generateMotion: ', err)
    }
  }

  useEffect(() => {
    if (input && input.length > 0) {
      generateOpenaiResponse()
      generateMotion()
    }
    return () => {
      setInput('')
    }
  }, [input])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
      console.log('Gonna send', messagesRequest)
      const response = await fetch('https://withkimi-next.vercel.app/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: messagesRequest,
          model: chatType.label,
        }),
        reactNative: { textStreaming: true },
      })

      setInput('')
      setOpenAiCompleted(false)

      // console.log(response.body)
      const body: ReadableStream<Uint8Array> = ReadableStream.from(response.body)
      // console.log(response)
      const myStringDecoder = new TextDecoder()
      body
        .pipeThrough(
          new TransformStream<Uint8Array, string>({
            transform: (chunk, controller) => {
              controller.enqueue(myStringDecoder.decode(chunk, { stream: true }))
            },
          })
        )
        .pipeThrough(new TextLineStream())
        .pipeTo(
          new WritableStream<string>({
            write: (str: string) => {
              const newStr = str.replace('\0', '')
              console.log('newStr', newStr)
              if (newStr === '{}') {
                // one message done...
                setOpenAiCompleted(true)
                console.log("just setOpenAiCompleted to true, let's see what happens")
                return
              }
              if (localResponse.length < 850) {
                scrollViewRef.current?.scrollTo({
                  animated: true,
                })
              }
              console.log(JSON.parse(str))
              localResponse = localResponse + JSON.parse(str).content
              openaiArray[openaiArray.length - 1].assistant = localResponse
              setOpenaiResponse((c) => ({
                index: c.index,
                messages: JSON.parse(JSON.stringify(openaiArray)),
              }))
            },
          })
        )
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

  // Play bgm music and welcome music automatically once the user enter the main page
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Load the background music
    const loadBgm = async () => {
      try {
        await bgmService.loadBgm()
        // bgmService.playBgm()
      } catch (error) {
        console.error('Error:', error)
      }
    }

    loadBgm()

    const timerId = setTimeout(() => {
      setWebviewStartMotion()
      bgmService.playBgm()
    }, 2000)

    // Clean up when the component unmounts
    return () => {
      clearTimeout(timerId)
      bgmService.pauseBgm()
    }
  }, [])

  function pauseBgm() {
    if (bgmPause) {
      bgmService.playBgm()
    } else {
      bgmService.pauseBgm()
    }
    setBgmPause((prvPause) => {
      return !prvPause
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isSoundPlaying) {
      // Start the motion when the sound begins playing
      if (motion === 'speaking1') {
        setWebviewTalkingMotion()
      } else if (motion === 'Idle') {
        setWebviewIdleMotion()
      } else if (motion === 'Shake')
        (webViewRef.current as WebView | null)?.injectJavaScript('window.onShake()')
      else if (motion === 'dance')
        (webViewRef.current as WebView | null)?.injectJavaScript('window.onDance()')
      else if (motion === 'angry speaking')
        (webViewRef.current as WebView | null)?.injectJavaScript('window.onAngrySpeaking()')
      else if (motion === 'sad')
        (webViewRef.current as WebView | null)?.injectJavaScript('window.onSad()')
      else if (motion === 'happy1')
        (webViewRef.current as WebView | null)?.injectJavaScript('window.onHappy1()')

      // (webViewRef.current as WebView | null)?.injectJavaScript('window.onHappy1()')
    } else {
      // Stop the motion when the sound playback is complete
      setMotion('Idle')
      setWebviewIdleMotion()
    }
  }, [isSoundPlaying])

  // interactions with webview
  const setWebviewTalkingMotion = () =>
    (webViewRef.current as WebView | null)?.injectJavaScript('window.onHappy1()')

  const setWebviewIdleMotion = () =>
    (webViewRef.current as WebView | null)?.injectJavaScript('window.onIdle()')

  const setWebviewStartMotion = () =>
    (webViewRef.current as WebView | null)?.injectJavaScript('window.onStart()')

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
          {/* <Button>Profile</Button> */}
          <TouchableOpacity
            style={{ right: 10 }}
            onPress={() => {
              router.push('/settings/profile-setting')
            }}
          >
            <UserCircle2 size={38} color="white" />
          </TouchableOpacity>
        </XStack>

        <YStack width="$20" pos="absolute" bottom="$20" left="$11" zIndex={1000} gap="$2">
          {/* <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
            Your message: {JSON.stringify(state, null, 2)}
          </Text>
          <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
            Your message: {!state.isRecording ? state.results[0] : 'Recording...'}
          </Text> */}
          {/* <Text fontSize="$4" padding="$3" style={{ backgroundColor: 'rgba(252,251,251,0.72)' }}>
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
          <Avatar
            circular
            size={50}
            borderColor="white"
            borderWidth={2}
            onPress={() => setSheetOpen(true)}
          >
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
          <Button
            borderWidth="$0"
            variant="outlined"
            padding="$0"
            my="$5"
            backgroundColor="transparent"
            icon={
              <FileClock
                color="white"
                size="$4"
                style={{ width: 75, height: 75, marginLeft: -10 }}
              />
            }
            onPress={() => {
              router.push('/history')
            }}
          />
          <Button
            borderWidth="$0"
            variant="outlined"
            padding="$0"
            my="$5"
            backgroundColor="transparent"
            icon={
              bgmPause ? (
                <VolumeX
                  color="white"
                  size="$4"
                  style={{ width: 75, height: 75, marginLeft: -10 }}
                />
              ) : (
                <Volume2
                  color="white"
                  size="$4"
                  style={{ width: 75, height: 75, marginLeft: -10 }}
                />
              )
            }
            onPress={pauseBgm}
          />
        </YStack>
        <WebView
          // position="absolute"
          ref={webViewRef}
          style={{ backgroundColor: 'transparent' }}
          source={{ uri: 'https://live2d-one.vercel.app/nekomi.html' }}
          // incognito
        />
        <XStack jc="center" marginBottom={safeAreaInsets.bottom}>
          <XStack pos="absolute" b={0} w={500} h={150}>
            <HoldToRecordButton
              onPressIn={() => {
                startRecognizing()
              }}
              onPressOut={() => {
                stopRecognizing()
                handleSubmit()
                chat()
              }}
              pressed={
                <LottieView
                  autoPlay
                  style={{
                    width: 135,
                    height: 200,
                  }}
                  source={require('../../assets/sound-wave.json')}
                />
              }
            >
              <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
                Hold to Record
              </Text>
            </HoldToRecordButton>
          </XStack>
        </XStack>
      </ImageBackground>
      <BottomSheet open={sheetOpen} setOpen={setSheetOpen} />
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
