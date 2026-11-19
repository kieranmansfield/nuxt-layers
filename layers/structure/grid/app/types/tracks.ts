export type TrackSegment = {
  /** Relative size, same unit as CSS `fr`. 1 = one equal column. */
  size: number
  /** Optional named line(s) at the start of this segment, e.g. 'feature-start'. */
  lineStart?: string | string[]
  /** Optional named line(s) at the end of this segment. */
  lineEnd?: string | string[]
}

export type TrackConfig = {
  columns: TrackSegment[]
  /** Track floor — reuses --measure-min unless overridden. */
  minTrackWidth?: string
}

export type GridPreset = TrackConfig & {
  name: string
}
