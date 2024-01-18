import { Link as SolitoLink, LinkProps as SolitoLinkProps } from 'solito/link'
import { SizableText, TextProps } from 'tamagui'

export type LinkProps = Omit<SolitoLinkProps, 'passHref' | 'as' | 'color'> &
  TextProps & {
    target?: string
    rel?: string
    title?: string
  }

export const Link = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: LinkProps) => {
  const linkProps = { href, replace, scroll, shallow, prefetch, locale }
  return (
    <SolitoLink {...linkProps}>
      <SizableText tag="div" {...props}>
        {children}
      </SizableText>
    </SolitoLink>
  )
}
