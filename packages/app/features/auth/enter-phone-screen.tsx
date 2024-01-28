import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

import { usePhone, useCountryCode } from './onboard-hooks'

type phoneCodeInfo = {
  name: string
  flag: string
  country: string
}

const items: phoneCodeInfo[] = [
  { name: '+1', flag: '🇺🇸', country: 'United States' },
  { name: '+61', flag: '🇦🇺', country: 'Australia' },
  { name: '+1', flag: '🇨🇦', country: 'Canada' },
  { name: '+86', flag: '🇨🇳', country: 'China' },
  { name: '+62', flag: '🇮🇩', country: 'Indonesia' },
  { name: '+81', flag: '🇯🇵', country: 'Japan' },
  { name: '+60', flag: '🇲🇾', country: 'Malaysia' },
  { name: '+52', flag: '🇲🇽', country: 'Mexico' },
  { name: '+7', flag: '🇷🇺', country: 'Russia' },
  { name: '+65', flag: '🇸🇬', country: 'Singapore' },
  { name: '+886', flag: '🇹🇼', country: 'Taiwan' },
  { name: '+44', flag: '🇬🇧', country: 'United Kingdom' },
]

const getValue = (item: phoneCodeInfo) => {
  return `${item.flag} ${item.name}`
}

const getName = (item: phoneCodeInfo) => {
  return `${item.flag} ${item.country} (${item.name})`
}

const EnterPhoneSchema = z.object({
  countryCode: formFields.select,
  phone: formFields.text.min(5).max(22),
})

export const EnterPhoneScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { setCountryCode } = useCountryCode()
  const { setPhone } = usePhone()

  const formSendCode = useForm<z.infer<typeof EnterPhoneSchema>>()

  async function sendCode({ phone, countryCode }: z.infer<typeof EnterPhoneSchema>) {
    countryCode = countryCode.substring(countryCode.indexOf('+'))
    console.log(countryCode)
    setCountryCode(countryCode)
    const phoneWithCountryCode = `${countryCode}${phone}`
    setPhone(phoneWithCountryCode)

    const { error } = await supabase.auth.signInWithOtp({ phone: phoneWithCountryCode })
    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('phone')) {
        formSendCode.setError('phone', { type: 'custom', message: errorMessage })
      } else {
        formSendCode.setError('phone', { type: 'custom', message: 'Invalid Phone Number' })
      }
    } else {
      router.push({ pathname: '/enter-otp', query: { phone: phoneWithCountryCode } })
    }
  }

  return (
    <FormProvider {...formSendCode}>
      <SchemaForm
        form={formSendCode}
        schema={EnterPhoneSchema}
        defaultValues={{ phone: '', countryCode: getValue(items[0]) }}
        onSubmit={sendCode}
        props={
          {
            phone: { textType: 'number' },
            countryCode: {
              options: items.map((item) => ({
                name: getName(item),
                value: getValue(item),
              })),
              triggerDisplay: 'value',
              triggerWidth: 120,
              native: true,
            },
          } as const
        }
        renderAfter={({ submit }) => {
          return (
            <>
              <SubmitButton borderRadius="$10" onPress={() => submit()} backgroundColor="#A191DA">
                <Text color="white">Next</Text>
              </SubmitButton>
            </>
          )
        }}
      >
        {(fields) => (
          <>
            <YStack flex={1}>
              <XStack jc="flex-start" height="$8">
                <Button
                  icon={<Back size={38} />}
                  height="$5"
                  width="$5"
                  onPress={() => {
                    router.back()
                  }}
                />
              </XStack>
              <YStack ai="flex-start" jc="center">
                <H2>Log In</H2>
                <Paragraph color="#717171" mt="$3" fontWeight="600" mb={10}>
                  Enter your phone number to start
                </Paragraph>
              </YStack>
              <XStack width="100%">{Object.values(fields)}</XStack>
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
