import { Meta, StoryObj } from '@storybook/react'
import { Theme } from 'tamagui'

import { FieldError } from './FieldError'

const meta: Meta<typeof FieldError> = {
  title: 'ui/FieldError',
  parameters: { layout: 'centered' },
  component: FieldError,
}

type Story = StoryObj<typeof FieldError>

export const Basic: Story = {
  args: {
    message: 'Try removing the message from controls... it will animate out.',
  },
  render: (props) => {
    return (
      <Theme name="red">
        <FieldError {...props} />
      </Theme>
    )
  },
}

export default meta
