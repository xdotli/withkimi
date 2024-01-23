import { H4, YStack, XStack, Spinner, SubmitButton, Text, Button, Label } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import DatePicker from '@react-native-community/datetimepicker'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const pronounsItems = [
  { name: 'Secret' },
  { name: 'She/Her' },
  { name: 'She/They' },
  { name: 'He/Him' },
  { name: 'He/They' },
  { name: 'They/Them' },
  { name: 'He/She' },
  { name: 'He/She/They' },
]

const countryCodeItems = [{ name: '+1' }, { name: '+86' }, { name: '+852' }]

const profileEditSchema = z.object({
  name: formFields.text.min(3).max(25).describe('Name // Enter your name'),
  phone: formFields.text.min(5).max(22).describe('Phone Number // xxx xxx xxxx'),
  countryCode: formFields.select.describe('Country Code'),
  pronouns: formFields.select.describe('Pronouns'),
  interests: formFields.text.max(50).describe('Interests // Tell us a bit about yourself'),
  occupation: formFields.text.max(50).describe('Occupation // Tell us a bit about yourself'),
})

export const EditProfileScreen = () => {
  const router = useRouter()
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const formSaveProfile = useForm<z.infer<typeof profileEditSchema>>()

  const [dob, setDob] = useState(new Date())
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setDob(currentDate)
  }

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  async function onSaveProfile({
    name,
    phone,
    countryCode,
    pronouns,
    interests,
    occupation,
  }: z.infer<typeof profileEditSchema>) {
    console.log('Submitted name:', name)
    console.log('Submitted phone:', countryCode, phone)
    console.log('Submitted dob:', dob.toDateString())
    console.log('Submitted pronouns:', pronouns)
    console.log('Submitted others:', interests, occupation)
  }

  return (
    <FormProvider {...formSaveProfile}>
      <SchemaForm
        form={formSaveProfile}
        schema={profileEditSchema}
        defaultValues={{
          name: '',
          phone: '',
          countryCode: '+1',
          pronouns: 'Secret',
          interests: '',
          occupation: '',
        }}
        onSubmit={onSaveProfile}
        props={
          {
            name: {},
            phone: {},
            countryCode: {
              options: countryCodeItems.map((item) => ({
                name: item.name,
                value: item.name.toLowerCase(),
              })),
              native: true,
            },
            pronouns: {
              options: pronounsItems.map((item) => ({
                name: item.name,
                value: item.name,
              })),
              native: true,
            },
            interests: {},
            occupation: {},
          } as const
        }
        renderAfter={({ submit }) => {
          return (
            <>
              <SubmitButton
                icon={status === 'submitting' ? () => <Spinner color="white" /> : undefined}
                borderRadius="$10"
                onPress={() => submit()}
                backgroundColor="#A191DA"
              >
                <Text color="white">Save Changes</Text>
              </SubmitButton>
            </>
          )
        }}
      >
        {(fields) => (
          <>
            <YStack flex={1}>
              <XStack jc="flex-start" height="$9">
                <Button
                  icon={<Back size={38} />}
                  height="$5"
                  width="$5"
                  onPress={() => {
                    router.push('/settings/profile-setting')
                  }}
                />
              </XStack>
              <XStack jc="center" marginTop="$-11">
                <H4>Edit Profile</H4>
              </XStack>

              <H4 paddingTop="$4">Bacis Info</H4>
              {Object.values(fields.name.props)}
              {Object.values(fields.phone.props)}
              {Object.values(fields.countryCode.props)}

              <Label htmlFor="dob" color="$gray11" fontWeight="300">
                Date of Birth
              </Label>
              <XStack
                flex={1}
                borderRadius={8}
                alignItems="center"
                borderWidth={1}
                borderColor="$gray4"
                backgroundColor="$background"
              >
                <Text color="$color" style={{ paddingLeft: 15, width: '50%' }}>
                  {dob.toDateString()}
                </Text>
                <DatePicker style={{ width: '50%' }} value={dob} onChange={onChange} />
              </XStack>

              {Object.values(fields.pronouns.props)}

              <H4 paddingTop="$4">Other Info (Optional)</H4>

              {Object.values(fields.occupation.props)}

              {Object.values(fields.interests.props)}
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
