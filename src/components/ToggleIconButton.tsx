import { useCallback, useEffect, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatedIcon, type IconDetails, type IconName, type IconPosition } from './icons'

const firstRenderCount = import.meta.env.DEV ? 2 : 1

const buttonVariants = cva(
  'inline-flex items-center justify-center bg-transparent p-0 transition-all duration-200 hover:brightness-125 active:brightness-75 active:transition-none',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        xLarge: 'text-xl',
      },
      disabled: {
        false: null,
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      size: 'medium',
      disabled: false,
    },
  }
)

type Variants = VariantProps<typeof buttonVariants>

type Props<TIcon extends IconName> = Omit<React.ComponentProps<'button'>, 'children' | 'onToggle'> & {
  icon: TIcon
  on: boolean
  iconSpeed?: number
  defaultIconState: IconPosition<TIcon> | 'loop' | 'play'
  toggledIconState: IconPosition<TIcon> | 'loop' | 'play'
  loopStates?: boolean
  size?: Variants['size']
  disabled?: boolean
  onToggle?: (on: boolean) => void
}

export function ToggleIconButton<TIcon extends IconName>({
  icon,
  on,
  iconSpeed = 1,
  defaultIconState,
  toggledIconState,
  loopStates = false,
  size,
  disabled,
  className,
  onToggle,
  onClick,
  ...rest
}: Props<TIcon>) {
  const iconDetails = useRef<IconDetails<TIcon>>(null)
  const waitRenderCount = useRef(firstRenderCount)

  const iconEventHandler = useCallback(
    (position: IconPosition<TIcon> | 'loop' | 'play' | undefined, extra?: () => void) => {
      if (!position) return
      if (position === 'loop') {
        iconDetails.current?.loopFullAnimation()
        return
      } else if (position === 'play') {
        iconDetails.current?.playOnce()
        return
      }

      iconDetails.current?.animateTo(position, loopStates)
      extra?.()
    },
    [loopStates]
  )

  useEffect(() => {
    if (waitRenderCount.current > 0) {
      waitRenderCount.current -= 1
      return
    }

    if (on) {
      iconEventHandler(toggledIconState)
    } else {
      iconEventHandler(defaultIconState)
    }
  }, [on, iconEventHandler, defaultIconState, toggledIconState])

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onToggle?.(!on)
      onClick?.(ev)
    },
    [onToggle, onClick, disabled, on]
  )

  return (
    <button className={buttonVariants({ size, disabled, className })} {...rest} onClick={handleClick}>
      <AnimatedIcon
        ref={iconDetails}
        className='size-[1em]'
        icon={icon}
        speed={iconSpeed}
        loop={defaultIconState === 'loop'}
        playing={defaultIconState === 'play' || defaultIconState === 'loop'}
        defaultPosition={defaultIconState === 'play' || defaultIconState === 'loop' ? undefined : defaultIconState}
      />
    </button>
  )
}
