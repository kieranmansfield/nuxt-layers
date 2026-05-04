import { splitSpaces } from '../utils/regex'

export function useSite() {
  const config = useAppConfig().site

  return {
    title: config.title as string,
    titleWords: splitSpaces(config.title as string) as string[],
    subtitle: config.subtitle as string,
    subtitleWords: splitSpaces(config.subtitle as string) as string[],
    description: config.description as string,
  }
}
