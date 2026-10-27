import { ACCENT_PALETTES } from '../../server/utils/accent-css.mjs';
/**
 * Derives Nuxt UI's `ui.colors` shape from the same accent-relationship table
 * accent-css.ts uses for its per-accent CSS-var generation, so app.config
 * consumers never hand-pick a colour triple that can drift from it.
 *
 * Kept free of any `#`-aliased import (only relative imports) — this file is
 * also imported from nuxt.config.ts, which type-checks under a Node-only
 * project with no app path aliases registered.
 */
export function resolveUiColors(accent) {
    const { secondary, info } = ACCENT_PALETTES[accent];
    return {
        primary: accent,
        secondary,
        info,
        neutral: 'neutral',
    };
}
