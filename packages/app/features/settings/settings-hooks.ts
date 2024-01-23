import { createParam } from 'solito'

type ProfileSettings = {
  name: string
  phone: string
  countryCode: string
  pronouns: string
  interests: string
  occupation: string
}

const { useParam } = createParam<ProfileSettings>()

export const useName = () => {
  const [name, setName] = useParam('name')
  return {
    name,
    setName,
  }
}

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

export const usePronouns = () => {
  const [pronouns, setPronouns] = useParam('pronouns')
  return {
    pronouns,
    setPronouns,
  }
}

export const useInterests = () => {
  const [interests, setInterests] = useParam('interests')
  return {
    interests,
    setInterests,
  }
}

export const useOccupation = () => {
  const [occupation, setOccupation] = useParam('occupation')
  return {
    occupation,
    setOccupation,
  }
}

export const useProfileSettingsParams = () => {
  const [name] = useParam('name')
  const [phone] = useParam('phone')
  const [countryCode] = useParam('countryCode')
  const [pronouns] = useParam('pronouns')
  const [interests] = useParam('interests')
  const [occupation] = useParam('occupation')

  return {
    name,
    phone,
    countryCode,
    pronouns,
    interests,
    occupation,
  }
}
