import { EditProfileScreen } from 'app/features/settings/edit-profile-screen'
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
      <EditProfileScreen />
    </SafeAreaView>
  )
}
