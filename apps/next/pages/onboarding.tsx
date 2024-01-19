import { OnboardingScreen } from 'app/features/auth/onboarding-screen.web'
import { guestOnlyGetSSP } from 'utils/guestOnly'

/**
 * this page exists to keep it 1-1 with native
 * onboarding slides are on a separate page on mobile (/onboarding) but as sidebar on web
 */
export default function Page() {
  return <OnboardingScreen />
}

// export const getServerSideProps = guestOnlyGetSSP(async () => {
//   return {
//     redirect: {
//       destination: '/onboarding',
//       permanent: false,
//     },
//   }
// })
