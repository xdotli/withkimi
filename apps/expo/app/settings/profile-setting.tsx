import { Back } from '@my/ui/src/icons/back'
import { SettingsScreen } from 'app/features/settings/profile-setting-screen'
import { Stack, router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Profile Setting',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back size={38} />
            </TouchableOpacity>
          ),
        }}
      />
      <SettingsScreen />
    </SafeAreaView>
  )
}
