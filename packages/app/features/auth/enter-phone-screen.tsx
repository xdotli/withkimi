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
} from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { LinearGradient } from 'tamagui/linear-gradient'
import { z } from 'zod'

import { usePhone, useCountryCode } from './onboard-hooks'

const items = [{ name: '+1' }, { name: '+86' }, { name: '+852' }]

const EnterPhoneSchema = z.object({
  phone: formFields.text.min(5).max(22),
  countryCode: formFields.select,
})

export const EnterPhoneScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { setCountryCode } = useCountryCode()
  const { setPhone } = usePhone()

  const formSendCode = useForm<z.infer<typeof EnterPhoneSchema>>()

  async function sendCode({ phone, countryCode }: z.infer<typeof EnterPhoneSchema>) {
    setCountryCode(countryCode)
    const phoneWithCountryCode = `${countryCode}${phone}`
    setPhone(phoneWithCountryCode)

    const { error } = await supabase.auth.signInWithOtp({ phone: phoneWithCountryCode })
    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('phone')) {
        formSendCode.setError('phone', { type: 'custom', message: errorMessage })
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
        defaultValues={{ phone: '', countryCode: '+1' }}
        onSubmit={sendCode}
        props={
          {
            phone: {},
            countryCode: {
              options: items.map((item) => ({
                name: item.name,
                value: item.name.toLowerCase(),
              })),
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
    // <YStack space>
    //   <XStack ai="center" space width="$8">
    //     <SelectDemoItem />
    //   </XStack>
    // </YStack>
    // <XStack ai="center" space width="$8">
    //   <SelectDemoItem />
    // </XStack>
    <></>
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

          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
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
              width="$4"
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

          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
