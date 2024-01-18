import { H2, Paragraph, SubmitButton, Text, Theme, YStack, isWeb } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import React, { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'
import { useRouter } from 'solito/router'
import { z } from 'zod'

import { SocialLogin } from './components/SocialLogin'

const { useParams, useUpdateParams } = createParam<{ phone?: string }>()

const SignInPhoneSchema = z.object({
  phone: formFields.text.min(5).max(22).describe('Phone // Enter your phone number'),
  token: formFields.text.length(6).describe('Token // Enter the token you received'),
})

export const SignInScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { params } = useParams()
  const updateParams = useUpdateParams()
  useEffect(() => {
    // remove the persisted email from the url, mostly to not leak user's email in case they share it
    if (params?.phone) {
      updateParams({ phone: undefined }, { web: { replace: true } })
    }
  }, [params?.phone, updateParams])

  const formPhone = useForm<z.infer<typeof SignInPhoneSchema>>()

  async function signInWithPhone({ phone, token }: z.infer<typeof SignInPhoneSchema>) {
    // const { data, error } = await supabase.auth.signInWithOtp({
    //   phone,
    // })

    const {
      data: { session },
      error: errorVeiry,
    } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })

    if (errorVeiry) {
      const errorMessage = errorVeiry?.message.toLowerCase()
      if (errorMessage.includes('phone')) {
        formPhone.setError('phone', { type: 'custom', message: errorMessage })
      } else if (errorMessage.includes('token')) {
        formPhone.setError('token', { type: 'custom', message: errorMessage })
      }
    } else {
      router.replace('/')
    }
  }

  return (
    <FormProvider {...formPhone}>
      <SchemaForm
        form={formPhone}
        schema={SignInPhoneSchema}
        defaultValues={{
          phone: params?.phone || '',
          token: '',
        }}
        onSubmit={signInWithPhone}
        renderAfter={({ submit }) => {
          return (
            <>
              <Theme inverse>
                <SubmitButton onPress={() => submit()} borderRadius="$10">
                  Sign In
                </SubmitButton>
              </Theme>

              {isWeb && <SocialLogin />}
            </>
          )
        }}
      >
        {(fields) => (
          <>
            <YStack gap="$3" mb="$4">
              <H2 $sm={{ size: '$8' }}>Welcome Back</H2>
              <Paragraph theme="alt1">Sign in to your account</Paragraph>
            </YStack>
            {Object.values(fields)}
            {!isWeb && (
              <YStack mt="$4">
                <SocialLogin />
              </YStack>
            )}
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
