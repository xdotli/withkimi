import { YStack, Button, Text } from '@my/ui'
import LottieView, { AnimationObject } from 'lottie-react-native'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useRouter } from 'solito/router'

export const TestScreen = () => {
  const router = useRouter()
  return (
    <>
      <Button onPress={() => router.push('/onboarding')}>Go back</Button>
      <Tutorial />
    </>
  )
}

export const Tutorial = () => {
  return (
    <TutorialBase
      tutorials={[
        <SwipeVertical />,
        //  <SwipeHorizontal />,
      ]}
    />
  )
}

export const TutorialBase = ({ tutorials }: { tutorials: React.ReactNode[] }) => {
  const [displayId, SetDisplayId] = useState(0)
  return (
    <YStack
      pos="absolute"
      backgroundColor="rgba(0, 0, 0, 0.6)"
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={9999}
      display={displayId < tutorials.length ? 'block' : 'none'}
      onPress={() => {
        SetDisplayId(displayId + 1)
      }}
    >
      {tutorials.map((item, i) => {
        return (
          <YStack display={i === displayId ? 'block' : 'none'} key={i}>
            {item}
          </YStack>
        )
      })}
    </YStack>
  )
}

const TutorialAnimationBase = ({
  source,
  tutorialText,
}: {
  source:
    | string
    | AnimationObject
    | {
        uri: string
      }
    | undefined
  tutorialText: string
}) => {
  return (
    <YStack width="100%" height="100%" ai="center" jc="center">
      <LottieView style={{ width: '70%', height: '70%' }} source={source} autoPlay loop />
      <YStack padding={20} br={20} backgroundColor="rgba(240, 240, 240, .7)">
        <Text ta="center" fontSize="$4">
          {tutorialText}
        </Text>
      </YStack>
    </YStack>
  )
}

const SwipeVertical = () => {
  return (
    <TutorialAnimationBase
      source={require('packages/app/assets/swipe-vertical.json')}
      tutorialText="Swipe Up and Down to see more"
    />
  )
}

// const SwipeHorizontal = () => {
//   return (
//     <TutorialAnimationBase
//       source={require('packages/app/assets/swipe-horizontal.json')}
//       tutorialText="Swipe Left and Right to see different sections"
//     />
//   )
// }
const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
})
