import { type IModelType, type Instance, type IStateTreeNode, type SnapshotIn } from 'mobx-state-tree'

type OnlyProperties<T> = {
  [K in keyof SnapshotIn<T>]: K extends keyof T ? T[K] : never
}

type Setters<T> = {
  [K in keyof SnapshotIn<T>]?: K extends keyof T ? (value: T[K]) => T[K] | void : never
}

type PrivateKeysHelper<T> = {
  [K in keyof SnapshotIn<T> as K extends `_${string}` ? K : never]: K extends `_${infer Pub}` ? Pub : never
}

type PublicKeysFrom<T> = PrivateKeysHelper<T>[keyof PrivateKeysHelper<T>]

type PublicView<T> = {
  [K in PublicKeysFrom<T>]: `_${K}` extends keyof T ? T[`_${K}`] : never
}

export const withSetPropAction =
  <T extends IStateTreeNode>(settersBuilder: (self: T) => Setters<T> = () => ({})) =>
  (self: T & OnlyProperties<T>) => {
    const setters = settersBuilder(self)

    return {
      setProp<K extends keyof OnlyProperties<T>, V extends SnapshotIn<T>[K]>(field: K, newValue: V) {
        if (setters[field]) {
          const tempValue = setters[field](newValue) as V | void

          if (tempValue !== undefined && tempValue !== null) {
            self[field] = tempValue
          }
        } else {
          self[field] = newValue
        }
      },
    }
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModelWithPriv<T extends IModelType<any, any, any, any>> =
  T extends IModelType<infer TProps, infer TOthers, infer TCustomC, infer TCustomS>
    ? IModelType<TProps, TOthers & PublicView<Instance<T>>, TCustomC, TCustomS>
    : never

const withPublicView =
  <T extends IStateTreeNode & { setProp(key: unknown, value: unknown): void }>(
    privKey: Extract<keyof PrivateKeysHelper<T>, string>
  ) =>
  (self: T) => {
    const pubKey = privKey.substring(1)
    return {
      get [pubKey]() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (self as any)[privKey]
      },
      set [pubKey](value: unknown) {
        self.setProp(privKey, value)
      },
    } as PublicView<T>
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupPublicViews = <T extends IModelType<any, any, any, any>>(Model: T) => {
  const privateFields = Object.getOwnPropertyNames(Model.properties).filter(
    (key) => key.startsWith('_') && !key.startsWith('__')
  ) as Extract<keyof PrivateKeysHelper<T>, string>[]

  let OutModel = Model as unknown as ModelWithPriv<T>

  privateFields.forEach((privKey) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OutModel = OutModel.views(withPublicView(privKey as any)) as ModelWithPriv<T>
  })

  return OutModel
}
