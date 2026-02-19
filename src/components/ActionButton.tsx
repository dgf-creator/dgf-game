import { rootState } from '@/state/root'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'my-1 rounded border-2 border-solid px-2 transition-all duration-200 hover:brightness-125 active:brightness-75 active:transition-none',
  {
    variants: {
      color: {
        0: 'border-[#ffb6d9] bg-[#fff0f5] text-[#c2185b]',
        1: 'border-[#d8b4fe] bg-[#f3e8ff] text-[#7c3aed]',
        2: 'border-[#fcd34d] bg-[#fef3c7] text-[#b45309]',
        3: 'border-[#6ee7b7] bg-[#d1fae5] text-[#047857]',
        4: 'border-[#93c5fd] bg-[#dbeafe] text-[#1e40af]',
      },
      rotate: {
        0: '-rotate-2 hover:rotate-[0.5deg]',
        1: 'rotate-[0.5deg] hover:-rotate-[1.5deg]',
        2: '-rotate-[1.5deg] hover:-rotate-1',
        3: '-rotate-1 hover:rotate-0',
        4: 'rotate-0 hover:rotate-[1.5deg]',
        5: 'rotate-[1.5deg] hover:-rotate-[0.5deg]',
        6: '-rotate-[0.5deg] hover:rotate-2',
        7: 'rotate-2 hover:-rotate-1',
        8: '-rotate-1 hover:-rotate-2',
      },
    },
  }
)

const maxColor = 5
const maxRotate = 9

type Props = Omit<React.ComponentProps<'button'>, 'children'> & {
  linkTo?: PassageModule
  children: string
}

const generateHash = (val: string) => {
  let hash = 0
  for (const char of val) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0 // Constrain to 32bit integer
  }
  return Math.abs(hash)
}
export function ActionButton({ linkTo, children, className, onClick, ...rest }: Props) {
  const hash = generateHash(children)

  const handleClick =
    onClick ??
    ((ev: React.MouseEvent<HTMLButtonElement>) => {
      if (linkTo) {
        ev.preventDefault()
        rootState.newFrame(linkTo)
      }
    })

  return (
    <button
      className={buttonVariants({
        color: (hash % maxColor) as 0,
        rotate: (hash % maxRotate) as 0,
        className,
      })}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  )
}
