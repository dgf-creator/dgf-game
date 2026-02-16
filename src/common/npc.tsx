import { rootState } from '@/state/root'

export const npcs = ['mom', 'stepdad', 'bobby', 'james', 'dylan', 'alex', 'lizzie', 'michael'] as const

export type Npc = (typeof npcs)[number]

export type Sex = 'male' | 'female' | 'shemale'
export type Pronouns = {
  they: string
  them: string
  their: string
  theirs: string
}
export const theyPronouns = {
  they: 'they',
  them: 'them',
  their: 'their',
  theirs: 'theirs',
} as const satisfies Pronouns

export const malePronouns = {
  they: 'he',
  them: 'him',
  their: 'his',
  theirs: 'his',
} as const satisfies Pronouns
export const femalePronouns = {
  they: 'she',
  them: 'her',
  their: 'hers',
  theirs: 'hers',
} as const satisfies Pronouns

export type NpcDetails = {
  firstName: string
  lastName: string
  sex: Sex
  pronouns: Pronouns
  age: number
  sexualPartner: boolean
  relation?: string
  blurb?: string | React.ReactElement
}

export const npcDetails: Record<Npc, NpcDetails> = {
  mom: {
    firstName: 'Leann',
    get lastName() {
      return rootState.pc.lastName
    },
    sex: 'female',
    pronouns: femalePronouns,
    age: 42,
    sexualPartner: false,
    relation: 'mother',
  },
  stepdad: {
    firstName: 'Peter',
    lastName: 'Markov',
    sex: 'male',
    pronouns: malePronouns,
    age: 54,
    sexualPartner: true,
    relation: 'step-father',
    blurb: (
      <>
        Your mother married Peter about a year ago. He is nice enough, but is a little creepy at times. You've caught
        him looking at you inappropriately on a number of occasions.
      </>
    ),
  },
  bobby: {
    firstName: 'Bobby',
    lastName: 'Markov',
    sex: 'male',
    pronouns: malePronouns,
    age: 19,
    sexualPartner: true,
    relation: 'step-brother',
    blurb: (
      <>
        You and Bobby don't really pay much attention to each other. He's home from college for the summer, so you see
        each other every day, but he mostly just plays videogames all day. He's lazy and doesn't have a job because
        Peter pays for everything for him.
      </>
    ),
  },
  james: {
    firstName: 'James',
    lastName: 'Duncan',
    sex: 'male',
    pronouns: malePronouns,
    age: 31,
    sexualPartner: true,
    relation: 'boss',
    blurb: (
      <>
        James is a good and laid back boss. He keeps you informed of everything that is going on which could affect you
        at work, and he treats you fairly and pays you fairly. You've gotten to be close enough that you think James has
        a crush on you, but he's too reserved to admit it.
      </>
    ),
  },
  dylan: {
    firstName: 'Dylan',
    lastName: 'Mathers',
    sex: 'male',
    pronouns: malePronouns,
    age: 21,
    sexualPartner: true,
    relation: 'coworker',
  },
  alex: {
    firstName: 'Alex',
    lastName: 'MacDonald',
    sex: 'female',
    pronouns: femalePronouns,
    age: 19,
    sexualPartner: true,
    relation: 'coworker',
  },
  lizzie: {
    firstName: 'Lizzie',
    lastName: 'Belle',
    sex: 'female',
    pronouns: femalePronouns,
    age: 41,
    sexualPartner: true,
    relation: 'coworker',
  },
  michael: {
    firstName: 'Michael',
    lastName: 'Ocelot',
    sex: 'male',
    pronouns: malePronouns,
    age: 18,
    sexualPartner: true,
    relation: 'neighbor',
    blurb: (
      <>
        Michael has been your neighbor since you were both about 13. He has always been nice, but you don't really hang
        out together, so you don't know each other very well. One of the things you do know about Michael is that his
        favorite hobby is photography.
      </>
    ),
  },
}

export type SexualPartnerNpc = Exclude<Npc, 'mom'>

export const sexualPartnerNpcs = npcs.filter((npc) => npcDetails[npc].sexualPartner) as SexualPartnerNpc[]

export function isNpc(str: string): str is Npc {
  return npcs.includes(str as Npc)
}
