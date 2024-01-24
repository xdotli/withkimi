import { StyleSheet, View, Text, Platform, Image } from 'react-native'

import * as ContextMenu from 'zeego/context-menu'
import * as DropdownMenu from 'zeego/dropdown-menu'
import React, { ComponentProps, useState } from 'react'
import { useRouter } from 'solito/router'
import { Ionicons } from '@expo/vector-icons'
import { useLink } from 'solito/link'
const select = (val: unknown) => () => alert(val)

const itemHeight = 25

const contentStyle = {
  minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  borderWidth: 1,
  borderColor: '#fff8',
  ...Platform.select({
    web: {
      animationDuration: '400ms',
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform, opacity',
      animationKeyframes: {
        '0%': { opacity: 0, transform: [{ scale: 0.5 }] },
        '100%': { opacity: 1, transform: [{ scale: 1 }] },
      },
      boxShadow:
        '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
    },
  }),
}

const dropdownStyles = StyleSheet.create({
  content: {
    ...contentStyle,
    ...Platform.select({
      web: {
        transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
      },
    }),
  },
  item: {
    borderRadius: 3,
    justifyContent: 'center',
    paddingRight: 5,
    paddingLeft: itemHeight,
    height: itemHeight,
    ...Platform.select({
      web: {
        transformOrigin: 'var(--radix-dropdown-menu-item-transform-origin)',
      },
    }),
  },
  itemWithSubtitle: {
    height: itemHeight * 2,
  },
  itemFocused: {
    // a nice background gray
    // a little darker
    backgroundColor: '#000fff30',
  },
  itemTitle: {
    fontSize: 13,
    lineHeight: 13,
  },
  itemSubtitle: {
    fontSize: 10,
    lineHeight: 10,
  },
  itemIcon: {
    marginRight: 5,
    ...StyleSheet.absoluteFillObject,
    left: 'auto',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: itemHeight,
  },
  separator: {
    backgroundColor: 'rgb(215, 207, 249)',
    height: 1,
    margin: 6,
  },
  itemIndicator: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    width: itemHeight,
    top: 0,
    bottom: 0,
  },
  itemImage: {
    width: itemHeight,
    height: 18,
    position: 'absolute',
    right: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingLeft: itemHeight,
    lineHeight: itemHeight,
    fontSize: 12,
    color: '#555',
  },
})

const contextStyles = StyleSheet.create({
  content: {
    ...contentStyle,
    ...Platform.select({
      web: {
        transformOrigin: 'var(--radix-context-menu-content-transform-origin)',
      },
    }),
    // no animations here yet, since I don't know how to style based on data-side attributes
  },
})

const DropdownMenuItem = DropdownMenu.create((props: ComponentProps<typeof DropdownMenu.Item>) => {
  const [focused, setFocused] = useState(false)
  const toggleFocus = (next: boolean) => () => setFocused(next)
  return (
    <DropdownMenu.Item
      onFocus={toggleFocus(true)}
      onBlur={toggleFocus(false)}
      {...props}
      style={[dropdownStyles.item, focused && dropdownStyles.itemFocused]}
    />
  )
}, 'Item')

const DropdownMenuCheckboxItem = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.CheckboxItem>) => {
    const [focused, setFocused] = useState(false)
    const toggleFocus = (next: boolean) => () => setFocused(next)
    return (
      <DropdownMenu.CheckboxItem
        onFocus={toggleFocus(true)}
        onBlur={toggleFocus(false)}
        {...props}
        style={[dropdownStyles.item, focused && dropdownStyles.itemFocused]}
      />
    )
  },
  'CheckboxItem'
)

const DropdownMenuItemTitle = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.ItemTitle>) => (
    <DropdownMenu.ItemTitle {...props} style={dropdownStyles.itemTitle} />
  ),
  'ItemTitle'
)

const DropdownMenuItemIndicator = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.ItemIndicator>) => (
    <DropdownMenu.ItemIndicator {...props} style={dropdownStyles.itemIndicator} />
  ),
  'ItemIndicator'
)

const DropdownMenuSeparator = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.Separator>) => (
    <DropdownMenu.Separator {...props} style={dropdownStyles.separator} />
  ),
  'Separator'
)

