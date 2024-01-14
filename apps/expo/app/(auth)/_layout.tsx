import { Stack } from 'expo-router'
import * as React from 'react'

export default function Layout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack />
    </>
  )
}
