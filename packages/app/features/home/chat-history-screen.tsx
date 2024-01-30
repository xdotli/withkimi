import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { useRouter } from 'solito/router'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { FlashList } from '@shopify/flash-list'
import { Play } from '@tamagui/lucide-icons'
import Sound from 'react-native-sound'
import { useAtom } from 'jotai'
import { ChatItem, chatHistoryStore } from 'app/utils/chatHistory'

function playSound(sound: Sound) {
  sound.play((success) => {
    if (success) {
      console.log('Successfully finished playing welcomeSound')
    } else {
      console.log('Failed to play welcomeSound')
    }
  })
  return () => {
    sound.release()
  }
}

export const ChatHistoryScreen = () => {
  const [messages, setMessages] = useAtom(chatHistoryStore)
  const safeAreaInsets = useSafeAreaInsets()
  console.log('messages', messages)
  const renderItem = ({ item }: { item: ChatItem }) => (
    <YStack
      alignContent="flex-end"
      // jc={item.isUser ? 'flex-end' : 'flex-start'}
      style={styles.messageContainer}
    >
      {!item.isUser && (
        <View style={styles.arrowBubbleContainer}>
          <View style={[styles.arrow]} />
          <View style={[styles.tinyBubble]}>
            <XStack gap="$1">
              <Play
                size={14}
                color="black"
                fill="black"
                onPress={() => {
                  if (item.sound) playSound(item.sound)
                }}
              />
              <Text style={styles.tinyBubbleText}>{item.length}''</Text>
            </XStack>
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.isUser ? 'rgba(61, 61, 61, 0.77)' : 'rgba(252, 251, 251, 0.92)',
            alignSelf: item.isUser ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <Text style={{ color: item.isUser ? 'white' : '#131313' }}>{item.content}</Text>
      </View>
    </YStack>
  )

  return (
    <YStack
      style={{
        height: '100%',
        width: '100%',
      }}
      jc="space-between"
    >
      <ImageBackground source={require('app/assets/history.png')} style={{ ...styles.image }}>
        <YStack marginTop={2 * safeAreaInsets.top} flex={1}>
          <FlashList
            data={messages}
            renderItem={renderItem}
            // keyExtractor={(item) => item.chatId.toString()}
            estimatedItemSize={200}
          />
        </YStack>
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
  messageContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  messageBubble: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: '50%',
    width: 'auto',
  },
  arrowBubbleContainer: {
    position: 'absolute',
    top: -20,
    left: 10,
    flexDirection: 'row', // Make sure the tiny bubble is horizontally aligned with the arrow
    zIndex: 1,
  },
  arrow: {
    position: 'absolute',
    top: 22,
    left: 0,
    borderLeftWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderTopColor: '#A191DA',
    transform: [{ rotate: '-50deg' }],
    zIndex: 1,
  },
  tinyBubble: {
    backgroundColor: '#A191DA',
    borderRadius: 30,
    width: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tinyBubbleText: {
    color: 'black',
  },
})