const DropdownMenuSubTrigger = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.SubTrigger>) => {
    const [focused, setFocused] = useState(false)
    const toggleFocus = (next: boolean) => () => setFocused(next)
    return (
      <DropdownMenu.SubTrigger
        onFocus={toggleFocus(true)}
        onBlur={toggleFocus(false)}
        {...props}
        style={[dropdownStyles.item, focused && dropdownStyles.itemFocused]}
      />
    )
  },
  'SubTrigger'
)

const DropdownMenuItemIcon = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.ItemIcon>) => (
    <DropdownMenu.ItemIcon {...props} style={dropdownStyles.itemIcon} />
  ),
  'ItemIcon'
)

const DropdownMenuItemImage = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.ItemImage>) => (
    <DropdownMenu.ItemImage {...props} style={dropdownStyles.itemImage} />
  ),
  'ItemImage'
)

const DropdownMenuLabel = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.Label>) => (
    <DropdownMenu.Label {...props} style={dropdownStyles.label} />
  ),
  'ItemImage'
)

const DropdownMenuArrow = DropdownMenu.create(
  (props: ComponentProps<typeof DropdownMenu.Arrow>) => (
    <DropdownMenu.Arrow {...props} style={{ fill: '#fff' }} />
  ),
  'Arrow'
)

export const DropdownMenuExample = () => {
  const router = useRouter()
  const [arrowEnabled, setArrowEnabled] = useState<'on' | 'off' | 'mixed'>('off')
  const [bookmarked, setBookmarked] = useState<'on' | 'off' | 'mixed'>('on')
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View>
          <Text style={styles.button}>For you</Text>
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content style={dropdownStyles.content}>
        <DropdownMenuLabel>Help</DropdownMenuLabel>

        {['For you', 'Following'].map((i) => (
          i === 'Following' ? (
              <DropdownMenuItem key={`list-${i}`} onSelect={() => router.push('/following/home')}>
                <DropdownMenuItemTitle>{`${i}`}</DropdownMenuItemTitle>
              </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={`list-${i}`}>
              <DropdownMenuItemTitle>{`${i}`}</DropdownMenuItemTitle>
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const ContextMenuExample = () => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <View style={styles.box}>
          <Text>{'<ContextMenu />'}</Text>
        </View>
      </ContextMenu.Trigger>
      <ContextMenu.Content style={contextStyles.content}>
        <ContextMenu.Preview>
          {() => <View style={{ height: 300, width: 300, backgroundColor: 'black' }} />}
        </ContextMenu.Preview>

        <ContextMenu.Item
          style={[dropdownStyles.item, dropdownStyles.itemWithSubtitle]}
          onSelect={select(1)}
          key="fernando"
        >
          <ContextMenu.ItemTitle>@FernandoTheRojo</ContextMenu.ItemTitle>
          <ContextMenu.ItemSubtitle>Creator of Zeego</ContextMenu.ItemSubtitle>

          {/* <ContextMenu.ItemImage source={require('./fernando.jpg')} /> */}
        </ContextMenu.Item>

        <ContextMenu.Item
          style={[dropdownStyles.item, dropdownStyles.itemWithSubtitle]}
          onSelect={select(1)}
          key="first"
        >
          <ContextMenu.ItemTitle>Action #1</ContextMenu.ItemTitle>
          <ContextMenu.ItemSubtitle>Hey!</ContextMenu.ItemSubtitle>

          {/* <ContextMenu.ItemImage source={require('./camera-outline.png')} /> */}
        </ContextMenu.Item>
        <ContextMenu.Item style={dropdownStyles.item} onSelect={select(2)} key="second">
          <ContextMenu.ItemIcon iosIconName="star" />
          <ContextMenu.ItemTitle>Action #2</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item style={dropdownStyles.item} onSelect={select(3)} key="third">
          <ContextMenu.ItemTitle>Action #3</ContextMenu.ItemTitle>
        </ContextMenu.Item>

        <ContextMenu.Group>
          <ContextMenu.Item style={dropdownStyles.item} key="group-1">
            Group Item 1
          </ContextMenu.Item>
          <ContextMenu.Item style={dropdownStyles.item} key="group-2">
            Group Item 2
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item style={dropdownStyles.item} key="group-3">
            Group Item 3
          </ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <DropdownMenuExample />
      <View style={{ height: 30 }} />
      <ContextMenuExample />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9c1aff',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 8,
    marginLeft: 10,
  },
})
