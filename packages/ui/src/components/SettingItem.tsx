import { IconProps } from '@tamagui/helpers-icon'
import { ChevronRight } from '@tamagui/lucide-icons'
import { ListItem, ListItemProps, SizableText, XStack, YGroup, YStack } from 'tamagui'

const iconAfterColors = '#a191da'

export type SettingItemProps = {
  icon: React.FC<IconProps>
  rightLabel?: string
  /**
   * native only - not showing colors on native
   */
  accentColor?: ListItemProps['backgroundColor']
  /**
   * web only - to indicate the current page
   */
  isActive?: boolean
} & ListItemProps

export const SettingItem = ({
  icon: Icon,
  children,
  rightLabel,
  isActive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accentColor: _, // not used on web - destructuring to avoid passing it through props
  ...props
}: SettingItemProps) => {
  return (
    <YGroup.Item>
      <ListItem
        hoverTheme
        cursor="pointer"
        gap="$2"
        borderRadius="$10"
        backgroundColor={isActive ? '$backgroundFocus' : 'transparent'}
        iconAfter={<ChevronRight color={iconAfterColors} size={22} />}
        {...props}
      >
        <YStack padding="$2" borderRadius="$3">
          <Icon opacity={0.8} size={22} />
        </YStack>
        <SizableText flex={1}>{children}</SizableText>
        {!!rightLabel && (
          <XStack borderRadius="$10" backgroundColor="$backgroundPress" px="$3" py="$1.5">
            <SizableText size="$1" textTransform="capitalize">
              {rightLabel}
            </SizableText>
          </XStack>
        )}
      </ListItem>
    </YGroup.Item>
  )
}
