import { HomeScreen } from 'app/features/home/screen'
import * as React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'top']}>
      <HomeScreen />
    </SafeAreaView>
  )
}
