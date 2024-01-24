import { Back } from '@my/ui/src/icons/back'
import { EditProfileScreen } from 'app/features/settings/edit-profile-screen'
import { Stack, router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back size={38} />
            </TouchableOpacity>
          ),
        }}
      />
      <EditProfileScreen />
    </SafeAreaView>
  )
}
