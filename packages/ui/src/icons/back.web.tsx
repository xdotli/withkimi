import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import { memo } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Icon = (props: any) => {
  const { color = '#2E2E2E', size, ...otherProps } = props
  return (
    <svg width={size} fill="none" height={size} {...otherProps} viewBox="0 0 32 32">
      <title>Rectangle 5</title>
      <path
        fill={color ?? '#2E2E2E'}
        d="m4.667 12.833-.707.707-.708-.707.708-.707.707.707Zm19.666 9.334a1 1 0 0 1-2 0h2Zm-14.54-2.793L3.96 13.54l1.414-1.414 5.833 5.834-1.414 1.414ZM3.96 12.126l5.833-5.833 1.414 1.414-5.833 5.833-1.414-1.414Zm.707-.293h12.666v2H4.667v-2Zm19.666 7v3.334h-2v-3.334h2Zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5v-2Z"
      />
    </svg>
  )
}
Icon.displayName = 'Back'

export const Back = memo<IconProps>(themed(Icon))
