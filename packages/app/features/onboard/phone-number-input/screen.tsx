import {
  StyledButton,
  Container,
  HeaderText,
  SubHeaderText,
  FixedButtonContainer,
  InputContainer,
  CustomInput,
} from '@my/ui/src/components/commonComponents'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Text } from 'react-native'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useRouter } from 'solito/router'
import { styled, Button } from 'tamagui'

import colors from '../colors'
import { Parameters } from '../customTypes'
import { generateParamURL } from '../utils'
import { useSupabase } from 'app/utils/supabase/useSupabase'


const { useParam } = createParam<Parameters>()

const PrefixSelectButton = styled(Button, {
  borderRadius: 0,
  width: 65,
  backgroundColor: '',
  height: 50,
  justifyContent: 'center',
  borderRightColor: colors.borderYellow,
  borderRightWidth: 1,
  padding: 0,
})

// Example usage within a component
const PhoneNumberField = (props) => {
  const [phoneCode, setPhoneCode] = useParam('phoneCode')
  const prefixLinkProps = useLink({ href: '/onboard/country-codes' })

  useEffect(() => {
    if (!phoneCode) {
      setPhoneCode('1')
    }
  })

  return (
    <InputContainer>
      <PrefixSelectButton {...prefixLinkProps}>{'+' + phoneCode}</PrefixSelectButton>
      <CustomInput
        onChangeText={props.onPhoneNumberChange}
        value={props.value}
        placeholder="Phone number"
        keyboardType="phone-pad"
      />
    </InputContainer>
  )
}

export function PhoneInputScreen() {
  const supabase = useSupabase()
  const [phoneCode] = useParam('phoneCode')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const { push } = useRouter()

  const handlePhoneNumberChange = (val: string) => {
    setPhoneNumber(val)
  }

  const onNextPress = async () => {
    if (phoneNumber.trim() === '') {
      setErrMsg('please type your phone number')
      return;
    }
    const completedPhoneNumber = '+' + phoneCode + phoneNumber

    // let { error } = await supabase.auth.signInWithOtp({
    //   phone: completedPhoneNumber
    // })

    // console.log("error:", error)

    // if (error) {
    //   const errorMessage = error?.message.toLowerCase()
    //   setErrMsg(errorMessage)
    // } else {
    push(
      generateParamURL<Parameters>('/onboard/verification', {
        phoneNumber: completedPhoneNumber,
      })
    )
    // }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>
        <HeaderText>Log In</HeaderText>
        <SubHeaderText>Enter your phone number to start</SubHeaderText>
        <PhoneNumberField value={phoneNumber} onPhoneNumberChange={handlePhoneNumberChange} />
        {errMsg && <Text>{errMsg}</Text>}

        <FixedButtonContainer>
          <StyledButton onPress={onNextPress} cat="primary">
            Next
          </StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  )
}
