import { clamp } from '@/setup'
import { rootState } from '@/state/root'

export const stats = ['athleticism', 'brainpower', 'drugResistance', 'pregResistance', 'willpower'] as const

export type Stat = (typeof stats)[number]

export type StatDetail = {
  name: string
  description: string
  difficultyModifier?: number
}

export const statDetails: Record<Stat, StatDetail> = {
  athleticism: {
    name: 'Athleticism',
    description: 'Affects how strong / agile you are',
  },
  brainpower: {
    name: 'Brainpower',
    description: 'Affects how intelligent / wise you are',
  },
  drugResistance: {
    name: 'Drug / Alcohol Resistance',
    description: 'Affects how much alcohol or drugs it takes to inebriate you',
  },
  pregResistance: {
    name: 'Pregnancy Resistance',
    description: 'Affects how likely you are to fall pregnant',
    difficultyModifier: 4,
  },
  willpower: {
    name: 'Willpower',
    description: 'Affects how easily you can ignore your desires',
    difficultyModifier: 2,
  },
}

export function isStat(str: string): str is Stat {
  return stats.includes(str as Stat)
}

export function statDifficultyModifier(value: number) {
  return Math.log(value + 1) / Math.log(6)
}

export function getStatDifficultySum() {
  return stats
    .map((stat) => {
      const modifier = statDifficultyModifier(rootState.pc[stat])
      return modifier * (statDetails[stat].difficultyModifier ?? 1)
    })
    .reduce((total, curr) => total + curr, 0)
}

export function getStatDifficultyDescription() {
  const sum = getStatDifficultySum()

  console.log('getStatDifficultyDescription', sum)

  if (sum <= 5.6) return 'Impossible'
  if (sum <= 7) return 'Very hard'
  if (sum <= 8.1) return 'Hard'
  if (sum <= 9.75) return 'Normal'
  if (sum <= 10.4) return 'Easy'
  if (sum <= 11) return 'Very easy'
  return 'Cake walk'
}

export function calculateStatFactor(statValue: number) {
  return clamp((1 + statValue) / 5.5, 0.1, 10)
}

export const defaultStatFactor = Math.log(6) / Math.log(5.5)

export const maxEffectiveStat = 20
