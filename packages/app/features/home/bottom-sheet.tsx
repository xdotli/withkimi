import { Button, Text, YStack, XStack, Avatar, Sheet, H2, Tabs, Separator, SizableText, TabsContentProps } from '@my/ui'
import { PenLine } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { FlashList } from '@shopify/flash-list'

interface BottomSheetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const memoryData = [
  {
    title: 'Event 01',
    content:
      'There was a conversation between Fan Qixin and A Ling, and Fang Qixin, Tell Ling that the mission is dangerous + but not injured',
    chat: 3,
    use: 1,
  },
  {
    title: 'Event 02',
    content:
      'There was a conversation between AAA and BBB, and CCC, Tell Ling that the mission is dangerous but not injured',
    chat: 5,
    use: 2,
  },
  {
    title: 'Event 03',
    content: 'Tell Ling that the mission is dangerous but not injured',
    chat: 1,
    use: 1,
  },
]

export const BottomSheet: React.FC<BottomSheetProps> = ({ open, setOpen }) => {
  const [position, setPosition] = useState(0)
  const snapPoints = [68, 50, 40]

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      snapPointsMode={'percent'}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      {/* <Sheet.Handle /> */}
      <Sheet.Frame padding="$2" justifyContent="center" alignItems="center" space="$5">
        <Sheet.ScrollView>
          <YStack p="$5" gap="$8">
            <XStack flex={1} space="$5">
              <Avatar circular size={100} borderColor="white" borderWidth={2}>
                <Avatar.Image
                  resizeMode="contain"
                  width={98}
                  height={98}
                  source={{ uri: require('packages/app/assets/greetings.png') }}
                />
              </Avatar>
              <H2 alignSelf='flex-start'>Nekomi</H2>
              <Button 
                alignSelf='flex-end' 
                width="$10"
                height="$3"
                borderRadius="$12"
                backgroundColor="#D2CCE9"
                fontSize="$1"
                fontWeight="$8"
                color="#6F6C8F"
              >
                  Follow
              </Button>
            </XStack>
            <HorizontalTabs/>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

const HorizontalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width={'100%'}
    >
      <Tabs.List
        separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
      >
        <Tabs.Tab flex={1} value="tab1" unstyled={true}>
          <SizableText fontFamily="$body" color="#7A59ED" fontWeight="$6">Info.</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2" unstyled={true}>
          <SizableText fontFamily="$body" color="#7A59ED" fontWeight="$6">Memory</SizableText>
        </Tabs.Tab>
      </Tabs.List>

      <InfoTabContent value="tab1"/>

      <MemoryTabContent value="tab2"/>
    </Tabs>
  )
}

const InfoTabContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor='rgba(161, 145, 218, 0.35)'
      key="tab1"
      paddingTop="$2"
      paddingBottom="$2"
      paddingLeft="$4"
      paddingRight="$4"
      flex={1}
      borderRadius="$6"
      height={500}
      {...props}
    >
      <YStack flex={1}>
        <Text paddingBottom="$4">Background Information</Text>
        <YStack
          backgroundColor='rgba(161, 145, 218, 0.35)'
          flex={1}
          borderRadius="$4"
          marginBottom="$4"
          padding="$4"
        >
          <Text>Hi I am Nekomi</Text>
        </YStack>
      </YStack>

      {props.children}
    </Tabs.Content>
  )
}

const MemoryTabContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor='rgba(161, 145, 218, 0.35)'
      key="tab1"
      paddingTop="$2"
      paddingBottom="$2"
      paddingLeft="$4"
      paddingRight="$4"
      flex={1}
      borderRadius="$6"
      height={500}
      {...props}
    >
      <YStack flex={1}>
        <Text paddingBottom="$4">Memory</Text>
        <MemoryList/>
      </YStack>

      {props.children}
    </Tabs.Content>
  )
}

const MemoryList = () => {
  return (
    <FlashList
      data={memoryData}
      renderItem={
        ({ item }) => 
          <YStack
            backgroundColor='rgba(161, 145, 218, 0.35)'
            flex={1}
            borderRadius="$4"
            marginBottom="$4"
            padding="$4"
          >
            <PenLine size={28} color='black' style={{position: 'absolute', top: 10, right: 10}}/>
            <Text fontSize="$6" fontWeight="$10" paddingBottom="$4">{item.title}</Text>
            <Text fontSize="$3" paddingBottom="$4">{item.content}</Text>
            <Text fontSize="$1" paddingBottom="$2">{item.chat} chats | {item.use} use</Text>
            <Button
              alignSelf='flex-end' 
              width="$10"
              height="$3"
              borderRadius="$12"
              backgroundColor="#D2CCE9"
              fontSize="$1"
              fontWeight="$8"
              color="#6F6C8F"
              style={{position: 'absolute', bottom: 10, right: 10}}
            >
              Select
            </Button>
          </YStack>
        }
      estimatedItemSize={200}
    />
  )
}
