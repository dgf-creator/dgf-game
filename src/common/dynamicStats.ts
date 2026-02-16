import { rootState } from '@/state/root'

export const dynamicStats = [
  'vaginalPain',
  'analPain',
  'pleasure',
  'horniness',
  'desperation',
  'sleepiness',
  'exhaustion',
  'drunk',
  'high',
  'pregChance',
] as const

export type DynamicStat = (typeof dynamicStats)[number]

export type DynamicStatDetail = {
  name: string
  description: string
  describeStatus: (value: number) => string
  minCheatDescriptor?: string
  maxCheatDescriptor?: string
}

export const dynamicStatDetails: Record<DynamicStat, DynamicStatDetail> = {
  vaginalPain: {
    name: 'Vaginal pain',
    description: 'How sore your pussy is',
    describeStatus(vaginalPain) {
      // const pc = rootState.pc
      // const hymenTorn = pc.hasActiveEffect('deflowered') && !pc.thinkVirgin
      if (vaginalPain < 10) {
        return 'Your pussy feels fine'
      } else if (vaginalPain < 25) {
        return 'You have a dull ache in your crotch'
      } else if (vaginalPain < 33) {
        return 'You feel like your pussy has been slapped'
      } else if (vaginalPain < 50) {
        return 'Your vagina hurts'
      } else if (vaginalPain < 66) {
        return "It feels like you've been punched in your pussy"
      } else if (vaginalPain < 75) {
        return 'Your cunt aches bad'
      } else if (vaginalPain < 90) {
        return 'Your crotch is in severe pain'
      } else {
        return 'You feel like a monster truck drove through your cunt'
      }
    },
  },
  analPain: {
    name: 'Anal pain',
    description: 'How sore your asshole is',
    describeStatus(analPain) {
      if (analPain < 10) {
        return 'Your ass feels fine'
      } else if (analPain < 25) {
        return 'You have a dull ache in your butthole'
      } else if (analPain < 33) {
        return 'You feel like your anus has been slapped'
      } else if (analPain < 50) {
        return 'Your ass hurts'
      } else if (analPain < 66) {
        return "It feels like you've been punched in your asshole"
      } else if (analPain < 75) {
        return 'Your butt aches bad'
      } else if (analPain < 90) {
        return 'Your butthole is in severe pain'
      } else {
        return 'You feel like a monster truck drove through your asshole'
      }
    },
  },
  pleasure: {
    name: 'Pleasure',
    description: 'How close to orgasm you are',
    describeStatus(pleasure) {
      if (pleasure < 10) {
        return "You don't feel anything out of the ordinairy"
      } else if (pleasure < 25) {
        return 'Your clit is tingling'
      } else if (pleasure < 33) {
        return 'Your clit is hard'
      } else if (pleasure < 50) {
        return 'Your clit begs for attention'
      } else if (pleasure < 66) {
        return 'Your pleasure is mounting'
      } else if (pleasure < 75) {
        return 'Every bit of stimulation brings you closer'
      } else if (pleasure < 90) {
        return "Just a little more and you'll be cumming"
      } else {
        return "You're on the verge of climax"
      }
    },
    maxCheatDescriptor: 'trigger orgasm',
  },
  horniness: {
    name: 'Horniness',
    description: 'How turned on you are',
    describeStatus(horniness) {
      if (horniness < 10) {
        return 'You are feeling calm'
      } else if (horniness < 25) {
        return 'Your cheeks are a little rosy'
      } else if (horniness < 33) {
        return "You're tingling slightly"
      } else if (horniness < 50) {
        return 'You are feeling rather flushed and warm'
      } else if (horniness < 66) {
        return 'Your pussy is noticeably wet'
      } else if (horniness < 75) {
        return "You're feeling hot and... empty"
      } else if (horniness < 90) {
        return 'Your pussy is sopping wet'
      } else {
        return 'Your pussy is aching with need'
      }
    },
  },
  desperation: {
    name: 'Desperation',
    description: 'How desperate you are to have sex',
    describeStatus(desperation) {
      const virgin = rootState.pc.thinkVirgin

      if (desperation < 10) {
        return `You're an absolute prude, and proud of it`
      } else if (desperation < 25) {
        return `You try not to, but you occasionally think about sex`
      } else if (desperation < 33) {
        return `You think about sex a couple of times a day`
      } else if (desperation < 50) {
        return `Sex is something you think about every few hours`
      } else if (desperation < 66) {
        if (virgin) {
          return `You wonder what it would be like to have sex`
        } else {
          return `You want to have sex again`
        }
      } else if (desperation < 75) {
        if (virgin) {
          return `You wish that you could find someone to have sex with already`
        } else {
          return `You frequently find yourself wanting to get fucked`
        }
      } else if (desperation < 90) {
        if (virgin) {
          return `You can't stop seeing every man as the one you want to break you in`
        } else {
          return `You imagine getting fucked just about all the time`
        }
      } else {
        return `You want the next man you see to fuck you silly`
      }
    },
  },
  sleepiness: {
    name: 'Sleepiness',
    description: 'How tired you currently are',
    describeStatus(sleepiness) {
      if (sleepiness < 10) {
        return 'You are fully alert'
      } else if (sleepiness < 25) {
        return 'You feel fine'
      } else if (sleepiness < 33) {
        return 'You could do with a little pick-me-up'
      } else if (sleepiness < 50) {
        return 'You are starting to feel a little tired'
      } else if (sleepiness < 66) {
        return "You're pretty tired"
      } else if (sleepiness < 75) {
        return 'Your eyelids are feeling a little heavy'
      } else if (sleepiness < 90) {
        return 'You are having trouble keeping your eyes open'
      } else {
        return "You're falling asleep on your feet"
      }
    },
  },
  exhaustion: {
    name: 'Exhaustion',
    description: 'How behind on sleep you are',
    describeStatus(exhaustion) {
      if (exhaustion < 10) {
        return 'You feel very well-rested'
      } else if (exhaustion < 25) {
        return 'Your sleep has been pretty good recently'
      } else if (exhaustion < 33) {
        return "You're prone to zoning out every once in a while"
      } else if (exhaustion < 50) {
        return "You haven't been sleeping well"
      } else if (exhaustion < 66) {
        return 'You really should focus on getting better sleep'
      } else if (exhaustion < 75) {
        return 'Your brain is foggy constantly'
      } else if (exhaustion < 90) {
        return 'Your brain and body feel like mush'
      } else {
        return "You're on the verge of a mental breakdown"
      }
    },
  },
  drunk: {
    name: 'Drunkenness',
    description: 'How drunk you currently are',
    describeStatus(drunk) {
      if (drunk === 0) {
        return "You haven't had any alcohol recently"
      } else if (drunk < 10) {
        return "You've barely had any alcohol"
      } else if (drunk < 25) {
        return "You're feeling more talkative"
      } else if (drunk < 33) {
        return 'You have a bit of a buzz'
      } else if (drunk < 50) {
        return "You're talking too loud"
      } else if (drunk < 66) {
        return 'You feel drunk'
      } else if (drunk < 75) {
        return "You're slurring your words"
      } else if (drunk < 90) {
        return 'You are blacking out'
      } else {
        return "You're going to pass out"
      }
    },
  },
  high: {
    name: 'High',
    description: 'How high on drugs you are',
    describeStatus(high) {
      if (high === 0) {
        return "You haven't taken any drugs recently"
      } else if (high < 10) {
        return "You've barely touched any drugs"
      } else if (high < 25) {
        return "You're just a little high"
      } else if (high < 33) {
        return "You're a little lightheaded"
      } else if (high < 50) {
        return 'Your body is tingling'
      } else if (high < 66) {
        return "You're quite high"
      } else if (high < 75) {
        return "You're hallucinating"
      } else if (high < 90) {
        return "You can't tell what's real and what isn't"
      } else {
        return "You're on another planet"
      }
    },
  },
  pregChance: {
    name: 'Pregnancy chance',
    description: 'Approximately how likely you are to fall pregnant in the next few days',
    describeStatus(pregChance) {
      const pc = rootState.pc

      if (pregChance === 0) {
        if (pc.thinkVirgin) {
          return "You've never had sex before"
        } else {
          return "You haven't had unprotected sex recently"
        }
      } else if (pregChance < 10) {
        return "You're almost certainly fine"
      } else if (pregChance < 25) {
        return "You've been a little careless recently"
      } else if (pregChance < 33) {
        return 'You should probably get a pregnancy test soon'
      } else if (pregChance < 50) {
        return "You're really taking chances"
      } else if (pregChance < 66) {
        return 'You should really invest in condoms'
      } else if (pregChance < 75) {
        return 'You are probably pregnant'
      } else if (pregChance < 90) {
        return 'Pregnancy is all but guaranteed'
      } else {
        return "There's no way you're not pregnant"
      }
    },
    maxCheatDescriptor: 'force pregnancy',
  },
}

export function isDynamicStat(str: string): str is DynamicStat {
  return dynamicStats.includes(str as DynamicStat)
}
