import { getSnapshot, type Instance, t } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
import { Frame } from './frame'
import { loadSessionRoot, updateSessionRoot } from '@/common/saves'

export const Root = t
  .model('Root', {
    currentFrameIndex: t.optional(t.integer, 0),
    history: t.optional(t.array(Frame), [Frame.create()]),
  })
  .views((self) => ({
    get currentFrame() {
      return self.history[self.currentFrameIndex]
    },
  }))
  .actions((self) => ({
    newFrame(path: PassageModule) {
      const current = getSnapshot(self.currentFrame)
      const frameId = nanoid()
      const newFrame = Frame.create({ ...current, id: frameId, passage: path, temporaryState: {} })
      self.history.unshift(newFrame)
      if (self.history.length > 10) {
        self.history.pop()
      }

      updateSessionRoot()
    },
  }))

export type RootModel = Instance<typeof Root>

function loadRoot() {
  try {
    return Root.create(loadSessionRoot())
  } catch (e) {
    console.error('Failed to apply stored root state:', e)
  }

  return Root.create()
}

export const rootState = loadRoot()
