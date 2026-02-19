import bookData from './icons8-book.json'
import clockData from './icons8-clock.json'
import eyeData from './icons8-eye.json'
import femaleData from './icons8-female.json'
import heartData from './icons8-heart.json'
import heartWithArrowData from './icons8-heart-with-arrow.json'
import hourglassData from './icons8-historical.json'
import locationData from './icons8-location.json'
import lockData from './icons8-lock.json'
import loveCircledData from './icons8-love-circled.json'
import loveMessageData from './icons8-love-message.json'
import mailData from './icons8-mail.json'
import menuData from './icons8-menu.json'
import musicRecordData from './icons8-music-record.json'
import nextLocationData from './icons8-next-location.json'
import nutData from './icons8-nut.json'
import pictureData from './icons8-picture.json'
import pillData from './icons8-pill.json'
import saveAsData from './icons8-save-as.json'
import sparklingData from './icons8-sparkling.json'
import speechBubbleData from './icons8-speech-bubble.json'
import starData from './icons8-star.json'
import teaData from './icons8-tea.json'
import testTubeData from './icons8-test-tube.json'
import twoHeartsData from './icons8-two-hearts.json'
import maleData from './icons8-user-male.json'

export type IconRel = {
  data: unknown
  frameCount: number
  positions: Record<string, number>
}

export const icons = {
  book: {
    data: bookData,
    frameCount: 28,
    positions: {
      start: 0,
      closed: 0,
      open: 13,
      end: 27,
    },
  },
  clock: {
    data: clockData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  eye: {
    data: eyeData,
    frameCount: 28,
    positions: {
      start: 0,
      open: 0,
      closed: 13,
      end: 27,
    },
  },
  female: {
    data: femaleData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  heart: {
    data: heartData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  heartWithArrow: {
    data: heartWithArrowData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  hourglass: {
    data: hourglassData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  location: {
    data: locationData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  lock: {
    data: lockData,
    frameCount: 28,
    positions: {
      start: 0,
      locked: 0,
      unlocked: 13,
      end: 27,
    },
  },
  loveCircled: {
    data: loveCircledData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  loveMessage: {
    data: loveMessageData,
    frameCount: 28,
    positions: {
      start: 0,
      empty: 0,
      heart: 13,
      end: 27,
    },
  },
  mail: {
    data: mailData,
    frameCount: 28,
    positions: {
      start: 0,
      closed: 0,
      open: 13,
      end: 27,
    },
  },
  menu: {
    data: menuData,
    frameCount: 28,
    positions: {
      start: 0,
      menu: 0,
      close: 13,
      end: 27,
    },
  },
  musicRecord: {
    data: musicRecordData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  nextLocation: {
    data: nextLocationData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  nut: {
    data: nutData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  picture: {
    data: pictureData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  pill: {
    data: pillData,
    frameCount: 28,
    positions: {
      start: 0,
      closed: 0,
      poured: 27,
      end: 27,
    },
  },
  saveAs: {
    data: saveAsData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  sparkling: {
    data: sparklingData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  speechBubble: {
    data: speechBubbleData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  star: {
    data: starData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  tea: {
    data: teaData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  testTube: {
    data: testTubeData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  twoHearts: {
    data: twoHeartsData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
  male: {
    data: maleData,
    frameCount: 28,
    positions: {
      start: 0,
      end: 27,
    },
  },
} satisfies Record<string, IconRel>
