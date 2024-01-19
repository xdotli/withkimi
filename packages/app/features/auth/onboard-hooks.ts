import { createParam } from 'solito'

type PhoneAuth = {
  phone: string
  countryCode: string
  otp: string
}

const { useParam } = createParam<PhoneAuth>()

export const usePhone = () => {
  const [phone, setPhone] = useParam('phone')
  return {
    phone,
    setPhone,
  }
}

export const useCountryCode = () => {
  const [countryCode, setCountryCode] = useParam('countryCode')
  return {
    countryCode,
    setCountryCode,
  }
}

export const useOtp = () => {
  const [otp, setOtp] = useParam('otp')
  return {
    otp,
    setOtp,
  }
}

export const useOnboardScreenParams = () => {
  const [countryCode] = useParam('countryCode')
  const [phone] = useParam('phone')
  const [otp] = useParam('otp')
  return {
    countryCode,
    phone,
    otp,
  }
}
