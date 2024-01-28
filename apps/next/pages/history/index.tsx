import { ChatHistoryScreen } from 'app/features/home/chat-history-screen'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from 'pages/_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Chat History</title>
      </Head>
      <ChatHistoryScreen />
    </>
  )
}

// 
// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
