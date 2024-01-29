// import { ChatHistoryScreen } from 'app/features/home/chat-history-screen'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Chat History</title>
      </Head>
      {/* <ChatHistoryScreen /> */}
    </>
  )
}

//
// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
