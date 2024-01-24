import { Paragraph, Settings, YStack, XStack, Button, useMedia, H4, Sheet, SheetProps, useSheet } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import { Info, LogOut, Flag, User, LockKeyhole } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
import { useRouter } from 'solito/router'

// @ts-ignore
import rootPackageJson from '../../../../package.json'
// @ts-ignore
import packageJson from '../../package.json'

export const SettingsScreen = () => {
  const router = useRouter()
  const media = useMedia()
  const pathname = usePathname()

  return (
    <YStack flex={1}>
      <Settings>
        <Settings.Items>
          <Settings.Group $gtSm={{ space: '$2' }}>
            <Settings.Item
              icon={User}
              isActive={pathname === 'settings/general'}
              {...useLink({ href: media.sm ? '/settings/edit-profile' : '/settings' })}
            >
              Edit profile
            </Settings.Item>
            <Settings.Item
              icon={LockKeyhole}
              isActive={pathname === '/privacy-policy'}
              {...useLink({ href: '/privacy-policy' })}
            >
              Privacy Policy
            </Settings.Item>
            <Settings.Item
              icon={Info}
              isActive={pathname === '/terms-of-service'}
              {...useLink({ href: '/terms-of-service' })}
            >
              Terms and Policies
            </Settings.Item>
            <Settings.Item
              icon={Flag}
              isActive={pathname === '/give-feedback'}
              {...useLink({ href: '/settings/feedback-app' })}
            >
              Give Feedback
            </Settings.Item>
            <SettingsItemLogoutAction />
          </Settings.Group>
        </Settings.Items>
      </Settings>
      <Paragraph py="$2" ta="center" theme="alt2">
        {rootPackageJson.name} {packageJson.version}
      </Paragraph>
    </YStack>
  )
}

const SettingsItemLogoutAction = () => {
  const supabase = useSupabase()

  return (
    <Settings.Item icon={LogOut} onPress={() => supabase.auth.signOut()}>
      Log Out
    </Settings.Item>
  )
}
