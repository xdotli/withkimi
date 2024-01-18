import { Button, YStack } from '@my/ui'
import { useRouter } from 'solito/router'

export const EnterPhoneScreen = () => {
  const router = useRouter()
  return (
    <YStack>
      <Button
        onPress={() => {
          router.push('/onboarding')
        }}
      >
        Back
      </Button>
    </YStack>
  )
}
