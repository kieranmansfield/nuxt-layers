import { registerProvider } from '#layers/metadata/server/utils/metadata/provider-registry'
import { googleBooksProvider } from '../utils/metadata-google-books/provider'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  registerProvider(googleBooksProvider)
})
