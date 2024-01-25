import { SetStateAction, Dispatch } from 'react'
import EventSource from 'react-native-sse'

export const runtime = 'nodejs'
// This is required to enable streaming
export const dynamic = 'force-dynamic'

export const DOMAIN =
  process.env.EXPO_PUBLIC_ENV === 'DEVELOPMENT'
    ? process.env.EXPO_PUBLIC_URL
    : process.env.EXPO_PUBLIC_URL

export const MODELS = {
  gpt: { name: 'GPT 4', label: 'gpt' },
  gptTurbo: { name: 'GPT Turbo', label: 'gptTurbo' },
  claude: { name: 'Claude', label: 'claude' },
  claudeInstant: { name: 'Claude Instant', label: 'claudeInstant' },
  cohere: { name: 'Cohere', label: 'cohere' },
  cohereWeb: { name: 'Cohere Web', label: 'cohereWeb' },
  mistral: { name: 'Mistral', label: 'mistral' },
  gemini: { name: 'Gemini', label: 'gemini' },
}

export interface IIconProps {
  type: string
  props: any
}

export interface IOpenAIMessages {
  role: string
  content: string
}

export interface IOpenAIUserHistory {
  user: string
  assistant: string
  fileIds?: any[]
}

export interface IOpenAIStateWithIndex {
  index: string
  messages: IOpenAIUserHistory[]
}

export interface IThemeContext {
  theme: any
  setTheme: Dispatch<SetStateAction<string>>
  themeName: string
}

export interface Model {
  name: string
  label: string
}

export interface IAppContext {
  chatType: Model
  setChatType: Dispatch<SetStateAction<Model>>
  handlePresentModalPress: () => void
  setImageModel: Dispatch<SetStateAction<string>>
  imageModel: string
  closeModal: () => void
  illusionImage: string
  setIllusionImage: Dispatch<SetStateAction<string>>
}

export function getEventSource({
  headers,
  body,
  type,
}: {
  headers?: any
  body: any
  type: string
}) {
  const es = new EventSource('http://localhost:3000/api/chat/', {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
  console.log(es)
  return es
}

export function getFirstNCharsOrLess(text: string, numChars = 1000) {
  if (text.length <= numChars) {
    return text
  }
  return text.substring(0, numChars)
}

export function getFirstN({ messages, size = 10 }: { size?: number; messages: any[] }) {
  if (messages.length > size) {
    const firstN = new Array()
    for (let i = 0; i < size; i++) {
      firstN.push(messages[i])
    }
    return firstN
  }
  return messages
}

export function getChatType(type: Model) {
  if (type.label.includes('gpt')) {
    return 'gpt'
  }
  if (type.label.includes('cohere')) {
    return 'cohere'
  }
  if (type.label.includes('mistral')) {
    return 'mistral'
  }
  if (type.label.includes('gemini')) {
    return 'gemini'
  }
  return 'claude'
}
