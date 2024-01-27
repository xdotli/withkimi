import { Database } from '@my/supabase/types'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../constants/env'
import { replaceLocalhost } from '../getLocalhost.native'

if (!SUPABASE_URL) {
  throw new Error(
    `SUPABASE_URL is not set. Please update the root .env.local and restart the server.`
  )
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    `SUPABASE_ANON_KEY is not set. Please update the root .env.local and restart the server.`
  )
}

const supabaseUrl = replaceLocalhost(SUPABASE_URL)

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient<Database>(supabaseUrl, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
