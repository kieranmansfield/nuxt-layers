import { registerProvider } from '#layers/metadata/server/utils/metadata/provider-registry'
import { tmdbProvider } from '../utils/metadata-tmdb/provider'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  registerProvider(tmdbProvider)
})
