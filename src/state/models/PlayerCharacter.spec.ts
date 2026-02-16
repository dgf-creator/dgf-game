
import { describe, it, expect } from 'vitest'
import { unprotect } from 'mobx-state-tree'
import { PlayerCharacter } from './PlayerCharacter'

describe('PlayerCharacter', () => {
  const privateSpecs = {
    _vaginalPain: { min: 0, max: 100 },
    _analPain: { min: 0, max: 100 },
    _horniness: { min: 0, max: 100 },
    _desperation: { min: 0, max: 100 },
    _sleepiness: { min: 0, max: 100 },
    _exhaustion: { min: 0, max: 100 },
    _pregChance: { min: 0, max: 100 },
  } as const

  const privateFields = Object.keys(privateSpecs) as (keyof typeof privateSpecs)[]

  privateFields.forEach((privateField) => {
    const publicField = privateField.substring(1) as typeof privateField extends `_${infer Rest}` ? Rest : never
    const { min, max } = privateSpecs[privateField]

    describe(privateField, () => {
      it('should not allow out-of-bounds numbers', () => {
        const instance = PlayerCharacter.create()
        unprotect(instance)

        expect(() => { instance[privateField] = min - 1 }).toThrow()

        expect(() => { instance[privateField] = max + 1 }).toThrow()
      })
    })

    describe(publicField, () => {
      it('should clamp if set out-of-bounds', () => {
        const instance = PlayerCharacter.create()

        instance[publicField] = min - 1
        expect(instance[publicField]).toBe(min)

        instance[publicField] = max + 1
        expect(instance[publicField]).toBe(max)
      })
    })
  })
})
