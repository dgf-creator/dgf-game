export const outfits = [
  'casual',
  'work',
  'sundress',
  'bikini',
  'pink underwear',
  'sheer black underwear',
  'nude',
] as const

export type Outfit = (typeof outfits)[number]

export function isOutfit(str: string): str is Outfit {
  return outfits.includes(str as Outfit)
}

export const underwearOutfits = ['pink underwear', 'sheer black underwear'] as const satisfies Outfit[]

export type UnderwearOutfit = (typeof underwearOutfits)[number]

export function isUnderwear(str: string): str is UnderwearOutfit {
  return underwearOutfits.includes(str as UnderwearOutfit)
}

const pluralOutfits = ['casual', 'pink underwear', 'sheer black underwear'] as const satisfies Outfit[]
export function outfitPlural(outfit: Outfit) {
  return pluralOutfits.includes(outfit as (typeof pluralOutfits)[number])
}

export function outfitPluralWord(outfit: Outfit) {
  return outfitPlural(outfit) ? 'them' : 'it'
}

export function describeUnderwear(undies: UnderwearOutfit | null): string {
  switch (undies) {
    case null:
      return 'nothing at all'
    case 'pink underwear':
      return 'a pink bra and pink panties'
    case 'sheer black underwear':
      return 'a sheer black bra and matching black panties'
  }
}

export function describeOutfit(outfit: Outfit, changing = true) {
  if (isUnderwear(outfit)) {
    if (changing) return `just ${describeUnderwear(outfit)}`
    else return describeUnderwear(outfit)
  }

  switch (outfit) {
    case 'bikini':
      return 'your bikini'
    case 'casual':
      return 'your casual clothes'
    case 'sundress':
      return 'a yellow sundress'
    case 'nude':
      return 'nothing at all'
    case 'work':
      return 'your waitress uniform'
    default:
      return outfit
  }
}

export const startingOutfits: Outfit[] = ['bikini', 'casual', 'nude', 'pink underwear', 'work']

export function sortOutfits<T extends Outfit>(input: T[]): readonly T[] {
  return Object.freeze(input.slice().sort((a, b) => outfits.indexOf(a) - outfits.indexOf(b)))
}
