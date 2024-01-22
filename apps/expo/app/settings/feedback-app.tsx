import { Back } from '@my/ui/src/icons/back'
import { FeedbackAppScreen } from 'app/features/settings/feedback-app-screen'
import { Stack, router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Give Feedback',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#A191DA',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back size={38} />
            </TouchableOpacity>
          ),
        }}
      />
      <FeedbackAppScreen />
    </SafeAreaView>
  )
}
