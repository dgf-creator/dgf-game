#!/usr/bin/env -S npx tsx

import { watch, globSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function watchPassages() {
  return watch(passagesDir, { recursive: true }, generatePassageModuleDeclaration)
}

const passagesDir = join(__dirname, '..', 'src', 'passages')
const passagesDec = join(__dirname, '..', 'src', 'passageModule.d.ts')
const passagesGlob = `${passagesDir}/**/*.tsx`

export async function generatePassageModuleDeclaration() {
  try {
    const files = globSync(passagesGlob)
    const passages = files
      .map((file) => file.replace(passagesDir, '').replace('.tsx', ''))
      .filter((file) => !file.includes('_'))
    const content = await format(`declare type PassageModule = | '${passages.join(`' | '`)}'`, { parser: 'typescript' })
    await writeFile(passagesDec, content)
  } catch (err) {
    console.error('Error writing passages.d.ts:', err)
  }
}

generatePassageModuleDeclaration()
