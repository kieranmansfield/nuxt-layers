import { resolveRecord } from '../../utils/metadata/resolve-record'
import { defineEventHandler, readBody } from 'h3'
import type { MetadataSyncInput } from '#layers/metadata/shared/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<MetadataSyncInput>(event)
  return resolveRecord({ ...body })
})
