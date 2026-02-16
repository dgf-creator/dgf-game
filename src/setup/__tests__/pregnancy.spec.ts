
import { describe, it, expect } from 'vitest'
import {
  calculateNewPregnancyChance,
  calculatePregnancyProbability,
  PREG_CHANCE_FACTOR_OBJS,
  pregnancyProbabilityPowerFactor,
} from '../pregnancy'
import { DEFAULT_TIME_FRAME_SIZE } from '../time'

describe('pregnancyProbabilityPowerFactor', () => {
  it.each(
    PREG_CHANCE_FACTOR_OBJS.map((f) => [
      f.chance,
      f.pivot,
    ]),
  )('should return a chance of %f for a probability at %f', (chance, pivot) => {
    expect(pregnancyProbabilityPowerFactor(pivot)).toBe(chance)
  })

  it('should return the low value for a probability of 1', () => {
    expect(pregnancyProbabilityPowerFactor(1)).toBeCloseTo(0, 6)
  })
})

describe('calculatePregnancyChance', () => {
  it('should return zero if the input pregChance is zero', () => {
    expect(calculatePregnancyProbability(DEFAULT_TIME_FRAME_SIZE, 0)).toBe(0)
  })

  it('should return 1 if the input pregChance is 100', () => {
    expect(calculatePregnancyProbability(DEFAULT_TIME_FRAME_SIZE, 100)).toBe(1)
  })
})

describe('calculatePregnancyChance', () => {
  it('should return zero if the input pregChance is zero', () => {
    expect(calculatePregnancyProbability(DEFAULT_TIME_FRAME_SIZE, 0)).toBe(0)
  })

  it('should return 1 if the input pregChance is 100', () => {
    expect(calculatePregnancyProbability(DEFAULT_TIME_FRAME_SIZE, 100)).toBe(1)
  })

  it.each(
    Array.from({ length: 101 }, (_, i) => i).map((i) => [i]),
  )('should eventually be close to the correct probability for a pregChance of %d', (originalPregChance) => {
    const FIVE_DAYS = 5 * 24 * 60 * 60

    let pregChance = originalPregChance
    let notPregProbability = 1

    // Count down from 5 days to zero
    for (let time = FIVE_DAYS; time > 0; time -= DEFAULT_TIME_FRAME_SIZE) {
      // Compound the probability of not becoming pregnant
      notPregProbability *= (1 - calculatePregnancyProbability(DEFAULT_TIME_FRAME_SIZE, pregChance))

      // Update the chance of becoming pregnant similar to how is done in processTime
      pregChance = calculateNewPregnancyChance(DEFAULT_TIME_FRAME_SIZE, pregChance)
    }

    const pregProbability = 1 - notPregProbability

    // The probability of becoming pregnant should be close to the original chance / 100
    expect(pregProbability).toBeCloseTo(originalPregChance / 100, 2)

    // pregChance should drop to zero within 5 days
    expect(pregChance).toBe(0)
  })
})
