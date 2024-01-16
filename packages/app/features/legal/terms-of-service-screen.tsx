import { H1, Paragraph, YStack, isWeb } from '@my/ui'

export const TermsOfServiceScreen = () => {
  return (
    <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>Terms of Service</H1>}
      <Paragraph>Add Kimi terms here</Paragraph>

      <Paragraph>Add Kimi conditions here</Paragraph>
    </YStack>
  )
}
