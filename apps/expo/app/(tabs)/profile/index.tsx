import { ProfileScreen } from 'app/features/profile/screen'
import { Stack } from 'expo-router'
import * as React from 'react'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <ProfileScreen />
    </>
  )
}
