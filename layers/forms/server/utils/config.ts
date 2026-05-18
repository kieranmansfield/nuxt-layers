interface FormsLayerConfig {
  resendApiKey: string
  emailFrom: string
  emailTo: string
}

export function useFormsConfig(): FormsLayerConfig {
  return (useRuntimeConfig() as unknown as { formsLayer: FormsLayerConfig }).formsLayer
}
