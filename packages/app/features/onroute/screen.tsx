import { Button, H3, Paragraph, XStack, YStack } from '@my/ui'
import React from 'react'
import { useLink } from 'solito/link'

export function RouteScreen() {
  const onboardLinkProps = useLink({
    href: '/onboard',
  })

  return (
    <YStack f={1} jc="top" ai="center" p="$4" space>
      <H3 ta="center">Route List</H3>

      <YStack space>
        <Button {...onboardLinkProps} theme={'red'}>
          Onboard
        </Button>
      </YStack>
    </YStack>
  )
}
