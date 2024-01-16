import { StyledButton, ContainerCenter } from '@my/ui/src/components/commonComponents'
import mainPic from 'app/assets/onboard-greeting-round.png'
import React from 'react'
// import { Image } from "react-native";
import { useLink } from 'solito/link'
import { Image, YStack, Text, styled } from 'tamagui'

import colors from './colors'

// Define styled components
const ProfileImage = styled(Image, {
  marginTop: -180,
  width: 225,
  height: 225,
  borderRadius: 9999,
})

const TitleText = styled(Text, {
  fontSize: 32,
  fontWeight: '700',
  textAlign: 'center',
  variants: {
    size: {
      '...size': (size: string) => {
        return {
          fontSize: parseInt(size),
        }
      },
    },
  },
})

const SubtitleText = styled(Text, {
  fontSize: 14,
  textAlign: 'center',
  color: colors.gray,
  marginBottom: 40,
})

const BottomButtons = styled(YStack, {
  width: '100%',
  paddingBottom: 20,
  paddingHorizontal: 20,
  position: 'absolute', // Position at the bottom
  bottom: 50,
  justifyContent: 'space-between',
  alignItems: 'center',
})

// Main component
export function OnboardScreen() {
  const getStartLinkProps = useLink({ href: '/onboard/phone-input' })
  return (
    <ContainerCenter>
      <YStack flex={1} alignItems="center" justifyContent="center" padding={20} space="$4">
        <ProfileImage source={mainPic} />
        <TitleText>HELLO FRIEND</TitleText>
        <SubtitleText>Welcome to Kimi. Have a good time.</SubtitleText>
      </YStack>
      <BottomButtons>
        <StyledButton cat="primary" {...getStartLinkProps}>
          Get Started
        </StyledButton>
        <StyledButton color={colors.black} onPress={() => console.log('Continue as Guest')}>
          Continue as Guest
        </StyledButton>
      </BottomButtons>
    </ContainerCenter>
  )
}
