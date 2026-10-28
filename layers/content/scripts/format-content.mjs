#!/usr/bin/env node
// Rewrites content markdown into the canonical Comark formatting Nuxt Studio emits, so Studio
// stops showing its "Comark formatting available" banner and a first edit doesn't reformat the
// whole file. Usage: node format-content.mjs [--check] [dir ...] (default dir: ./content).
//
// comark is resolved through the installed nuxt-studio rather than pinned here, so the output
// always matches the Studio version that will compare against it.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const check = args.includes('--check')
const dirs = args.filter((arg) => !arg.startsWith('--'))
if (!dirs.length) dirs.push('content')

async function loadComark() {
  let studioEntry
  try {
    studioEntry = createRequire(join(process.cwd(), 'package.json')).resolve('nuxt-studio')
  } catch {
    studioEntry = createRequire(import.meta.url).resolve('nuxt-studio')
  }
  const fromStudio = createRequire(studioEntry)
  const load = async (id) => import(pathToFileURL(fromStudio.resolve(id)).href)
  const [{ parseMarkdown }, { renderMarkdown }, { default: emoji }, { default: toc }] =
    await Promise.all([
      load('comark'),
      load('comark/render'),
      load('comark/plugins/emoji'),
      load('comark/plugins/toc'),
    ])
  return { parseMarkdown, renderMarkdown, emoji, toc }
}

// Port of nuxt-studio's padBlankLinesInComponents (dist/module/runtime/utils/document/legacy.js),
// which isn't importable on its own: blank lines inside a component that contains an indented
// code fence are padded to the fence/component indent, as Studio does after rendering.
const FENCE_OPENING = /^( *(?:(?:[-*+]|\d{1,9}[.)]) +)?)(`{3,}|~{3,})/
const COMPONENT_OPENING = /^ *:{2,}[a-z]/i
const COMPONENT_CLOSING = /^ *:{2,} *$/
const PROPS_DELIMITER = /^ *--- *$/

function padBlankLinesInComponents(markdown) {
  const lines = markdown.split('\n')
  const components = []
  let blanks = []
  let hasIndentedFence = false
  let fence
  let inProps = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (fence) {
      if (fence.closing.test(line)) fence = undefined
      else if (!line.trim() && components.length) blanks.push({ index: i, indent: fence.indent })
      continue
    }
    if (inProps) {
      inProps = !PROPS_DELIMITER.test(line)
      continue
    }
    const opening = line.match(FENCE_OPENING)
    if (opening) {
      const marker = opening[2]
      fence = {
        closing: new RegExp(`^ *\\${marker[0]}{${marker.length},} *$`),
        indent: ' '.repeat(opening[1].length),
      }
      hasIndentedFence ||= components.length > 0 && opening[1].length > 0
      continue
    }
    if (COMPONENT_OPENING.test(line)) {
      components.push(line.match(/^ */)[0])
      if (PROPS_DELIMITER.test(lines[i + 1] ?? '')) {
        inProps = true
        i++
      }
      continue
    }
    if (COMPONENT_CLOSING.test(line) && components.length) {
      components.pop()
      if (components.length) continue
      if (hasIndentedFence) {
        for (const { index, indent } of blanks) lines[index] = indent
      }
      blanks = []
      hasIndentedFence = false
      continue
    }
    if (!line.trim() && components.length) blanks.push({ index: i, indent: components.at(-1) })
  }
  return lines.join('\n')
}

async function* markdownFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* markdownFiles(path)
    else if (entry.name.endsWith('.md')) yield path
  }
}

const { parseMarkdown, renderMarkdown, emoji, toc } = await loadComark()

async function format(source) {
  // Same parse options as Studio's documentFromMarkdownContent, minus shiki: highlighting only
  // decorates code nodes and doesn't change the rendered markdown.
  const tree = await parseMarkdown(source, {
    autoClose: false,
    autoUnwrap: true,
    linkify: false,
    plugins: [emoji(), toc({ depth: 2, searchDepth: 2, title: '', links: [] })],
  })
  // Same render options as Studio's contentFromMarkdownDocument.
  const markdown = await renderMarkdown(tree, { blockAttributesStyle: 'frontmatter' })
  return padBlankLinesInComponents(markdown) + '\n'
}

const changed = []
for (const dir of dirs) {
  for await (const file of markdownFiles(resolve(dir))) {
    const source = await readFile(file, 'utf8')
    const formatted = await format(source)
    if (formatted === source) continue
    changed.push(relative(process.cwd(), file))
    if (!check) await writeFile(file, formatted)
  }
}

if (check && changed.length) {
  console.error(
    `Not in canonical Comark formatting (run content:format):\n  ${changed.join('\n  ')}`
  )
  process.exit(1)
}
console.log(
  changed.length
    ? `${check ? 'Would format' : 'Formatted'} ${changed.length} file(s):\n  ${changed.join('\n  ')}`
    : 'All content files are in canonical Comark formatting.'
)
