import { Back } from '@my/ui/src/icons/back'
import { TermsOfServiceScreen } from 'app/features/legal/terms-of-service-screen'
import { Stack, router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Terms and Policies',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back size={38} />
            </TouchableOpacity>
          ),
        }}
      />
      <TermsOfServiceScreen />
    </SafeAreaView>
  )
}
