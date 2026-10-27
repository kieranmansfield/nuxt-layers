import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(
  process.env.LAYER_PACKAGE_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), '..')
)
const packagePath = resolve(root, 'package.json')
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
const generated = new Set()
const entryPoints = new Set()

function outputPathFor(sourcePath) {
  if (entryPoints.has(sourcePath)) return sourcePath.replace(/\.ts$/, '.mjs')
  return resolve(root, 'config-runtime', relative(root, sourcePath).replace(/\.ts$/, '.mjs'))
}

async function generate(sourcePath) {
  const absoluteSource = resolve(sourcePath)
  if (generated.has(absoluteSource)) return
  generated.add(absoluteSource)

  const source = await readFile(absoluteSource, 'utf8')
  const outputPath = outputPathFor(absoluteSource)
  const output = absoluteSource.endsWith('.ts')
    ? ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText
    : source
  const importPattern = /\bfrom\s*(['"])(\.{1,2}\/[^'"]+\.ts)\1/g

  for (const match of output.matchAll(importPattern)) {
    await generate(resolve(dirname(absoluteSource), match[2]))
  }

  const nativeOutput = output.replace(importPattern, (_match, quote, specifier) => {
    const importedSource = resolve(dirname(absoluteSource), specifier)
    let importedOutput = relative(dirname(outputPath), outputPathFor(importedSource)).replaceAll(
      '\\',
      '/'
    )
    if (!importedOutput.startsWith('.')) importedOutput = `./${importedOutput}`
    return `from ${quote}${importedOutput}${quote}`
  })
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, nativeOutput)
  console.log(`Generated ${relative(root, outputPath)}`)
}

const entrySources = []
for (const [name, target] of Object.entries(packageJson.exports)) {
  if (!target.endsWith('/nuxt.config.ts') && !target.endsWith('/nuxt.config.mjs')) continue

  const typescriptSource = resolve(root, target.replace(/\.mjs$/, '.ts'))
  const sourcePath = target.endsWith('.mjs')
    ? await readFile(typescriptSource, 'utf8').then(
        () => typescriptSource,
        () => resolve(root, target)
      )
    : resolve(root, target)
  entryPoints.add(sourcePath)
  entrySources.push(sourcePath)
  packageJson.exports[name] = target.replace(/\.ts$/, '.mjs')
}

for (const sourcePath of entrySources) {
  await generate(sourcePath)
}

for (const pattern of [
  'layers/*/nuxt.config.mjs',
  'layers/*/*/nuxt.config.mjs',
  'layers/*/*/providers/*/nuxt.config.mjs',
  'config-runtime/**',
  '!layers/**/nuxt.config.ts',
]) {
  if (!packageJson.files.includes(pattern)) packageJson.files.push(pattern)
}

async function updateLayerPackageManifests(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      await updateLayerPackageManifests(path)
      continue
    }
    if (entry.name !== 'package.json') continue

    const layerPackage = JSON.parse(await readFile(path, 'utf8'))
    if (layerPackage.main?.endsWith('/nuxt.config.ts')) {
      layerPackage.main = layerPackage.main.replace(/\.ts$/, '.mjs')
      await writeFile(path, `${JSON.stringify(layerPackage, null, 2)}\n`)
      console.log(`Updated ${relative(root, path)}`)
    }
  }
}

await updateLayerPackageManifests(resolve(root, 'layers'))
await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
