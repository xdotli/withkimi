import { H4, YStack, XStack, Spinner, SubmitButton, Text, Button, Label, useToastController } from '@my/ui'
import { Back } from '@my/ui/src/icons/back'
import DatePicker from '@react-native-community/datetimepicker'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'solito/router'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { z } from 'zod'

const pronounsItems = [
  { name: 'Secret' },
  { name: 'She/Her' },
  { name: 'She/They' },
  { name: 'He/Him' },
  { name: 'He/They' },
  { name: 'They/Them' },
  { name: 'He/She' },
  { name: 'He/She/They' },
]

type phoneCodeInfo = {
  name: string
  flag: string
  area: string
}

const phoneCodes: phoneCodeInfo[] = [
  { name: '+1', flag: '🇺🇸', area: 'United States' },
  { name: '+61', flag: '🇦🇺', area: 'Australia' },
  { name: '+55', flag: '🇧🇷', area: 'Brazil' },
  { name: '+1', flag: '🇨🇦', area: 'Canada' },
  { name: '+86', flag: '🇨🇳', area: 'China' },
  { name: '+91', flag: '🇮🇳', area: 'India' },
  { name: '+62', flag: '🇮🇩', area: 'Indonesia' },
  { name: '+81', flag: '🇯🇵', area: 'Japan' },
  { name: '+60', flag: '🇲🇾', area: 'Malaysia' },
  { name: '+52', flag: '🇲🇽', area: 'Mexico' },
  { name: '+234', flag: '🇳🇬', area: 'Nigeria' },
  { name: '+92', flag: '🇵🇰', area: 'Pakistan' },
  { name: '+63', flag: '🇵🇭', area: 'Philippines' },
  { name: '+7', flag: '🇷🇺', area: 'Russia' },
  { name: '+65', flag: '🇸🇬', area: 'Singapore' },
  { name: '+82', flag: '🇰🇷', area: 'South Korea' },
  { name: '+886', flag: '🇹🇼', area: 'Taiwan' },
  { name: '+44', flag: '🇬🇧', area: 'United Kingdom' },
]

const getValue = (item: phoneCodeInfo) => {
  return `${item.flag} ${item.name}`
}

const getName = (item: phoneCodeInfo) => {
  return `${item.flag} ${item.area} (${item.name})`
}

const profileEditSchema = z.object({
  name: formFields.text.min(3).max(25).describe('Name // Enter your name'),
  phone: formFields.text.min(5).max(22).describe('Phone Number // xxx xxx xxxx'),
  countryCode: formFields.select.describe('Country Code'),
  pronouns: formFields.select.describe('Pronouns'),
  interests: formFields.text.max(50).describe('Interests // Tell us a bit about yourself'),
  occupation: formFields.text.max(50).describe('Occupation // Tell us a bit about yourself'),
})

export const EditProfileScreen = () => {
  const supabase = useSupabase()
  const { user } = useUser()
  const toast = useToastController()

  const [id, setId] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [countryCode, setCountryCode] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  const [pronouns, setPronouns] = useState<string>('Secret')
  const [interests, setInterests] = useState<string>('')
  const [occupation, setOccupation] = useState<string>('')

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Your function to fetch data
    fetchData()
      .then(data => {
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        toast.show('Fail to fetch profile')
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading to false if there's an error
      });
  }, []);

  const fetchData = async () => {
    if(user){
      const userId = user.id
      setId(userId)

      let { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)

      if (profiles && profiles.length > 0) {
        setName(profiles[0].name ?? '')
        setBirthday(profiles[0].birthday  ?? new Date())
        setPronouns(profiles[0].pronoun  ?? 'Secret')
        setInterests(profiles[0].interests  ?? '')
        setOccupation(profiles[0].occupation  ?? '')

      }
      
      if(user.phone){
        const phone = user.phone
        const phoneNumber = phone.substring(phone.length - 10)
        const phoneCode = phone.substring(0, phone.length - 10)
        setPhone(phoneNumber)
        setCountryCode(phoneCode)
      }
    }
  }

  if(!isLoading){
    return <EditProfileForm userId={id} name={name} phone={phone} phoneCode={countryCode} birthday={birthday} pronouns={pronouns} interests={interests} occupation={occupation}  />
  }
}

const EditProfileForm = ({
  name,
  phone,
  phoneCode,
  birthday,
  pronouns,
  interests,
  occupation,
  userId,
}: {
  name: string
  phone: string
  phoneCode: string
  birthday: string
  pronouns: string
  interests: string
  occupation: string
  userId: string
}) => {
  const supabase = useSupabase()
  const router = useRouter()
  const [dob, setDob] = useState(new Date(birthday))
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const formSaveProfile = useForm<z.infer<typeof profileEditSchema>>()
  const toast = useToastController()

  // setDob(new Date(birthday))
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setDob(currentDate)
  }

  async function onSaveProfile({
    name,
    phone,
    countryCode,
    pronouns,
    interests,
    occupation,
  }: z.infer<typeof profileEditSchema>) {

    const { data, error } = await supabase
      .from('profiles')
      .update({ name: name, birthday: dob.toISOString(), pronoun: pronouns, interests: interests, occupation: occupation })
      .eq('id', userId)
      .select()

    if(error){
      toast.show('Fail to update')
    }else{
      toast.show('Successfully updated!')
      router.back()
    }
  }

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return (
    <FormProvider {...formSaveProfile}>
      <SchemaForm
        form={formSaveProfile}
        schema={profileEditSchema}
        defaultValues={{
          name: name,
          phone: phone,
          countryCode: '+' + phoneCode,
          pronouns: pronouns,
          interests: interests,
          occupation: occupation,
        }}
        onSubmit={onSaveProfile}
        props={
          {
            name: {},
            phone: {},
            countryCode: {
              options: phoneCodes.map((item) => ({
                name: getName(item),
                value: getValue(item),
              })),
              triggerDisplay: 'value',
              triggerWidth: 120,
              native: true,
            },
            pronouns: {
              options: pronounsItems.map((item) => ({
                name: item.name,
                value: item.name,
              })),
              triggerWidth: '100%',
              native: true,
            },
            interests: {},
            occupation: {},
          } as const
        }
        renderAfter={({ submit }) => {
          return (
            <>
              <SubmitButton
                icon={status === 'submitting' ? () => <Spinner color="white" /> : undefined}
                borderRadius="$10"
                onPress={() => submit()}
                backgroundColor="#A191DA"
              >
                <Text color="white">Save Changes</Text>
              </SubmitButton>
            </>
          )
        }}
      >
        {(fields) => (
          <>
            <YStack flex={1}>
              <H4>Basic Info</H4>
              {Object.values(fields.name.props)}
              {Object.values(fields.phone.props)}
              {Object.values(fields.countryCode.props)}

              <Label htmlFor="dob" color="$gray11" fontWeight="300">
                Date of Birth
              </Label>
              <XStack
                flex={1}
                borderRadius={8}
                alignItems="center"
                borderWidth={1}
                borderColor="$gray4"
                backgroundColor="$background"
              >
                <Text color="$color" style={{ paddingLeft: 15, width: '50%' }}>
                  {dob.toDateString()}
                </Text>
                <DatePicker style={{ width: '50%' }} value={dob} onChange={onChange} />
              </XStack>

              {Object.values(fields.pronouns.props)}

              <H4 paddingTop="$4">Other Info (Optional)</H4>

              {Object.values(fields.occupation.props)}

              {Object.values(fields.interests.props)}
            </YStack>
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}