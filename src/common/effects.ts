import { rootState } from '@/state/root'
import { type Stat } from './stats'

export const effects = ['acid', 'deflowered', 'heat'] as const

export type Effect = (typeof effects)[number]

export const drugs = ['acid'] as const satisfies Effect[]
export type Drug = (typeof drugs)[number]

export type EffectOptions = {
  startTime: number
  timeSinceStart: number

  endTime: number | null
  timeRemaining: number | null
  totalDuration: number | null

  strength: number
}

export type EffectTickOptions = EffectOptions & {
  deltaTime: number
}

export type EffectTickResult = {
  strength?: number
  endTime?: number
  done?: boolean
}

export type EffectModifiers = Partial<Record<Stat, number>>

export type EffectDetails = {
  name: string
  description: string
  actionDescription?: string
  defaultDuration?: number
  defaultStrength?: number
  onTimeChange?: (opts: EffectTickOptions) => void | EffectTickResult
  getModifiers?: (opts: EffectOptions) => EffectModifiers
}

export const effectDetails: Record<Effect, EffectDetails> = {
  acid: {
    name: 'Dropped acid',
    description: 'You took a tab of acid',
    actionDescription: 'Drop acid',
    defaultDuration: 12 * 60 * 60,
    onTimeChange({ deltaTime, timeSinceStart, timeRemaining, totalDuration, strength }) {
      const pc = rootState.currentFrame.pc
      const hours = deltaTime / (60 * 60)
      const waitPeriod = 30 * 60 // time before you start to feel it
      const maximum = 2 * 60 * 60 // time at which the effects are strongest

      const ramp = (() => {
        if (timeSinceStart < waitPeriod) return 0
        if (timeSinceStart <= maximum) return Math.pow((timeSinceStart - waitPeriod) / (maximum - waitPeriod), 0.1)
        const root = timeRemaining! / (totalDuration! - maximum)
        const res = Math.pow(root, 4)
        console.log({ root, res })
        return res
      })()

      pc.high += (40 * strength * hours * ramp) / pc.drugResistanceFactor
    },
  },
  deflowered: {
    name: 'Lost virginity',
    description: 'You recently had your hymen torn',
    defaultDuration: 12 * 60 * 60,
  },
  heat: {
    name: 'Feeling warm',
    description: 'You are feeling hot under the collar',
    defaultDuration: 48 * 60 * 60,
    onTimeChange({ deltaTime, timeRemaining, totalDuration, strength }) {
      timeRemaining ??= 1
      totalDuration ??= 1

      const pc = rootState.currentFrame.pc
      const hours = deltaTime / (60 * 60)

      pc.horniness += (hours * strength * (timeRemaining / totalDuration)) / pc.willpowerFactor
    },
    getModifiers({ strength }) {
      return {
        pregResistance: -strength / 2,
        willpower: -strength / 2,
      }
    },
  },
}
