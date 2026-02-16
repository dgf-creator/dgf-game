import { t } from 'mobx-state-tree'

type ClampedNumberOpts = {
  defaultValue: number | (() => number)
  min: number
  max: number
}

const DEFAULT_CLAMPED_NUMBER_OPTS: ClampedNumberOpts = {
  defaultValue: 0,
  min: 0,
  max: 100,
}
export function clampedNumber (opts?: Partial<ClampedNumberOpts>) {
  const { defaultValue, min, max } = {
    ...DEFAULT_CLAMPED_NUMBER_OPTS,
    ...opts,
  }

  return t.optional(t.refinement('clampedNumber', t.number, (s) => (
    s >= min && s <= max
  )), defaultValue)
}
