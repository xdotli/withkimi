import { FormWrapper, H4, YStack, styled, XStack, Spinner } from '@my/ui'
// import DatePicker from '@react-native-community/datetimepicker'
import { useUser } from 'app/utils/useUser'
import React, { useEffect, useState } from 'react'
import { Link } from 'solito/link'

import {
  SettingLabel,
  SettingInput,
  InputContainer,
  SelectItemProps,
  HeaderText,
  SubHeaderText,
  ItemsSelect,
  SubmitButton,
} from './components/edit-components'

const Pronouns: SelectItemProps[] = [
  { name: 'She/Her' },
  { name: 'She/They' },
  { name: 'He/Him' },
  { name: 'He/They' },
  { name: 'They/Them' },
  { name: 'He/She' },
  { name: 'He/She/They' },
]

export const GeneralSettingsScreen = () => {
  const { user, profile } = useUser()

  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')

  const [date, setDate] = useState(new Date())
  const [pronouns, setPronouns] = useState('')

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return (
    <FormWrapper>
      <FormWrapper.Body>
        <Section>
          <YStack>
            <H4>Bacis Info</H4>
          </YStack>

          <SettingLabel htmlFor="name">Name</SettingLabel>
          <SettingInput id="name" placeholder="Enter your name" />

          <SettingLabel htmlFor="phone">Phone Number</SettingLabel>
          <SettingInput id="phone" placeholder="Enter your phone number" />

          <SettingLabel htmlFor="dob">Date of Birth</SettingLabel>
          <InputContainer>
            {/* <DatePicker
                value={date}
                onChange={(e, date: Date) => {
                  setDate(date);
                }}
              /> */}
          </InputContainer>

          <SettingLabel htmlFor="pronouns">Pronouns</SettingLabel>
          <ItemsSelect
            id="pronouns"
            name="pronouns"
            items={Pronouns}
            value={pronouns}
            onValueChange={setPronouns}
          />
        </Section>

        <Section>
          <XStack>
            <HeaderText fontFamily="$body">Other Info </HeaderText>
            <SubHeaderText>(Optional)</SubHeaderText>
          </XStack>

          <SettingLabel htmlFor="occupation">Ooccupation</SettingLabel>
          <SettingInput id="occupation" placeholder="Occupation" />

          {/* <SizableText>{user?.email}</SizableText> */}

          <SettingLabel htmlFor="interests">Interests</SettingLabel>
          <SettingInput id="Interests" placeholder="Interests" />
        </Section>

        {/* Submit Button */}
        <XStack paddingTop="$6" justifyContent="center">
          <SubmitButton
            icon={status === 'submitting' ? () => <Spinner color="white" /> : undefined}
          >
            Save Changes
          </SubmitButton>
        </XStack>
      </FormWrapper.Body>
    </FormWrapper>
  )
}

const Section = styled(YStack, {
  borderColor: '$borderColor',
  borderWidth: 1,
  p: '$4',
  br: '$4',
})
