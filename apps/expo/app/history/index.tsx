import { Back } from '@my/ui/src/icons/back'
import { ChatHistoryScreen } from 'app/features/home/chat-history-screen'
import { Stack, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'

export default function Screen() {
  return (  
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Nekomi',
          headerTitleStyle: {color: "white", fontSize: 28},
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back size={38} color="white"/>
            </TouchableOpacity>
          ),
        }}
      />
      <ChatHistoryScreen />
    </SafeAreaView>
  )
}
