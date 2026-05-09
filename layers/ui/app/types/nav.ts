export interface MastNavLink {
  id: string
  label: string
  to: string | { name: string; params?: Record<string, string | number>; query?: Record<string, string | number> }
}
