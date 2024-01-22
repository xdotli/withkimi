import { EnterOtpScreen } from 'app/features/auth/enter-otp-screen'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from 'pages/_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Enter Otp</title>
      </Head>
      <EnterOtpScreen />
    </>
  )
}

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

// export const getServerSideProps = userProtectedGetSSP()

export default Page
