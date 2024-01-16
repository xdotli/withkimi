import { RouteScreen } from 'app/features/onroute/screen'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'top']}>
      <RouteScreen />
    </SafeAreaView>
  )
}
