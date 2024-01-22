import { Button, View, Text, YStack, XStack, Avatar } from '@my/ui'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import LottieView from 'lottie-react-native'
import { useRef, useState, useEffect } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { useRouter } from 'solito/router'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { DropdownMenuExample } from './menu'

export const HomeScreen = () => {
  const safeAreaInsets = useSafeAreaInsets()
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const animation = useRef<LottieView>(null)
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      if (isLiked) {
        animation.current?.play(88, 88)
      } else {
        animation.current?.play(19, 19)
      }
      isFirstRun.current = false
    } else if (isLiked) {
      animation.current?.play(19, 88)
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
          {/* <Button>For you</Button> */}
          <DropdownMenuExample />
          {/* <SelectScreen /> */}
          {/* '<Demo placement="bottom" Icon={ChevronDown} Name="bottom-popover" />' */}
          {/* <SelectDemo /> */}
          <Button>Profile</Button>
        </XStack>

        <YStack pos="absolute" top={460} left={360} zIndex={1000}>
          <Avatar circular size={50} borderColor="white" borderWidth={2}>
            <Avatar.Image
              resizeMode="contain"
              width={48}
              height={48}
              source={{ uri: require('packages/app/assets/avatar.png') }}
            />
          </Avatar>
          <Button variant="outlined" padding="$0" my="$5" onPress={() => setIsLiked(!isLiked)}>
            <LottieView
              ref={animation}
              style={{ width: 75, height: 75, marginLeft: -15 }}
              source={require('packages/app/assets/like.json')}
              autoPlay={false}
              loop={false}
            />
          </Button>
        </YStack>
        <WebView
          // position="absolute"
          style={{ backgroundColor: 'transparent' }}
          source={{ uri: 'https://live2d-one.vercel.app/catgirl2.html' }}
          // incognito
        />
        <XStack jc="center" marginBottom={safeAreaInsets.bottom}>
          <Button
            width="$20"
            height="$6"
            borderRadius="$12"
            backgroundColor="#A191DA"
            onPress={() => {}}
          >
            <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
              Record
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
