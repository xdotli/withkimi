import { Adapt, Select, Sheet, styled, Button, YStack, Text, XStack, Input, Label } from '@my/ui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useMemo } from 'react'
// import { LinearGradient } from 'tamagui/linear-gradient'

export const SettingLabel = styled(Label, {
  fontSize: 15,
  fontWeight: '600',
})

export const SettingInput = styled(Input, {
  // size: 40,
  // width: '100%',
})

export const HeaderText = styled(Text, {
  paddingTop: 10,
  fontSize: 22,
  fontWeight: '600',
})

export const SubHeaderText = styled(Text, {
  fontSize: 16,
  marginTop: 16,
  color: '$gray10',
  marginLeft: 5,
})

export const InputContainer = styled(XStack, {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '$gray4',
  borderRadius: 8,
  height: 40,
  // backgroundColor: colors.lightGray,
})

export const SubmitButton = styled(Button, {
  width: 334,
  height: 50,
  paddingVertical: 10,
  borderRadius: 25,
  marginVertical: 5,
  fontWeight: '700',
  color: 'white',
  backgroundColor: '#a191da',
})

export interface SelectItemProps {
  name: string
}

export interface SelectItemsProps {
  id: string
  name: string
  items: SelectItemProps[]
  value: string
  onValueChange: (value: string) => void
  native?: boolean
}

export function ItemsSelect({ id, name, items, value, onValueChange, native }: SelectItemsProps) {
  return (
    <Select id={id} value={value} onValueChange={onValueChange}>
      <Select.Trigger width="100%" height={55} iconAfter={ChevronDown}>
        <Select.Value placeholder="Share your pronouns" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
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
          {/* <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          /> */}
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          animation="quick"
          animateOnly={['transform', 'opacity']}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label pressTheme fontSize="$6" paddingTop="$2">
              {name}
            </Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                      size="$6"
                    >
                      <Select.ItemText fontSize="$4">{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [items]
            )}
          </Select.Group>
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
          {/* <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          /> */}
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
