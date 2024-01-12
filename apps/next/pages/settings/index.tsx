import { HomeLayout } from 'app/features/home/layout.web'
import { GeneralSettingsScreen } from 'app/features/settings/general-screen'
import { SettingsLayout } from 'app/features/settings/layout.web'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <GeneralSettingsScreen />
    </>
  )
}

Page.getLayout = (page) => (
  <HomeLayout fullPage>
    <SettingsLayout isSettingsHome>{page}</SettingsLayout>
  </HomeLayout>
)

export const getServerSideProps = userProtectedGetSSP()

export default Page
