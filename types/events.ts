/** @consumers motion, core */
export interface ScrollLockEvent {
  locked: boolean
  /** Which layer/component emitted this event */
  source: string
}

/** @consumers core */
export interface LoadingStateEvent {
  loading: boolean
  id?: string
}

/** @consumers core, motion */
export type LayerEvent =
  | { type: 'scroll:lock'; payload: ScrollLockEvent }
  | { type: 'loading:state'; payload: LoadingStateEvent }
