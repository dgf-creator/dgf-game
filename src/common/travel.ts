export const travelModes = ['car', 'train', 'walk'] as const

export type TravelMode = (typeof travelModes)[number]

type TravelModeDetails = {
  speed: number
  travelingBy: string
  traveledBy: string
  travelBy: string
}

export const travelModeDetails = {
  car: {
    speed: 3,
    travelingBy: 'driving your car',
    traveledBy: 'drove',
    travelBy: 'drive',
  },
  train: {
    speed: 5,
    travelingBy: 'traveling by metro',
    traveledBy: 'took the metro',
    travelBy: 'take the metro',
  },
  walk: {
    speed: 1,
    travelingBy: 'walking',
    traveledBy: 'walked',
    travelBy: 'walk',
  },
} as const satisfies Record<TravelMode, TravelModeDetails>

export function isTravelMode(str: string): str is TravelMode {
  return travelModes.includes(str as TravelMode)
}
