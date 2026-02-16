import { t } from 'mobx-state-tree'
import { allKeyItems, isUnderwear, outfits, sortOutfits, startingOutfits } from '@/common'
import { clamp } from '@/setup'
import { setupPublicViews, withSetPropAction } from '../utils/setters'
import { clampedNumber } from '../utils/types'
import { random } from '@/common/random'

export const Inventory = setupPublicViews(
  t
    .model('Inventory', {
      _money: clampedNumber({
        defaultValue: () => random.int(900, 1100),
        max: Infinity,
      }),

      keyItems: t.optional(t.array(t.enumeration(allKeyItems)), []),
      outfits: t.optional(t.array(t.enumeration(outfits)), startingOutfits),
    })
    .actions(
      withSetPropAction(() => ({
        _money(value) {
          return clamp(value, 0, Infinity)
        },
      }))
    )
).views((self) => ({
  get sortedOutfits() {
    return sortOutfits(self.outfits)
  },
  get underwear() {
    return sortOutfits(self.outfits.filter((outfit) => isUnderwear(outfit)))
  },
}))
