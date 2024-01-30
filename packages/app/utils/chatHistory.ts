import { atom, useAtom } from 'jotai'
export const chatHistoryStore = atom([] as ChatItem[])
import Sound from 'react-native-sound'
export type ChatItem = {
  content: string
  isUser: boolean
  length: number
  sound?: Sound
}
