// import { EnterPhoneScreen } from 'app/features/auth/enter-phone-screen.web'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Enter Phone</title>
      </Head>
      {/* <EnterPhoneScreen /> */}
    </>
  )
}

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

// export const getServerSideProps = userProtectedGetSSP()

export default Page
