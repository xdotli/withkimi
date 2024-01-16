import { H1, Paragraph, YStack, isWeb } from '@my/ui'

export const PrivacyPolicyScreen = () => {
  return (
    <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>Privacy Policy</H1>}
      <Paragraph>Add Kimi privacy policy here</Paragraph>
    </YStack>
  )
}
