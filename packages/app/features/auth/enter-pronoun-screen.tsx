import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm.native'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const pronouns = [
  { name: 'He / Him', value: 'he' },
  { name: 'She / Her', value: 'she' },
  { name: 'They / Them', value: 'they' },
  { name: 'Other', value: 'other' },
  { name: 'Prefer not to say', value: 'null' },
]

const EnterPronounSchema = z.object({
  pronoun: formFields.select,
})

export const EnterPronounScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()

  const formPronoun = useForm<z.infer<typeof EnterPronounSchema>>()
  const updatePronoun = async ({ pronoun }: z.infer<typeof EnterPronounSchema>) => {
    if (!pronoun) {
      formPronoun.setError('pronoun', { type: 'custom', message: 'Please select your pronoun' })
      return
    }
    const { error, data } = await supabase.auth.getUser()
    if (error) {
      formPronoun.setError('pronoun', { type: 'custom', message: error.message })
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({ pronoun: pronoun === 'null' ? null : pronoun })
        .eq('id', data.user?.id)
      console.log(error)
      router.push('/enter-birthday')
    }
  }
  return (
    <FormProvider {...formPronoun}>
      <SchemaForm
        form={formPronoun}
        schema={EnterPronounSchema}
        defaultValues={{ pronoun: undefined }}
        props={{
          pronoun: {
            options: pronouns.map(({ name, value }) => ({ name, value })),
            native: false,
            triggerWidth: 335,
            placeholder: 'Select your pronoun',
          },
        }}
        onSubmit={updatePronoun}
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
                <H2>Pronoun</H2>
                <Paragraph color="#717171" mt="$3" fontWeight="600" mb={10}>
                  What's your pronoun?
                </Paragraph>
              </YStack>
              <XStack>{Object.values(fields)}</XStack>
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}
