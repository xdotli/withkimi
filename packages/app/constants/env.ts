import Constants from 'expo-constants'

export const ENV = Constants.expoConfig?.extra?.ENV || 'production'
export const NAKED_APP_HOST = Constants.expoConfig?.extra?.NAKED_APP_HOST || 'withkimi.app'
export const APP_HOST = Constants.expoConfig?.extra?.APP_HOST || 'https://withkimi.app'
export const NAKED_OIA_HOST = Constants.expoConfig?.extra?.NAKED_OIA_HOST || 'oia.withkimi.app'
export const OIA_HOST = Constants.expoConfig?.extra?.OIA_HOST || 'https://oia.withkimi.app'
export const EXPO_PROJECT_ID = Constants.expoConfig?.extra?.eas?.projectId
export const URL = Constants.expoConfig?.extra?.URL
export const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL
export const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY

console.log('HOST LIST: ', {
  APP_HOST,
  NAKED_APP_HOST,
  OIA_HOST,
  NAKED_OIA_HOST,
})
console.log('Current ENV: ', ENV)
