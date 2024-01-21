
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      SUPABASE_JWT_SECRET: string;

      EXPO_PUBLIC_URL: string;
      NEXT_PUBLIC_URL: string;

      EXPO_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;

      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      APP_SCHEME: string
      EXPO_PROJECT_ID: string
      OWNER: string
      UPDATES_URL: string
      APP_HOST: string
      NAKED_APP_HOST: string
      OIA_HOST: string
      NAKED_OIA_HOST: string
    }
  }
}

export { };
