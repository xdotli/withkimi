import { FieldError } from '@my/ui/src/components/FieldError'
import { Shake } from '@my/ui/src/components/Shake'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { useState } from 'react'
import { Button, Fieldset, Theme, useThemeName, Sheet } from 'tamagui'

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

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset
        style={{
          width: '100%',
        }}
      >
        <Shake shakeKey={error?.errorMessage}>
          <Button
            flex={1}
            padding="$3"
            br="$3"
            backgroundColor={buttonColor || 'white'}
            onPress={() => {
              setOpen(true)
            }}
            color={buttonTextColor || 'black'}
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
