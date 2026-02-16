import seedrandom from 'seedrandom'
import { Random } from 'random'

export let random: Random
let seeded: seedrandom.StatefulPRNG<seedrandom.State.Arc4>

export function reloadState(state: seedrandom.State.Arc4) {
  seeded = seedrandom('', { state })
  random = new Random(seeded)
}

export function reseed(seed = new Date().toISOString()) {
  seeded = seedrandom(seed, { state: true })
  random = new Random(seeded)
}

export function getState() {
  return seeded.state()
}

reseed()
