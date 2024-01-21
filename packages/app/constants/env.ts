import Constants from 'expo-constants'

export const ENV = Constants.expoConfig?.extra?.ENV || 'production'
export const NAKED_APP_HOST = Constants.expoConfig?.extra?.NAKED_APP_HOST || 'xlog.app'
export const APP_HOST = Constants.expoConfig?.extra?.APP_HOST || 'https://xlog.app'
export const NAKED_OIA_HOST = Constants.expoConfig?.extra?.NAKED_OIA_HOST || 'oia.xlog.app'
export const OIA_HOST = Constants.expoConfig?.extra?.OIA_HOST || 'https://oia.xlog.app'
export const EXPO_PROJECT_ID = Constants.expoConfig?.extra?.eas?.projectId

console.log('HOST LIST: ', {
  APP_HOST,
  NAKED_APP_HOST,
  OIA_HOST,
  NAKED_OIA_HOST,
})
console.log('Current ENV: ', ENV)
