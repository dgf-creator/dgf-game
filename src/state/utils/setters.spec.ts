
import { describe, it, expect, vi } from 'vitest'
import { t } from 'mobx-state-tree'
import { observe } from 'mobx'
import { withSetPropAction } from './setters'

describe('withSetPropAction', () => {
  it('should allow setting of variables directly', () => {
    const TestModel = t.model('TestModel', {
      someField: t.string,
    }).actions(withSetPropAction())

    const obj = TestModel.create({ someField: 'one' })

    obj.setProp('someField', 'two')

    expect(obj.someField).toBe('two')
  })

  it('should map values returned from setters', () => {
    const TestModel = t.model('TestModel', {
      someField: t.string,
    }).actions(withSetPropAction(() => ({
      someField (value) {
        return value.toUpperCase()
      },
    })))

    const obj = TestModel.create({ someField: 'ONE' })

    obj.setProp('someField', 'two')

    expect(obj.someField).toBe('TWO')
  })

  it('should allow setting values directly on self', () => {
    const TestModel = t.model('TestModel', {
      someField: t.string,
    }).actions(withSetPropAction((self) => ({
      someField (value) {
        self.someField = value.toUpperCase()
      },
    })))

    const obj = TestModel.create({ someField: 'ONE' })

    obj.setProp('someField', 'two')

    expect(obj.someField).toBe('TWO')
  })

  it('can be updated?', () => {
    const TestModel = t.model('TestModel', {
      someField: t.string,
    }).actions(withSetPropAction((self) => ({
      someField (value) {
        self.someField = value.toUpperCase()
      },
    }))).views((self) => ({
      get doot () {
        return self.someField
      },
      set doot (value: string) {
        self.setProp('someField', value)
      },
    }))

    const obj = TestModel.create({ someField: 'one' })

    const callback = vi.fn()
    observe(obj, 'someField', callback)

    obj.doot = 'two'

    expect(obj.someField).toBe('TWO')
    expect(callback).toHaveBeenCalledOnce()
  })
})
