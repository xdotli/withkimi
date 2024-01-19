import {
  Button,
  YStack,
  XStack,
  H2,
  Text,
  SubmitButton,
  Paragraph,
  Select,
  Label,
  Adapt,
  FontSizeTokens,
  Sheet,
  getFontSize,
} from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'

import { z } from 'zod'

import { usePhone, useCountryCode } from './onboard-hooks'

const EnterPhoneSchema = z.object({
  phone: formFields.text.min(5).max(22),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const BackIcon = (props: any) => {
  const { color = '#2E2E2E', size, ...otherProps } = props
  return (
    <svg width={size} height={size} {...otherProps} viewBox="0 0 32 32">
      <title>Rectangle 5</title>
      <path
        fill="#063855"
        fillRule="evenodd"
        d="m4.667 12.833-.707.707-.708-.707.708-.707.707.707Zm19.666 9.334a1 1 0 0 1-2 0h2Zm-14.54-2.793L3.96 13.54l1.414-1.414 5.833 5.834-1.414 1.414ZM3.96 12.126l5.833-5.833 1.414 1.414-5.833 5.833-1.414-1.414Zm.707-.293h12.666v2H4.667v-2Zm19.666 7v3.334h-2v-3.334h2Zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5v-2Z"
      />
    </svg>
  )
}

export const EnterPhoneScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { countryCode, setCountryCode } = useCountryCode()
  const { phone, setPhone } = usePhone()

  const formSendCode = useForm<z.infer<typeof EnterPhoneSchema>>()

  async function sendCode({ phone }: z.infer<typeof EnterPhoneSchema>) {
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('phone')) {
        formSendCode.setError('phone', { type: 'custom', message: errorMessage })
      }
    } else {
      router.push('/enter-otp')
    }
  }

  return (
    <FormProvider {...formSendCode}>
      <SchemaForm
        form={formSendCode}
        schema={EnterPhoneSchema}
        defaultValues={{ phone: '' }}
        onSubmit={sendCode}
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
                  icon={<BackIcon size={38} />}
                  height="$5"
                  width="$5"
                  onPress={() => {
                    router.push('/onboarding')
                  }}
                />
              </XStack>
              <YStack ai="flex-start" jc="center">
                <H2>Log In</H2>
                <Paragraph color="#717171" mt="$3" fontWeight="600">
                  Enter your phone number to start
                </Paragraph>
              </YStack>
              <SelectDemo />
              {Object.values(fields)}
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}

export function SelectDemo() {
  return (
    <YStack space>
      <XStack ai="center" space>
        <Label f={1} fb={0}>
          Custom
        </Label>
        <SelectDemoItem />
      </XStack>

      <XStack ai="center" space>
        <Label f={1} fb={0}>
          Native
        </Label>

        <SelectDemoItem native />
      </XStack>
    </YStack>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function SelectDemoItem(props: any) {
  const [val, setVal] = useState('apple')
  return (
    <Select id="food" value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
      <Select.Trigger width={220} iconAfter={ChevronDown}>
        <Select.Value placeholder="Something" />
      </Select.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'direct',
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>

          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>
      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
        </Select.ScrollUpButton>
        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>Country</Select.Label>

            {/* for longer lists memoizing these is useful */}

            {/* biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                      <Select.ItemText>{item.name}</Select.ItemText>

                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),

              [items]
            )}
          </Select.Group>

          {/* Native gets an extra icon */}

          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
            </YStack>
          )}
        </Select.Viewport>
        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
]
