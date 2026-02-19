import { compiler, RuleType } from 'markdown-to-jsx'
import { Random } from 'random'
import { isValidElement } from 'react'

function countLeadingSpaces(str: string) {
  str = str.replaceAll(/^\n+/g, '') // Remove leading newlines
  const match = str.match(/^ +/)
  return match ? match[0].length : 0
}

export function markdown(strings: TemplateStringsArray, ...values: unknown[]) {
  const random = new Random(strings.join(''))
  const names: string[] = []
  const elements: React.ReactElement[] = []

  const leadingSpaces = countLeadingSpaces(strings[0])

  function randomName() {
    return `--${random.integer(1_000_000, Number.MAX_SAFE_INTEGER).toString()}--`
  }

  const result = strings
    .reduce((acc, str, i) => {
      if (isValidElement(values[i])) {
        const name = randomName()
        names.push(name)
        if (values[i].key) {
          elements.push(values[i])
        } else {
          elements.push({
            ...values[i],
            key: name,
          })
        }
        return acc + str + name
      } else {
        return acc + str + (values[i] || '')
      }
    }, '')
    .replaceAll(new RegExp(`^ {${leadingSpaces}}`, 'gm'), '') // Remove common leading spaces

  if (names.length === 0) {
    return compiler(result)
  }

  const regex = new RegExp(`${names.join('|')}`)

  const compiled = compiler(result, {
    renderRule(next, node) {
      if (node.type === RuleType.text) {
        if (!regex.test(node.text)) {
          return next()
        }

        const parts: React.ReactNode[] = []
        let remaining = node.text
        while (regex.test(remaining)) {
          const match = remaining.match(regex)
          if (match) {
            const index = match.index ?? 0
            parts.push(remaining.slice(0, index))
            const name = match[0]
            const elementIndex = names.indexOf(name)
            if (elementIndex !== -1) {
              parts.push(elements[elementIndex])
            } else {
              parts.push(name)
            }
            remaining = remaining.slice(index + name.length)
          }
        }
        parts.push(remaining)

        return parts
      }
      return next()
    },
  })

  return <div className='md-compiled'>{compiled}</div>
}
