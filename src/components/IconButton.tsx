import { useCallback, useEffect, useRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatedIcon, type IconDetails, type IconName, type IconPosition } from './icons'

const firstRenderCount = import.meta.env.DEV ? 2 : 1

const buttonVariants = cva(
  'inline-flex flex-row items-center justify-center rounded-xl body-font transition-all duration-200 hover:brightness-125 active:brightness-75 active:transition-none',
  {
    variants: {
      color: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        muted: 'bg-muted text-muted-foreground',
      },
      size: {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
      },
      disabled: {
        false: null,
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'medium',
      disabled: false,
    },
  }
)

const iconVariants = cva('h-[1.5em] w-[1.5em]', {
  variants: {
    position: {
      left: 'mr-[0.5em]',
      right: 'ml-[0.5em]',
    },
  },
})

type Variants = VariantProps<typeof buttonVariants>

type Props<TIcon extends IconName> = React.ComponentProps<'button'> & {
  icon: TIcon
  iconSpeed?: number
  iconPosition?: 'left' | 'right'
  defaultIconState: IconPosition<TIcon> | 'loop' | 'play'
  hoverIconState: IconPosition<TIcon> | 'loop' | 'play'
  activeIconState?: IconPosition<TIcon> | 'loop' | 'play'
  loopStates?: boolean
  color?: Variants['color']
  size?: Variants['size']
  disabled?: boolean
}

export function IconButton<TIcon extends IconName>({
  icon,
  iconSpeed = 1,
  iconPosition = 'left',
  defaultIconState,
  hoverIconState,
  activeIconState,
  loopStates = false,
  color,
  size,
  disabled,
  className,
  children,
  onClick,
  ...rest
}: Props<TIcon>) {
  const iconDetails = useRef<IconDetails<TIcon>>(null)
  const [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const waitRenderCount = useRef(firstRenderCount)

  const iconElement = (
    <AnimatedIcon
      ref={iconDetails}
      icon={icon}
      speed={iconSpeed}
      className={iconVariants({ position: iconPosition })}
      loop={defaultIconState === 'loop'}
      playing={defaultIconState === 'play' || defaultIconState === 'loop'}
      defaultPosition={defaultIconState === 'play' || defaultIconState === 'loop' ? undefined : defaultIconState}
    />
  )

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

  const setHoverState = useCallback(() => iconEventHandler(hoverIconState), [iconEventHandler, hoverIconState])
  const setDefaultState = useCallback(() => iconEventHandler(defaultIconState), [iconEventHandler, defaultIconState])
  const handleActiveState = useCallback(() => {
    setIsActive(true)

    document.addEventListener(
      'mouseup',
      () => {
        setIsActive(false)
      },
      { once: true }
    )
  }, [])

  useEffect(() => {
    if (waitRenderCount.current > 0) {
      waitRenderCount.current -= 1
      return
    }
    if (disabled) {
      setDefaultState()
    } else if (isActive && activeIconState) {
      iconEventHandler(activeIconState)
    } else if (isHovered) {
      setHoverState()
    } else {
      setDefaultState()
    }
  }, [setDefaultState, disabled, isActive, activeIconState, isHovered, iconEventHandler, setHoverState])

  return (
    <button
      className={buttonVariants({ color, size, disabled, className })}
      {...rest}
      onClick={onClick}
      onMouseEnter={() => {
        if (!isActive) setHoverState()
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        if (!isActive) setDefaultState()
        setIsHovered(false)
      }}
      onMouseDown={handleActiveState}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  )
}
