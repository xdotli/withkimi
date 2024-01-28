import { Button, YStack, XStack, H2, Text, SubmitButton, Paragraph } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm.native'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const EnterNameSchema = z.object({
  name: formFields.text.min(3),
})

export const EnterNameScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()

  const formName = useForm<z.infer<typeof EnterNameSchema>>()
  const updateName = async ({ name }: z.infer<typeof EnterNameSchema>) => {
    const { error, data } = await supabase.auth.getUser()
    if (error) {
      formName.setError('name', { type: 'custom', message: error.message })
    } else {
      supabase.from('profiles').update({ name }).eq('id', data.user?.id)
      router.push('/enter-pronoun')
    }
  }
  return (
    <FormProvider {...formName}>
      <SchemaForm
        form={formName}
        schema={EnterNameSchema}
        defaultValues={{ name: '' }}
        props={{}}
        onSubmit={updateName}
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
                <H2>Name</H2>
                <Paragraph color="#717171" mt="$3" fontWeight="600" mb={10}>
                  What do you want to be called by?
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
