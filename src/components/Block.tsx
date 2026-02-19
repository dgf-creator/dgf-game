import { cva, type VariantProps } from 'class-variance-authority'

const cardStyles = cva('my-1 block px-3 py-2', {
  variants: {
    color: {
      blue: 'border-(--block-blue-border) bg-(--block-blue) text-(--block-blue-foreground)',
      pink: 'border-(--block-pink-border) bg-(--block-pink) text-(--block-pink-foreground)',
      purple: 'border-(--block-purple-border) bg-(--block-purple) text-(--block-purple-foreground)',
    },
    style: {
      'left-block': 'rounded-none border-l-2',
      rounded: 'rounded-lg',
    },
  },
  defaultVariants: {
    color: 'pink',
    style: 'rounded',
  },
})

type Variants = VariantProps<typeof cardStyles>

type Props = React.ComponentProps<'span'> & {
  color?: Variants['color']
  style?: Variants['style']
}

export function Block({ color, style, children, className, ...rest }: Props) {
  return (
    <span className={cardStyles({ color, style, className })} {...rest}>
      {children}
    </span>
  )
}
