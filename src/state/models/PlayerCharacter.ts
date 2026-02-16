import { type Instance, type SnapshotIn, t, unprotect } from 'mobx-state-tree'
import {
  calculateStatFactor,
  describeOutfit,
  describeUnderwear,
  type Effect,
  effectDetails,
  maxEffectiveStat,
  outfitPlural,
  outfitPluralWord,
  outfits,
  type UnderwearOutfit,
  underwearOutfits,
} from '@/common'
import { clamp } from '@/setup'
import { setupPublicViews, withSetPropAction } from '../utils/setters'
import { clampedNumber } from '../utils/types'
import { ActiveEffect } from './ActiveEffect'
import { random } from '@/common/random'
import { rootState } from '../root'

export const PlayerCharacter = setupPublicViews(
  t
    .model('PlayerCharacter', {
      firstName: 'Katie',
      lastName: 'Lennar',

      __outfit: t.optional(t.enumeration(outfits), 'casual'),
      __wearingUnderwear: t.optional(t.maybeNull(t.enumeration(underwearOutfits)), 'pink underwear'),

      activeEffects: t.array(ActiveEffect),

      // SEX KNOWLEDGE
      hymenIntact: true,
      thinkVirgin: true,
      barebackVirgin: true,
      actualVirgin: true,
      analVirgin: true,

      thinkPregnant: false,
      __pregnant: false,
      __pregnantAt: t.optional(t.maybeNull(t.number), null),

      // MAJOR STATS
      _athleticism: clampedNumber({ defaultValue: 5, max: 10 }),
      _brainpower: clampedNumber({ defaultValue: 5, max: 10 }),
      _drugResistance: clampedNumber({ defaultValue: 5, max: 10 }),
      _pregResistance: clampedNumber({ defaultValue: 5, max: 10 }),
      _willpower: clampedNumber({ defaultValue: 5, max: 10 }),

      // DYNAMIC STATS
      _vaginalPain: clampedNumber(),
      _analPain: clampedNumber(),

      _pleasure: clampedNumber(),
      _horniness: clampedNumber(),
      _desperation: clampedNumber(),

      _sleepiness: clampedNumber(),
      _exhaustion: clampedNumber(),

      _drunk: clampedNumber(),
      _high: clampedNumber(),

      _pregChance: clampedNumber(),
    })
    .actions(
      withSetPropAction((self) => ({
        _athleticism(value) {
          return clamp(value, 0, 10)
        },
        _brainpower(value) {
          return clamp(value, 0, 10)
        },
        _drugResistance(value) {
          return clamp(value, 0, 10)
        },
        _pregResistance(value) {
          return clamp(value, 0, 10)
        },
        _willpower(value) {
          return clamp(value, 0, 10)
        },

        _vaginalPain(value) {
          return clamp(value)
        },
        _analPain(value) {
          return clamp(value)
        },

        _pleasure(value) {
          return clamp(value)
        },
        _horniness(value) {
          if (value > 100) {
            self._desperation = clamp(self._desperation + (value - 100) / 10)
          }

          return clamp(value)
        },
        _desperation(value) {
          return clamp(value)
        },

        _sleepiness(value) {
          return clamp(value)
        },
        _exhaustion(value) {
          return clamp(value)
        },

        _drunk(value) {
          return clamp(value)
        },
        _high(value) {
          return clamp(value)
        },

        _pregChance(value) {
          return clamp(value)
        },
      }))
    )
)
  .views((self) => ({
    get pregnant() {
      return self.__pregnant
    },
    set pregnant(value) {
      self.__pregnant = value
      if (value && self.__pregnantAt === null) {
        self.__pregnantAt = rootState.time
      } else if (!value) {
        self.__pregnantAt = null
      }
    },
    get pregnantAt() {
      return self.__pregnantAt
    },
    get outfit() {
      return self.__outfit
    },
    set outfit(value) {
      if (underwearOutfits.includes(value as UnderwearOutfit)) {
        self.__wearingUnderwear = value as UnderwearOutfit
      }

      self.__outfit = value
    },
  }))
  .views((self) => ({
    get wearingUnderwear(): UnderwearOutfit | null {
      if (self.outfit === 'nude' || self.outfit === 'bikini') return null

      return self.__wearingUnderwear as UnderwearOutfit
    },
    set wearingUnderwear(value) {
      self.__wearingUnderwear = value
    },
    get inebriation() {
      return self.drunk / 50 + self.high / 50
    },
  }))
  .views((self) => ({
    get effectiveAthleticism() {
      const base = self.athleticism - self.inebriation
      const effects = self.activeEffects.reduce((total, curr) => total + curr.modifiers.athleticism, 0)
      return clamp(base + effects, 0, maxEffectiveStat)!
    },
    get effectiveBrainpower() {
      const base = self.brainpower - self.inebriation / 2
      const effects = self.activeEffects.reduce((total, curr) => total + curr.modifiers.brainpower, 0)
      return clamp(base + effects, 0, maxEffectiveStat)!
    },
    get effectiveDrugResistance() {
      const base = self.drugResistance
      const effects = self.activeEffects.reduce((total, curr) => total + curr.modifiers.brainpower, 0)
      return clamp(base + effects, 0, maxEffectiveStat)!
    },
    get effectivePregResistance() {
      const base = self.pregResistance
      const effects = self.activeEffects.reduce((total, curr) => total + curr.modifiers.pregResistance, 0)
      return clamp(base + effects, 0, maxEffectiveStat)!
    },
    get effectiveWillpower() {
      const base = self.willpower - self.inebriation * 1.5
      const effects = self.activeEffects.reduce((total, curr) => total + curr.modifiers.pregResistance, 0)
      return clamp(base + effects, 0, maxEffectiveStat)!
    },
  }))
  .views((self) => ({
    get athleticismFactor() {
      return calculateStatFactor(self.effectiveAthleticism)
    },
    get brainpowerFactor() {
      return calculateStatFactor(self.effectiveBrainpower)
    },
    get drugResistanceFactor() {
      return calculateStatFactor(self.effectiveDrugResistance)
    },
    get willpowerFactor() {
      return calculateStatFactor(self.effectiveWillpower)
    },

    get outfitDescription() {
      return describeOutfit(self.outfit)
    },
    get undiesDescription() {
      return describeUnderwear(self.wearingUnderwear)
    },
    get outfitPlural() {
      return outfitPlural(self.outfit)
    },
    get outfitPluralWord() {
      return outfitPluralWord(self.outfit)
    },

    get pleasureLevel() {
      return clamp(self.pleasure + self.horniness / 5 + self.desperation / 10)
    },

    get desperationLevel() {
      return clamp(self.horniness + (self.desperation * 3) / 4)
    },
  }))
  .actions((self) => ({
    addPregChance(newPregChance: number) {
      const notPregProbability = 1 - self.pregChance / 100
      const newNotPregProbability = 1 - newPregChance / 100

      self.pregChance = 100 - 100 * notPregProbability * newNotPregProbability
    },
    addEffect(snapshot: SnapshotIn<typeof ActiveEffect>) {
      if (self.activeEffects.some((e) => e.name === snapshot.name)) {
        console.warn(`pc already has an active effect for ${snapshot.name}`)
        return
      }

      const effect = ActiveEffect.create(snapshot)
      unprotect(effect)

      if (effect.endTime === null) {
        const defaultDuration = effectDetails[snapshot.name].defaultDuration
        if (defaultDuration !== undefined) {
          effect.setProp('endTime', effect.startTime + defaultDuration)
        }
      }

      const defaultStrength = effectDetails[snapshot.name].defaultStrength
      if (snapshot.strength === undefined && defaultStrength !== undefined) {
        effect.setProp('strength', defaultStrength)
      }

      self.activeEffects.push(effect)
    },
    removeEffect(effect: Instance<typeof ActiveEffect>) {
      const idx = self.activeEffects.indexOf(effect)

      if (idx === -1) return

      self.activeEffects.splice(idx, 1)
    },
    orgasm(isUnexpected = false) {
      self.desperation -= (self.horniness / 10 + self.pleasure / 33.3) * self.willpowerFactor

      self.horniness -= self.pleasure * self.willpowerFactor

      self.pleasure -= random.float(50, 100)

      // TODO: handle unexpected orgasm properly
      console.log({ isUnexpected })
      // if (!SugarCube.State.temporary.disableUnexpectedOrgasm) {
      //   SugarCube.State.temporary.unexpectedOrgasm ||= isUnexpected
      // }
    },
  }))
  .views((self) => ({
    hasActiveEffect(effectName: Effect) {
      return self.activeEffects.some((e) => e.name === effectName)
    },
  }))
