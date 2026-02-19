import { applySnapshot, getSnapshot } from 'mobx-state-tree'
import { rootState } from '@/state/root'

const SESSION_KEY = 'dgf-root'
const STORAGE_META_KEY = 'dgf-meta'
const STORAGE_KEY = (idx: number) => `dgf-root-${idx}`

type SaveMetaEntry = {
  thumbnail: string
  timestamp: number
  name: string
}

export function saveToLocalStorage(idx: number) {
  localStorage.setItem(STORAGE_KEY(idx), JSON.stringify(getSnapshot(rootState)))
  setSaveMeta(idx, {
    thumbnail: '', // Placeholder for thumbnail generation logic
    timestamp: Date.now(),
    name: `Save ${idx}`,
  })
}

export function loadFromLocalStorage(idx: number) {
  const stored = localStorage.getItem(STORAGE_KEY(idx))
  if (stored) {
    try {
      const state = JSON.parse(stored)
      applySnapshot(rootState, state)
    } catch (e) {
      console.error('Failed to parse stored root state:', e)
      throw new Error('Failed to load save data. The data may be corrupted.')
    }
  } else {
    console.warn(`No saved state found for id: ${idx}`)
    throw new Error('No saved data found for this slot.')
  }
}

export function updateSessionRoot() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(getSnapshot(rootState)))
}

export function loadSessionRoot() {
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed
    } catch (e) {
      console.error('Failed to parse stored root state:', e)
      throw new Error('Failed to load session data. The data may be corrupted.')
    }
  }

  return undefined
}

export function setSaveMeta(idx: number, entry: SaveMetaEntry) {
  const meta = getSaveMeta()
  meta[idx] = entry
  localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta))
}

export function getSaveMeta(): Record<number, SaveMetaEntry> {
  const metaStr = localStorage.getItem(STORAGE_META_KEY)
  if (metaStr) {
    try {
      return JSON.parse(metaStr)
    } catch (e) {
      console.error('Failed to parse save meta:', e)
    }
  }

  return {}
}
