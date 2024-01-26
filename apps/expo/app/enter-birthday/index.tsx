import { EnterBirthdayScreen } from 'app/features/auth/enter-birthday-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <EnterBirthdayScreen />
    </SafeAreaView>
  )
}
