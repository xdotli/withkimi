import { FieldError } from '@my/ui/src/components/FieldError'
import { Shake } from '@my/ui/src/components/Shake'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { useState, useId } from 'react'
import { Button, Fieldset, Theme, useThemeName, Sheet, Label } from 'tamagui'

export const DateField = ({
  buttonText,
  buttonColor,
  buttonTextColor,
}: {
  buttonText?: string
  buttonColor?: any
  buttonTextColor?: any
}) => {
  const { field, error } = useTsController<Date>()
  const themeName = useThemeName()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const { label, isOptional } = useFieldInfo()
  const id = useId()

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#888',
          borderRadius: 15,
          borderStyle: 'dashed',
          overflow: 'hidden',
        }}
      >
        {!!label && (
          <Label theme="alt1" htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}
        <Shake shakeKey={error?.errorMessage}>
          <Button
            flex={1}
            padding="$3"
            br={15}
            // backgroundColor={buttonColor || 'white'}
            onPress={() => {
              setOpen(true)
            }}
          >
            {buttonText
              ? buttonText
              : field.value
              ? dateToString(field.value)
              : 'Please Select a Date'}
          </Button>
          <Sheet
            modal
            open={open}
            onOpenChange={setOpen}
            snapPoints={[38]}
            position={position}
            onPositionChange={setPosition}
            zIndex={100_000}
            animation="medium"
          >
            <Sheet.Overlay />
            <Sheet.Handle />
            <Sheet.Frame>
              <DateTimePicker
                mode="date"
                value={field.value || new Date()}
                onChange={(_, date) => {
                  field.onChange(date)
                }}
                display="spinner"
                maximumDate={new Date()}
              />
            </Sheet.Frame>
          </Sheet>
        </Shake>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}

function dateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
