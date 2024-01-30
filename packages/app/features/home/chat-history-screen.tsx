import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { FlashList } from '@shopify/flash-list'
import { Play } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Sound from 'react-native-sound'
import { useRouter } from 'solito/router'

type ChatItem = {
  chatId: number
  content: string
  isUser: boolean
  length: number
  sound?: Sound
}

const welcomeUri = require('packages/app/assets/welcome-to-the-kimi-world.mp3')
const testSound = new Sound(welcomeUri, (error) => {
  if (error) {
    console.log('Failed to load welcomeSound', error)
  }
})

const historyData: ChatItem[] = [
  {
    chatId: 0,
    content: 'Good moring',
    isUser: true,
    length: 0,
  },
  {
    chatId: 1,
    content: 'Good morning, what are you doing today',
    isUser: false,
    length: 6,
    sound: testSound,
  },
  {
    chatId: 2,
    content: 'Go for a walk in the park',
    isUser: true,
    length: 0,
  },
  {
    chatId: 3,
    content: 'What about you?',
    isUser: true,
    length: 0,
  },
  {
    chatId: 4,
    content: 'I am learning new cooking techniques today',
    isUser: false,
    length: 8,
    sound: testSound,
  },
  {
    chatId: 5,
    content: 'Oh,cool',
    isUser: true,
    length: 0,
  },
  {
    chatId: 6,
    content: "I'll let you know when I've figured it out",
    isUser: false,
    length: 5,
    sound: testSound,
  },
  {
    chatId: 7,
    content: 'Wow, this is great Nekomi!',
    isUser: true,
    length: 0,
  },
  {
    chatId: 8,
    content: "I'm ready to go out now",
    isUser: true,
    length: 0,
  },
]

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
  const router = useRouter()
  const safeAreaInsets = useSafeAreaInsets()

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
      <ImageBackground
        source={require('packages/app/assets/history.png')}
        style={{ ...styles.image }}
      >
        <YStack marginTop={2 * safeAreaInsets.top} flex={1}>
          <FlashList
            data={historyData}
            renderItem={renderItem}
            keyExtractor={(item) => item.chatId.toString()}
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
