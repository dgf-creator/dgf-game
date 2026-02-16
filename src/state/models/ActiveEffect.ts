import { t } from 'mobx-state-tree'
import { effectDetails, type EffectModifiers, effects } from '@/common'
import { withSetPropAction } from '../utils/setters'
import { rootState } from '../root'

export const ActiveEffect = t
  .model('ActiveEffect', {
    name: t.enumeration(effects),
    startTime: t.optional(t.number, (): number => rootState.time),
    endTime: t.optional(t.maybeNull(t.number), null),
    strength: t.optional(t.number, 1),
  })
  .views((self) => ({
    get modifiers(): Required<EffectModifiers> {
      const {
        athleticism = 0,
        brainpower = 0,
        drugResistance = 0,
        pregResistance = 0,
        willpower = 0,
      } = effectDetails[self.name].getModifiers?.({
        startTime: self.startTime,
        timeSinceStart: rootState.time - self.startTime,

        endTime: self.endTime,
        timeRemaining: self.endTime === null ? null : self.endTime - rootState.time,
        totalDuration: self.endTime === null ? null : self.endTime - self.startTime,

        strength: self.strength,
      }) ?? {}

      return {
        athleticism,
        brainpower,
        drugResistance,
        pregResistance,
        willpower,
      }
    },
  }))
  .actions(withSetPropAction())
