import { Button } from '@my/ui'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'

import { IconGoogle } from './IconGoogle'

export function GoogleSignIn() {
  const router = useRouter()
  const supabase = useSupabase()
  const handleOAuthSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // your options
      },
    })
    if (error) {
      // handle error
    }
    router.replace('/')
  }

  return (
    <Button borderRadius="$10" onPress={() => handleOAuthSignIn()} icon={IconGoogle}>
      Sign in with Google
    </Button>
  )
}
