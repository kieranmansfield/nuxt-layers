type newText = string | string[]
const spacesRegex: RegExp = /\s/

export function splitSpaces(text: string): newText {
  return text.split(spacesRegex)
}
