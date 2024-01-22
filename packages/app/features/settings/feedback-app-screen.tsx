import {
  Button,
  YStack,
  XStack,
  H2,
  Text,
  SubmitButton,
  Paragraph,
  Select,
  Adapt,
  FontSizeTokens,
  Sheet,
  getFontSize,
  RadioGroup,
  ToggleGroup,
  H4,
} from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useMemo } from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'
import { useRouter } from 'solito/router'
import { LinearGradient } from 'tamagui/linear-gradient'
import { z } from 'zod'
import { useRating } from './feedback-hooks'

const EnterFeedbackSchema = z.object({
  overallExperienceRating: formFields.rating,
  voiceQualityRating: formFields.rating,
  contextRelevencyRating: formFields.rating,
  characteristicsConsistencyRating: formFields.rating,
  comment: formFields.textarea,
})

export const FeedbackAppScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const {
    overallExperienceRating,
    voiceQualityRating,
    contextRelevencyRating,
    characteristicsConsistencyRating,
    setOverallExperienceRating,
    setVoiceQualityRating,
    setContextRelevencyRating,
    setCharacteristicsConsistencyRating,
  } = useRating()

  const formFeedback = useForm<z.infer<typeof EnterFeedbackSchema>>()

  async function sendCode({
    overallExperienceRating,
    voiceQualityRating,
    contextRelevencyRating,
    characteristicsConsistencyRating,
    comment,
  }: z.infer<typeof EnterFeedbackSchema>) {
    // const { error } = await supabase.auth.signInWithOtp({ phone: phoneWithCountryCode })
    // if (error) {
    //   const errorMessage = error?.message.toLowerCase()
    //   if (errorMessage.includes('phone')) {
    //     formFeedback.setError('phone', { type: 'custom', message: errorMessage })
    //   }
    // } else {
    //   router.push({ pathname: '/enter-otp', query: { phone: phoneWithCountryCode } })
    // }
  }
  console.log(
    overallExperienceRating,
    voiceQualityRating,
    contextRelevencyRating,
    characteristicsConsistencyRating
  )
  return (
    <FormProvider {...formFeedback}>
      <SchemaForm
        form={formFeedback}
        schema={EnterFeedbackSchema}
        defaultValues={{
          comment: '',
          overallExperienceRating: '',
          voiceQualityRating: '',
          contextRelevencyRating: '',
          characteristicsConsistencyRating: '',
        }}
        onSubmit={sendCode}
        props={
          {
            overallExperienceRating: {
              onValueChange: (value: string) => {
                setOverallExperienceRating(value)
              },
              title: 'Overall Experience',
              info: 'How was your overall experience?',
              type: 'single',
              count: 5,
              rating: overallExperienceRating,
            },
            voiceQualityRating: {
              onValueChange: (value: string) => {
                setVoiceQualityRating(value)
              },
              title: 'Voice Quality',
              info: 'How was the voice quality?',
              type: 'single',
              count: 5,
              rating: voiceQualityRating,
            },
            contextRelevencyRating: {
              onValueChange: (value: string) => {
                setContextRelevencyRating(value)
              },
              title: 'Context Relevency',
              info: 'How relevant was the context?',
              type: 'single',
              count: 5,
              rating: contextRelevencyRating,
            },
            characteristicsConsistencyRating: {
              onValueChange: (value: string) => {
                setCharacteristicsConsistencyRating(value)
              },
              title: 'Characteristics Consistency',
              info: 'How consistent was the characteristics?',
              type: 'single',
              count: 5,
              rating: characteristicsConsistencyRating,
            },
            comment: {},
          } as const
        }
        renderAfter={({ submit }) => {
          return (
            <FormButtonWithSubOption
              onPress={() => submit()}
              title="Submit"
              subtitle="Join our Discord community?"
              link="https://discord.gg/HHswpaw6tF"
              linkText="Join"
            />
          )
        }}
      >
        {(fields) => (
          <YStack>
            <H4>How was your talk?</H4>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </FormProvider>
  )
}

function FormButtonWithSubOption({
  onPress,
  title,
  subtitle,
  link,
  linkText,
}: {
  onPress: () => void
  title: string
  subtitle: string
  link: string
  linkText: string
}) {
  return (
    <YStack px="$1" fb="auto" ai="center">
      <SubmitButton borderRadius="$10" onPress={() => onPress()} backgroundColor="#A191DA">
        <Text f={1} ta="center" color="white" fontWeight="600">
          {title}
        </Text>
      </SubmitButton>
      <XStack gap="$1.5">
        <Text color="#717171" mt="$3">
          {subtitle}
        </Text>
        <Link href={link}>
          <Text color="#155184" mt="$3" textDecorationLine="underline" fontWeight="600">
            {linkText}
          </Text>
        </Link>
      </XStack>
    </YStack>
  )
}
