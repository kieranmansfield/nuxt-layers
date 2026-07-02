import { describe, expect, it } from 'vitest'

import { buildThemeInitScript } from './fouc-config'

describe('buildThemeInitScript', () => {
  const script = buildThemeInitScript('blue')

  it('wraps the whole script in a try/catch IIFE', () => {
    expect(script.startsWith('(function(){try{')).toBe(true)
    expect(script.endsWith('}catch(e){}})()')).toBe(true)
  })

  it('captures document.documentElement as h', () => {
    expect(script).toContain('var h=document.documentElement;')
  })

  it('reads theme-colour from localStorage and falls back to the default accent', () => {
    expect(script).toContain(
      "var c=localStorage.getItem('theme-colour');h.setAttribute('data-theme-colour',c?JSON.parse(c):'blue');"
    )
  })

  it('uses the provided default accent verbatim, not a hardcoded one', () => {
    const other = buildThemeInitScript('rose')
    expect(other).toContain("h.setAttribute('data-theme-colour',c?JSON.parse(c):'rose');")
    expect(other).not.toContain("'blue'")
  })

  it('emits a JSON-parsed tri-state block for theme-contrast', () => {
    expect(script).toContain("var ct=localStorage.getItem('theme-contrast');")
    expect(script).toContain("var ctv=ct?JSON.parse(ct):'system';")
    expect(script).toContain("if(ctv==='on'){h.setAttribute('data-theme-contrast','high')}")
    expect(script).toContain("else if(ctv==='off'){h.setAttribute('data-theme-contrast','standard')}")
    expect(script).toContain(
      "else{h.setAttribute('data-theme-contrast',(window.matchMedia&&window.matchMedia('(prefers-contrast:more)').matches)?'high':'standard')}"
    )
  })

  it('emits a JSON-parsed tri-state block for theme-motion', () => {
    expect(script).toContain("var m=localStorage.getItem('theme-motion');")
    expect(script).toContain("if(mv==='on'){h.setAttribute('data-theme-motion','reduced')}")
    expect(script).toContain("else if(mv==='off'){h.setAttribute('data-theme-motion','full')}")
    expect(script).toContain(
      "window.matchMedia('(prefers-reduced-motion:reduce)').matches)?'reduced':'full'"
    )
  })

  it('emits a JSON-parsed tri-state block for theme-transparency', () => {
    expect(script).toContain("var t=localStorage.getItem('theme-transparency');")
    expect(script).toContain("if(tv==='on'){h.setAttribute('data-theme-transparency','reduced')}")
    expect(script).toContain("else if(tv==='off'){h.setAttribute('data-theme-transparency','full')}")
    expect(script).toContain(
      "window.matchMedia('(prefers-reduced-transparency:reduce)').matches)?'reduced':'full'"
    )
  })

  it('emits a plain (non-JSON) tri-state block for theme-mode using dark/light conditions', () => {
    expect(script).toContain("var dm=localStorage.getItem('theme-mode');")
    expect(script).toContain("var dmv=dm||'system';")
    expect(script).toContain("if(dmv==='dark'){h.setAttribute('data-theme-mode','dark')}")
    expect(script).toContain("else if(dmv==='light'){h.setAttribute('data-theme-mode','light')}")
    expect(script).toContain(
      "window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'"
    )
  })

  it('does not JSON.parse the theme-mode value (jsonParsed: false)', () => {
    expect(script).not.toContain("JSON.parse(dm)")
  })

  it('produces valid, evaluable JavaScript', () => {
    expect(() => new Function(script)).not.toThrow()
  })
})
