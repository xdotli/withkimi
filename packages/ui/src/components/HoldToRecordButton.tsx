import React from 'react'
import { Button, ButtonProps, Sheet, View } from 'tamagui'

type HoldToRecordButtonProps = {
  onPressIn?: (event: any) => void
  onPressOut?: (event: any) => void
  pressed: React.ReactNode
} & ButtonProps

export const HoldToRecordButton: React.FC<HoldToRecordButtonProps> = (props) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [position, setPosition] = React.useState<number>(0)
  // console.log(open)
  return (
    <>
      {/* Bezier Curve Frame */}
      <Sheet
        forceRemoveScrollEnabled={open}
        open={open}
        snapPoints={[225]}
        snapPointsMode="constant"
        dismissOnSnapToBottom
        disableDrag
        position={position}
        onPositionChange={setPosition}
        zIndex={99_999}
        animation="medium"
      >
        {/* Spacer */}
        <View bg="transparent" dsp="flex" jc="center" fd="row" f={1} />
        {/* Bezier Curve Handle */}
        <View bg="transparent" dsp="flex" jc="center" fd="row" f={4}>
          <View
            bg="#C5C4DC"
            f={0.5}
            transform={[
              {
                scaleX: 2.25,
              },
            ]}
            btrr={200}
            btlr={200}
          />
        </View>
        {/* Sheet */}
        <Sheet.Frame
          dsp="flex"
          br={0}
          fd="row"
          ai="stretch"
          jc="center"
          backgroundColor="#C5C4DC"
        />
      </Sheet>
      <Sheet
        // modal
        defaultOpen
        snapPoints={[200]}
        snapPointsMode="constant"
        zIndex={100_000}
        disableDrag
        animation="medium"
      >
        <Sheet.Frame
          backgroundColor="transparent"
          padding="$4"
          justifyContent="center"
          alignItems="center"
        >
          {/* Button */}
          <Button
            width="$20"
            height="$6"
            borderRadius="$12"
            backgroundColor="#A191DA"
            {...props}
            onPressIn={(event) => {
              setOpen(true)
              props.onPressIn && props.onPressIn(event)
            }}
            onPressOut={(event) => {
              setOpen(false)
              props.onPressOut && props.onPressOut(event)
            }}
          >
            {open ? <>{props.pressed}</> : props.children}
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
