import { clamp } from "./utilities"

// /**
//  * Tuned to produce probabilities close to pregChance
//  * @see https://docs.google.com/spreadsheets/d/15ev0yWoNf52W8kdRHT8BE4XCwNEU4Wb9fAvOw2AkTHM
//  */
// export const PREG_CHANCE_FACTORS = [0.95, 1.18, 0.00001]
// export const PREG_CHANCE_PIVOT = 0.41
// export const pregnancyProbabilityPowerFactor = (probablity: number) => {
//   const [low, med, high] = PREG_CHANCE_FACTORS
//   if (probablity < PREG_CHANCE_PIVOT) {
//     return (med - low) * (probablity / PREG_CHANCE_PIVOT) + low
//   } else {
//     return (high - med) * (probablity - PREG_CHANCE_PIVOT) / (1 - PREG_CHANCE_PIVOT) + med
//   }
// }

/**
 * Tuned to produce probabilities close to pregChance / 100
 */
export const PREG_CHANCE_FACTOR_OBJS = [
  { pivot: 0.00, chance: 0.600 },
  { pivot: 0.02, chance: 0.895 },
  { pivot: 0.06, chance: 1.011 },
  { pivot: 0.10, chance: 1.050 },
  { pivot: 0.15, chance: 1.100 },
  { pivot: 0.20, chance: 1.120 },
  { pivot: 0.25, chance: 1.150 },
  { pivot: 0.30, chance: 1.120 },
  { pivot: 0.35, chance: 1.135 },
  { pivot: 0.40, chance: 1.140 },
  { pivot: 0.45, chance: 1.070 },
  { pivot: 0.50, chance: 1.085 },
  { pivot: 0.55, chance: 0.982 },
  { pivot: 0.60, chance: 0.955 },
  { pivot: 0.65, chance: 0.815 },
  { pivot: 0.70, chance: 0.735 },
  { pivot: 0.75, chance: 0.535 },
  { pivot: 0.80, chance: 0.385 },
  { pivot: 0.85, chance: 0.155 },
  { pivot: 0.90, chance: 0.032 },
  { pivot: 0.94, chance: 0.0000012 },
  { pivot: 0.96, chance: 0.00018 },
  { pivot: 0.98, chance: 0.00000000000001 },
  { pivot: 1.00, chance: 0.00000000000001 },
] as const satisfies {
  pivot: number
  chance: number
}[]
export const pregnancyProbabilityPowerFactor = (probablity: number) => {
  let idx = PREG_CHANCE_FACTOR_OBJS.findIndex((p) => p.pivot > probablity)
  if (idx === -1) idx = PREG_CHANCE_FACTOR_OBJS.length - 1

  const [low, high] = PREG_CHANCE_FACTOR_OBJS.slice(idx - 1, idx + 1)

  return (high.chance - low.chance) * (probablity - low.pivot) / (high.pivot - low.pivot) + low.chance
}

export const PREG_CHANCE_POWER_FACTOR = 0.047
export function calculatePregnancyProbability (deltaTime: number, pregChance: number) {
  const hours = deltaTime / (60 * 60)
  const probablity = (pregChance / 100) ** pregnancyProbabilityPowerFactor(pregChance / 100)

  const notPregChance =
    (1 - probablity) **
    (hours * PREG_CHANCE_POWER_FACTOR)

  return 1 - notPregChance
}

// Cut pregChance in half every 24 hours
const PREG_CHANCE_REDUCTION_FACTOR = Math.pow(0.5, 1 / 24)
export function calculateNewPregnancyChance (deltaTime: number, pregChance: number) {
  const hours = deltaTime / (60 * 60)

  return clamp(pregChance * PREG_CHANCE_REDUCTION_FACTOR ** hours - hours / 10)
}
