import { Avatar, Button, H2, Text, YStack } from '@my/ui'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { useRouter } from 'solito/router'

export const OnboardingScreen = () => {
  const router = useRouter()
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <YStack
      flex={1}
      jc="center"
      ai="center"
      gap="$15"
      paddingBottom={safeAreaInsets.bottom}
      paddingRight={safeAreaInsets.right}
      paddingTop={safeAreaInsets.top}
      paddingLeft={safeAreaInsets.left}
    >
      <YStack jc="center" ai="center">
        <Avatar circular size="$16" padding="$0" margin="$0">
          <Avatar.Image source={{ uri: require('packages/app/assets/greetings.png') }} />
        </Avatar>
        <H2 mt="$5">HELLO MY FRIEND</H2>
        <Text color="#888888" fontWeight="500">
          Welcome to Kimi. Have a good time!
        </Text>
      </YStack>
      <YStack gap="$3">
        <Button
          width="$20"
          height="$6"
          borderRadius="$12"
          backgroundColor="#A191DA"
          onPress={() => {
            router.push('/enter-phone')
          }}
        >
          <Text fontWeight="600" padding="$3" fontSize="$4" color="white">
            Get Started
          </Text>
        </Button>
        {/* <Button height="$6" variant="outlined" borderRadius="$11">
          <Text fontWeight="600" padding="$3" fontSize="$4">
            Continue as Guest
          </Text>
        </Button> */}
      </YStack>
    </YStack>
  )
}
