// import { EditProfileScreen } from 'app/features/settings/edit-profile-screen'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      {/* <EditProfileScreen /> */}
    </>
  )
}

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
