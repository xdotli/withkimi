import { useStringFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, Input, InputProps, Label, Theme, useThemeName } from 'tamagui'

import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

export const TextField = ({
  textType = 'text',
  ...props
}: {
  textType?: string
} & Pick<InputProps, 'size' | 'autoFocus' | 'secureTextEntry'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, placeholder, isOptional, maxLength, minLength, isEmail } = useStringFieldInfo()
  const themeName = useThemeName()
  const id = useId()
  const disabled = isSubmitting

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset flex={1}>
        {!!label && (
          <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}
        <Shake shakeKey={error?.errorMessage}>
          <Input
            disabled={disabled}
            maxLength={maxLength}
            placeholderTextColor="$color10"
            spellCheck={isEmail ? false : undefined}
            autoCapitalize={isEmail ? 'none' : undefined}
            keyboardType={
              isEmail ? 'email-address' : textType === 'number' ? 'number-pad' : undefined
            }
            value={field.value}
            onChangeText={(text) => {
              if (textType === 'number') {
                text = text.replace(/[^0-9]/g, '')
              }
              field.onChange(text)
            }}
            onBlur={field.onBlur}
            ref={field.ref}
            placeholder={placeholder}
            id={id}
            {...props}
          />
        </Shake>
        <FieldError
          message={
            error?.errorMessage.includes('at least')
              ? `${
                  field.name[0].toUpperCase() +
                  (field.name.length > 1 && field.name.substring(1).toLowerCase())
                } must be at least ${minLength} characters`
              : error?.errorMessage
          }
        />
      </Fieldset>
    </Theme>
  )
}
