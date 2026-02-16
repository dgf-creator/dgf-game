import { cva } from 'class-variance-authority'

const cardStyles = cva('px-3 py-2', {
  variants: {
    color: {
      0: 'border-(--block-0-border) bg-(--block-0) text-(--block-0-foreground)',
      1: 'border-(--block-1-border) bg-(--block-1) text-(--block-1-foreground)',
    },
    style: {
      'left-block': 'rounded-none border-l-2',
      rounded: 'rounded-lg',
    },
  },
})

export function Block({ children }: { children: React.ReactNode }) {
  return <div className='px-3 py-2'>{children}</div>
}
