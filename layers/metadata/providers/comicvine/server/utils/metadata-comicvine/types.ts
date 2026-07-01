export type ComicVineApiResponse<T> = {
  error: string
  limit: number
  offset: number
  number_of_page_results: number
  number_of_total_results: number
  status_code: number
  results: T
}

export type ComicVineIssue = {
  id: number
  name: string | null
  issue_number: string
  description: string | null
  deck: string | null
  cover_date: string | null
  store_date: string | null
  site_detail_url: string
  image: { original_url: string; medium_url: string } | null
  volume: { id: number; name: string } | null
  person_credits: Array<{ id: number; name: string; role: string }> | null
  publisher: { id: number; name: string } | null
}

export type ComicVineVolume = {
  id: number
  name: string
  description: string | null
  deck: string | null
  start_year: string | null
  count_of_issues: number | null
  site_detail_url: string
  image: { original_url: string; medium_url: string } | null
  publisher: { id: number; name: string } | null
  people: Array<{ id: number; name: string; role: string }> | null
}
