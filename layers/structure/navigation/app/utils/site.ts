import { splitSpaces } from '../utils/regex'

function resolveSiteText(value?: string) {
  const text = value ?? ''
  return {
    text,
    words: splitSpaces(text) as string[],
  }
}

export function resolveSiteConfig(site: {
  title?: string
  subtitle?: string
  description?: string
}) {
  const title = resolveSiteText(site.title)
  const subtitle = resolveSiteText(site.subtitle)

  return {
    title: title.text,
    titleWords: title.words,
    subtitle: subtitle.text,
    subtitleWords: subtitle.words,
    description: site.description ?? '',
  }
}
