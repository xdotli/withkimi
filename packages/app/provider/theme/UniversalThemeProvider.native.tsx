import { useForceUpdate } from '@my/ui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ThemeProviderProps, useThemeSetting as next_useThemeSetting } from '@tamagui/next-theme'
import { StatusBar } from 'expo-status-bar'
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { AppState, ColorSchemeName, useColorScheme } from 'react-native'

type ThemeContextValue = (ThemeProviderProps & { current?: string | null }) | null
export const ThemeContext = createContext<ThemeContextValue>(null)

type ThemeName = 'light' | 'dark' | 'system'

export const UniversalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [current, setCurrent] = useState<ThemeName>('system')
  const systemTheme = useNonFlickeringColorScheme()

  useLayoutEffect(() => {
    async function main() {
      const persistedTheme = await AsyncStorage.getItem('@preferred_theme')
      if (persistedTheme) {
        setCurrent(persistedTheme as ThemeName)
      }
    }
    main()
  }, [])

  useEffect(() => {
    async function main() {
      await AsyncStorage.setItem('@preferred_theme', current)
    }
    main()
  }, [current])

  const forceUpdate = useForceUpdate()

  const themeContext = useMemo(() => {
    return {
      themes: ['light', 'dark'],
      onChangeTheme: (next: string) => {
        setCurrent(next as ThemeName)
        forceUpdate()
      },
      current,
      systemTheme,
    } satisfies ThemeContextValue
  }, [current, forceUpdate, systemTheme])

  return (
    <ThemeContext.Provider value={themeContext}>
      <InnerProvider>{children}</InnerProvider>
    </ThemeContext.Provider>
  )
}

const InnerProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useThemeSetting()

  return (
    <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  )
}

export const useThemeSetting: typeof next_useThemeSetting = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeSetting should be used within the context provider.')
  }

  const outputContext: ReturnType<typeof next_useThemeSetting> = {
    ...context,
    systemTheme: context.systemTheme as 'light' | 'dark',
    themes: context.themes!,
    current: context.current ?? 'system',
    resolvedTheme: context.current === 'system' ? context.systemTheme : context.current ?? 'system',
    set: (value) => {
      context.onChangeTheme?.(value)
    },
    toggle: () => {
      const map = {
        light: 'dark',
        dark: 'system',
        system: 'light',
      }
      context.onChangeTheme?.(map[(context.current as ThemeName) ?? 'system'])
    },
  }

  return outputContext
}

export const useRootTheme = () => {
  const context = useThemeSetting()
  return [context.current === 'system' ? context.systemTheme : context.current, context.set]
}

// fix flash of wrong theme on iOS:
// https://github.com/bluesky-social/social-app/pull/1417
// wait on merge from react-native to remove:
// https://github.com/facebook/react-native/pull/39439
function useNonFlickeringColorScheme() {
  const colorSchemeFromRN = useColorScheme()
  const [nonFlickerScheme, setNonFlickerScheme] = useState<ColorSchemeName>(colorSchemeFromRN)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      const isActive = state === 'active'
      if (!isActive) return
      setNonFlickerScheme(colorSchemeFromRN)
    })

    return () => {
      subscription.remove()
    }
  }, [colorSchemeFromRN])

  return nonFlickerScheme || 'system'
}
