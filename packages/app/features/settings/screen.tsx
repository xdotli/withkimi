import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia, validToken } from '@my/ui'
import { Book, Cog, Lock, Mail, Moon, Twitter, User, LockKeyhole, Info, Flag, LogOut } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { redirect } from 'app/utils/redirect'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
// @ts-ignore
import rootPackageJson from '../../../../package.json'
// @ts-ignore
import packageJson from '../../package.json'

export const SettingsScreen = () => {
  const media = useMedia()
  const pathname = usePathname()

  return (
    <YStack f={1} gap="$2" jc="space-between">
      <ScrollView>
        <Settings mt="$6">
          <Settings.Items>
            <Settings.Group $gtSm={{ space: '$2' }}>
              {/* <Settings.Item
                icon={Cog}
                isActive={pathname === '/settings' || pathname === 'settings/general'}
                {...useLink({ href: media.sm ? '/settings/general' : '/settings' })}
                accentColor="$green9"
              >
                General
              </Settings.Item> */}
              <Settings.Item
                icon={User}
                isActive={pathname === 'settings/general'}
                {...useLink({ href: media.sm ? '/settings/general' : '/settings' })}
                accentColor="$green9"
              >
                Edit profile
              </Settings.Item>
              <Settings.Item
                icon={LockKeyhole}
                isActive={pathname === '/privacy-policy'}
                {...useLink({ href: '/privacy-policy' })}
                accentColor="$purple9"
              >
                Privacy Policy
              </Settings.Item>
              <Settings.Item
                icon={Info}
                isActive={pathname === '/terms-of-service'}
                {...useLink({ href: '/terms-of-service' })}
                accentColor="$purple9"
              >
                Terms and Policies
              </Settings.Item>
              <Settings.Item
                icon={Flag}
                isActive={pathname === '/give-feedback'}
                {...useLink({ href: '//give-feedback' })}
                accentColor="$purple9"
              >
                Give Feedback
              </Settings.Item>
              <SettingsItemLogoutAction />
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </ScrollView>
      {/*
      NOTE: you should probably get the actual native version here using https://www.npmjs.com/package/react-native-version-info
      we just did a simple package.json read since we want to keep things simple for the starter
       */}
      <Paragraph py="$2" ta="center" theme="alt2">
        {rootPackageJson.name} {packageJson.version}
      </Paragraph>
    </YStack>
  )
}

const SettingsThemeAction = () => {
  const { toggle, current } = useThemeSetting()

  return (
    <Settings.Item
      icon={Moon}
      accentColor="$blue9"
      onPress={toggle}
      rightLabel={current}
    >
      Theme
    </Settings.Item>
  )
}

const SettingsItemLogoutAction = () => {
  const supabase = useSupabase()

  return (
    <Settings.Item icon={LogOut} accentColor="$red9" onPress={() => supabase.auth.signOut()}>
      Log Out
    </Settings.Item>
  )
}
