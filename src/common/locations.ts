export const gameLocations = ['home', 'work', 'beach', 'gynecologist'] as const

export type GameLocation = (typeof gameLocations)[number]

type LocationDetails = {
  x: number
  y: number
  shortDescription: string
  longDescription: string
  defaultPassage: string
}

export const gameLocationDetails = {
  beach: {
    x: 90,
    y: 50,
    shortDescription: 'Torrey Beach',
    longDescription: 'The local beach, a short drive from the city',
    defaultPassage: 'The beach',
  },
  gynecologist: {
    x: 30,
    y: 50,
    shortDescription: 'Grace OB/GYN',
    longDescription: "Your gynecologist's office",
    defaultPassage: 'Your gynecologist',
  },
  home: {
    x: 15,
    y: 30,
    shortDescription: 'Home',
    longDescription: "Your parents' house",
    defaultPassage: 'Home',
  },
  work: {
    x: 25,
    y: 30,
    shortDescription: "Lucky's Diner",
    longDescription: 'The restaurant where you work',
    defaultPassage: 'Work',
  },
} as const satisfies Record<GameLocation, LocationDetails>

export function isGameLocation(str: string | null | undefined): str is GameLocation {
  return gameLocations.includes(str as GameLocation)
}
