import { type GameLocation, gameLocationDetails, type TravelMode, travelModeDetails } from '@/common'
import { addTime } from './time'
import { rootState } from '@/state/root'

type TravelTimeOpts = {
  mode: TravelMode
  round: boolean
}

const DEFAULT_TRAVEL_TIME_OPTS = (opts?: Partial<TravelTimeOpts>): TravelTimeOpts => ({
  mode: opts?.mode ?? rootState.travelMode,
  round: opts?.round ?? true,
})

export function getTravelTime(from: GameLocation, to: GameLocation, opts?: Partial<TravelTimeOpts>) {
  const { mode, round } = DEFAULT_TRAVEL_TIME_OPTS(opts)

  const fromDetails = gameLocationDetails[from]
  const toDetails = gameLocationDetails[to]
  const deltaX = Math.abs(fromDetails.x - toDetails.x)
  const deltaY = Math.abs(fromDetails.y - toDetails.y)

  const time = (deltaX + deltaY) / travelModeDetails[mode].speed

  if (round) {
    return Math.round(time)
  } else {
    return time
  }
}

export function getCurrentTravelTime(destination: GameLocation, opts?: Partial<TravelTimeOpts>) {
  return getTravelTime(rootState.playerLocation, destination, opts)
}

export function travelTo(destination: GameLocation, opts?: Partial<TravelTimeOpts>) {
  const { mode } = DEFAULT_TRAVEL_TIME_OPTS(opts)
  const travelTime = getCurrentTravelTime(destination, opts) * 60

  addTime(travelTime, { isSunny: mode === 'walk' })
  rootState.playerLocation = destination

  if (mode === 'car') {
    rootState.carLocation = destination
  }
}
