import EventSource from 'react-native-sse'

import { DOMAIN } from './getBaseUrl'

export function getEventSource({
  headers,
  body,
  type,
}: {
  headers?: any
  body: any
  type: string
}) {
  const es = new EventSource(`${DOMAIN}/chat/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method: 'POST',
    body: JSON.stringify(body),
  })

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
