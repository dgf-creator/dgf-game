import makeInspectable from 'mobx-devtools-mst'
import { rootState } from './state/root'

// console.log('Devtools', makeInspectable.default)

// @ts-expect-error - The TS types are incorrect
makeInspectable.default(rootState)
