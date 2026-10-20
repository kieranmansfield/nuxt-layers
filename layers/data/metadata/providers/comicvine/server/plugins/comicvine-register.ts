import { registerProvider } from '#layers/metadata/server/utils/metadata/provider-registry'
import { comicVineProvider } from '../utils/metadata-comicvine/provider'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  registerProvider(comicVineProvider)
})
