import type { PageOverlay } from '../types'

const ID = 'page-transition-overlay'

export function getPageOverlay(): PageOverlay {
  let el = document.getElementById(ID)
  if (!el) {
    el = document.createElement('div')
    el.id = ID
    el.className = 'page-transition-overlay'
    el.setAttribute('aria-hidden', 'true')
    document.body.append(el)
  }
  const root = el
  return {
    cells: () => [...root.children] as HTMLElement[],
    fill(cols, rows) {
      root.style.setProperty('--po-cols', String(cols))
      root.style.setProperty('--po-rows', String(rows))
      root.replaceChildren(
        ...Array.from({ length: cols * rows }, () => document.createElement('div'))
      )
      return [...root.children] as HTMLElement[]
    },
  }
}

export function clearPageOverlay() {
  document.getElementById(ID)?.replaceChildren()
}
