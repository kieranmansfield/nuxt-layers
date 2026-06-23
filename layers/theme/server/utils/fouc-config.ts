type TriStatePreference = {
  varName: string
  storageKey: string
  attribute: string
  jsonParsed: boolean
  conditionA: string
  valueA: string
  conditionB: string
  valueB: string
  mediaQuery: string
  mediaTrue: string
  mediaFalse: string
}

// Each entry produces one tri-state block in the FOUC init script.
// Adding a new theme preference = adding one entry here.
const THEME_PREFERENCES: TriStatePreference[] = [
  {
    varName: 'ct',
    storageKey: 'theme-contrast',
    attribute: 'data-theme-contrast',
    jsonParsed: true,
    conditionA: 'on', valueA: 'high',
    conditionB: 'off', valueB: 'standard',
    mediaQuery: '(prefers-contrast:more)',
    mediaTrue: 'high', mediaFalse: 'standard',
  },
  {
    varName: 'm',
    storageKey: 'theme-motion',
    attribute: 'data-theme-motion',
    jsonParsed: true,
    conditionA: 'on', valueA: 'reduced',
    conditionB: 'off', valueB: 'full',
    mediaQuery: '(prefers-reduced-motion:reduce)',
    mediaTrue: 'reduced', mediaFalse: 'full',
  },
  {
    varName: 't',
    storageKey: 'theme-transparency',
    attribute: 'data-theme-transparency',
    jsonParsed: true,
    conditionA: 'on', valueA: 'reduced',
    conditionB: 'off', valueB: 'full',
    mediaQuery: '(prefers-reduced-transparency:reduce)',
    mediaTrue: 'reduced', mediaFalse: 'full',
  },
  {
    varName: 'dm',
    storageKey: 'theme-mode',
    attribute: 'data-theme-mode',
    jsonParsed: false,
    conditionA: 'dark', valueA: 'dark',
    conditionB: 'light', valueB: 'light',
    mediaQuery: '(prefers-color-scheme:dark)',
    mediaTrue: 'dark', mediaFalse: 'light',
  },
]

function buildPrefFragment(p: TriStatePreference): string {
  const readValue = p.jsonParsed
    ? `${p.varName}?JSON.parse(${p.varName}):'system'`
    : `${p.varName}||'system'`
  return (
    `var ${p.varName}=localStorage.getItem('${p.storageKey}');` +
    `var ${p.varName}v=${readValue};` +
    `if(${p.varName}v==='${p.conditionA}'){h.setAttribute('${p.attribute}','${p.valueA}')}` +
    `else if(${p.varName}v==='${p.conditionB}'){h.setAttribute('${p.attribute}','${p.valueB}')}` +
    `else{h.setAttribute('${p.attribute}',(window.matchMedia&&window.matchMedia('${p.mediaQuery}').matches)?'${p.mediaTrue}':'${p.mediaFalse}')}`
  )
}

export function buildThemeInitScript(defaultAccent: string): string {
  const colourBlock =
    `var c=localStorage.getItem('theme-colour');` +
    `h.setAttribute('data-theme-colour',c?JSON.parse(c):'${defaultAccent}');`

  return (
    '(function(){try{' +
    'var h=document.documentElement;' +
    colourBlock +
    THEME_PREFERENCES.map(buildPrefFragment).join('') +
    '}catch(e){}})()'
  )
}
