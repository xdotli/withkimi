import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

import { usePhone } from './onboard-hooks'

const EnterOtpSchema = z.object({
  otp: formFields.text.max(6).length(6),
})

export const EnterOtpScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { phone } = usePhone()

  const formVerifyOtp = useForm<z.infer<typeof EnterOtpSchema>>()

  async function verifyOtp({ otp }: z.infer<typeof EnterOtpSchema>) {
    if (!phone) {
      return
    }
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('phone')) {
        formVerifyOtp.setError('otp', { type: 'custom', message: errorMessage })
      }
      formVerifyOtp.setError('otp', { type: 'custom', message: errorMessage })
    } else {
      router.push('/')
    }
  }

  return (
    <FormProvider {...formVerifyOtp}>
      <SchemaForm
        form={formVerifyOtp}
        schema={EnterOtpSchema}
        defaultValues={{ otp: '' }}
        props={{ otp: { textType: 'number' } }}
        onSubmit={verifyOtp}
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
                    router.push('/enter-phone')
                  }}
                />
              </XStack>
              <YStack ai="flex-start" jc="center">
                <H2>Verification</H2>
                <Paragraph color="#717171" my="$3" fontWeight="600">
                  Please enter the verification code.
                </Paragraph>
              </YStack>

              {Object.values(fields)}
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
