import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const EnterBirthdaySchema = z.object({
  birthday: formFields.date,
})

export const EnterBirthdayScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()

  const formBirthday = useForm<z.infer<typeof EnterBirthdaySchema>>()
  const updateBirthday = async ({ birthday }: z.infer<typeof EnterBirthdaySchema>) => {
    const { error, data } = await supabase.auth.getUser()
    if (error) {
      formBirthday.setError('birthday', { type: 'custom', message: error.message })
    } else {
      supabase.from('profiles').update({ birthday }).eq('id', data.user?.id)
      router.push('/')
    }
  }
  return (
    <FormProvider {...formBirthday}>
      <SchemaForm
        form={formBirthday}
        schema={EnterBirthdaySchema}
        defaultValues={{ birthday: undefined }}
        props={{}}
        onSubmit={updateBirthday}
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
                <H2>Birthday</H2>
                <Paragraph color="#717171" mt="$3" fontWeight="600" mb={10}>
                  When's your birthday?
                </Paragraph>
              </YStack>
              <XStack>{Object.values(fields)}</XStack>
              <Paragraph color="#a7a7a7" mt="$2" fontSize="$1">
                You can always change this later in Profile Settings
              </Paragraph>
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
