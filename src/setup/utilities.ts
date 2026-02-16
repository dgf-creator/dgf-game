
export function clamp (value: number, min = 0, max = 100, defaultValue = 0) {
  if (Number.isNaN(value) || value === undefined || value === null) {
    value = defaultValue
  }

  return Math.max(min, Math.min(value, max))
}
