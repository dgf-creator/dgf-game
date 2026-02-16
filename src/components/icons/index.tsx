import lottie, { type AnimationEvents, type AnimationItem } from 'lottie-web'
import { type ComponentProps, useEffect, useRef } from 'react'
import { icons } from './lottie'

export type IconName = keyof typeof icons
export type IconPosition<TIcon extends IconName> = keyof (typeof icons)[TIcon]['positions']

export type IconDetails<TIcon extends IconName> = {
  icon: TIcon
  animation: AnimationItem | null
  animateTo: (position: IconPosition<TIcon>, pastEnd?: boolean) => Promise<void>
  goToAndStop: (position: IconPosition<TIcon>) => void
  loopFullAnimation: () => void
  playOnce: () => Promise<void>
}

export type Props<TIcon extends IconName> = Omit<ComponentProps<'div'>, 'ref'> & {
  ref?: React.Ref<IconDetails<TIcon>>
  icon: TIcon
  className?: string
  loop?: boolean
  playing?: boolean
  speed?: number
  defaultPosition?: IconPosition<TIcon>
  onComplete?: (animation: AnimationEvents['complete']) => void
}

function getRealFrame(currentFrame: number, segments: [number, number] | [number, number][] | undefined) {
  if (!segments) return currentFrame

  const segmentsCopy =
    typeof segments[0] === 'number' ? [segments as [number, number]] : [...(segments as [number, number][])]
  if (segmentsCopy.length === 0) return currentFrame

  let remaining = currentFrame
  let realFrame = segmentsCopy[0][0] ?? 0
  while (remaining >= 0 && segmentsCopy.length > 0) {
    const [start, end] = segmentsCopy[0]
    const segmentLength = end - start
    const direction = segmentLength >= 0 ? 1 : -1
    if (remaining <= Math.abs(segmentLength)) {
      return start + remaining * direction
    } else {
      remaining -= Math.abs(segmentLength)
      realFrame = end
      segmentsCopy.shift()
    }
  }

  return realFrame
}

export function AnimatedIcon<TIcon extends IconName>({
  ref,
  icon,
  className = '',
  loop = false,
  playing = false,
  speed = 1,
  defaultPosition,
  onComplete,
  ...rest
}: Props<TIcon>) {
  const animationRef = useRef<AnimationItem | null>(null)
  const lastFrameRef = useRef<number>(
    defaultPosition !== undefined ? icons[icon as 'book'].positions[defaultPosition as IconPosition<'book'>] : 0
  )
  const lastSegmentsRef = useRef<[number, number] | null>(null)

  const containerRefCb = (el: HTMLDivElement | null) => {
    if (!el) return

    if (animationRef.current) {
      animationRef.current.destroy()
    }

    animationRef.current = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop,
      autoplay: playing,
      animationData: icons[icon].data,
    })

    if (defaultPosition !== undefined) {
      const defaultFrame = icons[icon as 'book'].positions[defaultPosition as IconPosition<'book'>]
      animationRef.current.goToAndStop(defaultFrame, true)
    }

    animationRef.current.addEventListener('segmentStart', ({ firstFrame, totalFrames }) => {
      lastSegmentsRef.current = [firstFrame, firstFrame + totalFrames - 1]
    })

    animationRef.current.addEventListener('enterFrame', ({ currentTime }) => {
      const realFrame = getRealFrame(currentTime, lastSegmentsRef.current ?? undefined)
      lastFrameRef.current = realFrame
    })

    animationRef.current.setSpeed(speed)
    if (onComplete) {
      animationRef.current.addEventListener('complete', onComplete)
    }
  }

  useEffect(() => {
    if (!animationRef.current) return

    if (playing) {
      animationRef.current.play()
    } else {
      animationRef.current.pause()
    }
  }, [playing])

  useEffect(() => {
    if (!animationRef.current) return

    animationRef.current.setLoop(loop)
  }, [loop])

  useEffect(() => {
    if (animationRef.current && onComplete) {
      animationRef.current.addEventListener('complete', onComplete)
    }

    return () => {
      if (!animationRef.current) return
      animationRef.current.removeEventListener('complete', onComplete)
    }
  }, [onComplete])

  useEffect(() => {
    if (!animationRef.current) return

    animationRef.current.setSpeed(speed)
  }, [animationRef, speed])

  useEffect(() => {
    if (!ref) return

    let resolves: (() => void)[] = []

    let callbacksInitialized = false

    function onComplete() {
      resolves.forEach((resolve) => resolve())
      resolves = []
    }

    function registerCallbacks() {
      if (callbacksInitialized) return
      animationRef.current?.addEventListener('complete', onComplete)
      callbacksInitialized = true
    }

    if (animationRef.current) {
      registerCallbacks()
    }

    const details: IconDetails<TIcon> = {
      icon,
      get animation() {
        return animationRef.current
      },
      animateTo(position, pastEnd) {
        return new Promise<void>((resolve) => {
          if (!animationRef.current) return resolve()

          const frameTo = icons[icon as 'book'].positions[position as IconPosition<'book'>]

          if (frameTo === undefined) return
          const end = icons[icon].frameCount - 1

          const segments = (
            pastEnd && frameTo <= lastFrameRef.current
              ? [
                  [lastFrameRef.current, end],
                  [0, frameTo],
                ]
              : [[lastFrameRef.current, frameTo]]
          ) as [number, number][]

          resolves.push(resolve)
          animationRef.current.playSegments(segments, true)
          registerCallbacks()
        })
      },
      goToAndStop(position) {
        if (!animationRef.current) return

        const frameTo = icons[icon as 'book'].positions[position as IconPosition<'book'>]

        if (frameTo === undefined) return

        animationRef.current.goToAndStop(frameTo, true)
      },
      loopFullAnimation() {
        if (!animationRef.current) return

        animationRef.current.resetSegments(true)
        animationRef.current.setLoop(true)
        animationRef.current.play()
      },
      playOnce() {
        return new Promise<void>((resolve) => {
          if (!animationRef.current) return resolve()

          resolves.push(resolve)
          if (animationRef.current.isPaused) {
            animationRef.current.playSegments([0, icons[icon].frameCount - 1], true)
          }
          registerCallbacks()
        })
      },
    }

    if (typeof ref === 'function') {
      ref(details)

      return () => {
        ref(null)
      }
    } else {
      ;(ref as React.RefObject<IconDetails<TIcon> | null>).current = details
      return () => {
        ;(ref as React.RefObject<IconDetails<TIcon> | null>).current = null
      }
    }
  }, [ref, icon])

  return <div ref={containerRefCb} className={`lottie-icon ${className}`} {...rest} />
}
