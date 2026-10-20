import { registerProvider } from '#layers/metadata/server/utils/metadata/provider-registry'
import { openLibraryProvider } from '../utils/metadata-openlibrary/provider'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  registerProvider(openLibraryProvider)
})
