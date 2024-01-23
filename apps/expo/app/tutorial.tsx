import { TestScreen } from 'app/features/tutorial/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <TestScreen />
    </>
  )
}
