import { action } from 'mobx'
import { effectDetails, type GameLocation, isUnderwear, weekdays } from '@/common'
import { calculateNewPregnancyChance, calculatePregnancyProbability } from './pregnancy'
import { random } from '@/common/random'
import { rootState } from '@/state/root'

export function printWeekday(time = rootState.time) {
  const day = Math.floor(time / (24 * 60 * 60))

  return weekdays[day % 7]
}

const juneStart = 11
const juneDays = 30
export function printDate(time = rootState.time) {
  const day = Math.floor(time / (24 * 60 * 60))
  const month = day + juneStart <= juneDays ? 'June' : 'July'
  const date = ((day + juneStart + juneDays - 1) % juneDays) + 1

  return `${month} ${date}`
}

export function printTime(time = rootState.time) {
  let minutes = (Math.floor(time / 60) % 60).toString(10)
  if (minutes.length < 2) minutes = `0${minutes}`

  const hoursNum = Math.floor(time / (60 * 60)) % 24
  const twelveHourNum = ((hoursNum + 11) % 12) + 1
  let hours = twelveHourNum.toString(10)
  if (hours.length < 2) hours = `0${hours}`

  return `${hours}:${minutes} ${hoursNum >= 12 ? 'PM' : 'AM'}`
}

export function isDaytime(time = rootState.time) {
  const hour = (time / (60 * 60)) % 24

  return hour >= 7 && hour <= 20
}

const SUNNY_LOCATIONS: GameLocation[] = ['beach']

type AddTimeOpts = {
  location: GameLocation
  isSunny: boolean
  addDesperation: boolean
  addHorniness: boolean
  addSleepiness: boolean
  calculatePregChance: boolean
  reduceInebriation: boolean
  reducePregChance: boolean
  reducePleasure: boolean
  updateColors: boolean
  tickEffects: boolean
  timeFrameSize: number
}

export const DEFAULT_TIME_FRAME_SIZE = 5 * 60 // 5 minutes
const DEFAULT_ADD_TIME_OPTS = (opts?: Partial<AddTimeOpts>): AddTimeOpts => {
  const location = opts?.location ?? rootState.playerLocation

  return {
    location,
    isSunny: opts?.isSunny ?? SUNNY_LOCATIONS.includes(location),
    addDesperation: opts?.addDesperation ?? true,
    addHorniness: opts?.addHorniness ?? true,
    addSleepiness: opts?.addSleepiness ?? true,
    calculatePregChance: opts?.calculatePregChance ?? true,
    reduceInebriation: opts?.reduceInebriation ?? true,
    reducePregChance: opts?.reducePregChance ?? true,
    reducePleasure: opts?.reducePleasure ?? true,
    updateColors: opts?.updateColors ?? true,
    tickEffects: opts?.tickEffects ?? true,
    timeFrameSize: opts?.timeFrameSize ?? DEFAULT_TIME_FRAME_SIZE,
  }
}

const processTime = action((deltaTime: number, opts?: Partial<AddTimeOpts>) => {
  const {
    location,
    isSunny,
    addDesperation,
    addHorniness,
    addSleepiness,
    calculatePregChance,
    reduceInebriation,
    reducePregChance,
    reducePleasure,
    // updateColors,
    tickEffects,
  } = DEFAULT_ADD_TIME_OPTS(opts)
  const hours = deltaTime / (60 * 60)
  const pc = rootState.pc

  const willpowerFactor = pc.willpowerFactor

  const prevTime = rootState.time
  rootState.time = prevTime + deltaTime

  if (addHorniness) {
    const horninessMult = (() => {
      if (pc.outfit === 'nude') {
        if (location !== 'home') return 5

        return 3.5
      }

      if (isUnderwear(pc.outfit)) {
        if (location !== 'home') return 4
      }

      if (pc.outfit === 'bikini') {
        if (location !== 'home') return 3
      }

      if (!pc.wearingUnderwear) return 3.5

      return 2.5
    })()

    pc.horniness += (hours * horninessMult) / willpowerFactor
    pc.horniness += (hours * pc.pleasure) / willpowerFactor
  }

  if (addSleepiness) {
    pc.sleepiness += (hours * 100) / 18
  }

  if (calculatePregChance && !pc.pregnant && pc.pregChance > 0) {
    pc.pregnant = random.float() < calculatePregnancyProbability(deltaTime, pc.pregChance)
  }

  if (reduceInebriation) {
    pc.drunk -= hours * 10
    pc.high -= hours * 10
  }

  if (reducePregChance) {
    pc.pregChance = calculateNewPregnancyChance(deltaTime, pc.pregChance)
  }

  if (reducePleasure) {
    pc.pleasure -= hours * 300 // Reduce to zero in a max of 20 minutes
  }

  if (isSunny && addDesperation && isDaytime(prevTime)) {
    pc.desperation += (hours * 0.5) / willpowerFactor
  }

  if (tickEffects) {
    pc.activeEffects.forEach((effect) => {
      const details = effectDetails[effect.name]

      if (details.onTimeChange) {
        const result = details.onTimeChange({
          deltaTime,

          startTime: effect.startTime,
          timeSinceStart: prevTime - effect.startTime,

          endTime: effect.endTime,
          timeRemaining: effect.endTime === null ? null : effect.endTime - prevTime,
          totalDuration: effect.endTime === null ? null : effect.endTime - effect.startTime,

          strength: effect.strength,
        })

        if (result?.done || (effect.endTime !== null && effect.endTime <= rootState.time)) {
          pc.removeEffect(effect)
        } else {
          if (result?.endTime !== undefined) {
            effect.setProp('endTime', result.endTime)
          }
          if (result?.strength !== undefined) {
            effect.setProp('strength', result.strength)
          }
        }
      }
    })
  }

  // if (updateColors) setCssVars()
})

export const addTime = (deltaTime: number, opts?: Partial<AddTimeOpts>) => {
  const defaults = DEFAULT_ADD_TIME_OPTS(opts)
  const { timeFrameSize } = defaults

  while (deltaTime >= timeFrameSize) {
    deltaTime -= timeFrameSize
    processTime(timeFrameSize, { ...defaults, updateColors: false })
  }

  if (deltaTime > 0) processTime(deltaTime)

  // if (updateColors) setCssVars()
}
