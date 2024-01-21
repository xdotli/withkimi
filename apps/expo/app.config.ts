import type { ExpoConfig, ConfigContext } from 'expo/config'

import setAppConfigEnv from './scripts/set-app-config-env.js'

const { appConfig, environment, decreasedVersion } = setAppConfigEnv()

const config = appConfig

export default (_: ConfigContext): ExpoConfig => {
  return {
    name: config.name,
    slug: config.slug,
    jsEngine: 'hermes',
    version: decreasedVersion,
    scheme: config.scheme,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      url: process.env.UPDATES_URL,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: config.scheme,
      associatedDomains: [`applinks:${config.nakedAppHost}`, `applinks:${config.nakedOIAHost}`],
    },
    android: {
      package: config.scheme,
    },
    web: undefined,
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#ffffff',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      'expo-apple-authentication',
      'expo-router',
      'expo-build-properties',
    ],
    extra: {
      router: {
        origin: false,
      },
      APP_HOST: config.appHost,
      NAKED_APP_HOST: config.nakedAppHost,
      OIA_HOST: config.oiaHost,
      NAKED_OIA_HOST: config.nakedOIAHost,
      ENV: environment,
      eas: {
        projectId: process.env.EXPO_PROJECT_ID,
      },
    },
    owner: process.env.OWNER,
  }
}
