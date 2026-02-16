import { getSnapshot, type Instance, t, type ISimpleType } from 'mobx-state-tree'
import { gameLocations, travelModes } from '@/common'
import { withSetPropAction } from './utils/setters'
import { PlayerCharacter } from './models/PlayerCharacter'
import { Inventory } from './models/Inventory'
import { AllNpcConnections } from './models/NpcConnection'
import { random } from '@/common/random'

export const Root = t
  .model('Root', {
    passage: t.optional(t.string as ISimpleType<PassageModule>, '/start'),

    pc: t.optional(PlayerCharacter, {}),
    inventory: t.optional(Inventory, {}),

    time: t.optional(t.number, () => {
      // roughly 11 AM, plus or minus 10 minutes
      const randomTime = random.int(-10 * 60, 10 * 60)
      return 11 * 60 * 60 + randomTime
    }),

    playerLocation: t.optional(t.enumeration(gameLocations), 'gynecologist'),
    carLocation: t.optional(t.enumeration(gameLocations), 'gynecologist'),
    __travelMode: t.optional(t.enumeration(travelModes), 'car'),

    npcConnections: t.optional(AllNpcConnections, {}),
  })
  .views((self) => ({
    get canTravelByCar() {
      return self.playerLocation === self.carLocation
    },
  }))
  .views((self) => ({
    get travelMode() {
      if (self.__travelMode === 'car' && !self.canTravelByCar) return 'walk'
      return self.__travelMode
    },
    set travelMode(value) {
      if (value === 'car' && !self.canTravelByCar) return
      self.__travelMode = value
    },
  }))
  .actions((self) => ({
    toJSON() {
      return getSnapshot(self)
    },
  }))
  .actions(withSetPropAction())

export type RootModel = Instance<typeof Root>

export const rootState = Root.create()
