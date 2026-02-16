import { t, type IOptionalIType } from 'mobx-state-tree'
import { type Npc, npcs } from '@/common'
import { clamp } from '@/setup'
import { setupPublicViews, withSetPropAction } from '../utils/setters'
import { clampedNumber } from '../utils/types'

export const NpcConnection = setupPublicViews(
  t
    .model('NpcConnection', {
      npc: t.enumeration(npcs),

      _relationship: clampedNumber(), // Whether you are on good terms with this NPC
      _attraction: clampedNumber(), // How attracted this NPC is to you
    })
    .actions(
      withSetPropAction(() => ({
        _relationship(value) {
          return clamp(value)
        },
        _attraction(value) {
          return clamp(value)
        },
      }))
    )
)

export const AllNpcConnections = t.model('AllNpcConnections', {
  mom: t.optional(NpcConnection, { npc: 'mom' }),
  stepdad: t.optional(NpcConnection, { npc: 'stepdad' }),
  bobby: t.optional(NpcConnection, { npc: 'bobby' }),
  james: t.optional(NpcConnection, { npc: 'james' }),
  dylan: t.optional(NpcConnection, { npc: 'dylan' }),
  alex: t.optional(NpcConnection, { npc: 'alex' }),
  lizzie: t.optional(NpcConnection, { npc: 'lizzie' }),
  michael: t.optional(NpcConnection, { npc: 'michael' }),
} satisfies Record<Npc, IOptionalIType<typeof NpcConnection, [undefined]>>)
