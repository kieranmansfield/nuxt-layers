export type TMDBExternalIds = {
  imdb_id?: string
  tvdb_id?: number
}

export type TMDBCrewMember = {
  id: number
  name: string
  job: string
  department: string
}

export type TMDBCastMember = {
  id: number
  name: string
  character: string
  order: number
}

export type TMDBCredits = {
  cast: TMDBCastMember[]
  crew: TMDBCrewMember[]
}

export type TMDBCreatedBy = {
  id: number
  name: string
}

export type TMDBMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime?: number
  genres?: Array<{ id: number; name: string }>
  production_companies?: Array<{ id: number; name: string }>
  status?: string
  external_ids?: TMDBExternalIds
  credits?: TMDBCredits
}

export type TMDBTVShow = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  number_of_seasons?: number
  genres?: Array<{ id: number; name: string }>
  networks?: Array<{ id: number; name: string }>
  created_by?: TMDBCreatedBy[]
  status?: string
  external_ids?: TMDBExternalIds
  credits?: TMDBCredits
}

export type TMDBSearchMultiResult = {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  overview?: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
}

export type TMDBSearchResponse = {
  results: TMDBSearchMultiResult[]
  total_results: number
  page: number
}

export type TMDBFindResponse = {
  movie_results: TMDBMovie[]
  tv_results: TMDBTVShow[]
}
