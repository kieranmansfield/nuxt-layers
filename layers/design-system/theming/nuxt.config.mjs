// Theme Layer - Color mode, accent colors, accessibility preferences
import { resolveUiColors } from '../../../config-runtime/layers/design-system/theming/app/utils/themeAdapter.mjs';
export default defineNuxtConfig({
    $meta: {
        name: 'theming',
    },
    extends: ['../../core', '../typography'],
    runtimeConfig: {
        public: {
            themeDefaultAccent: 'blue',
        },
    },
    alias: {
        '#layers/theming': import.meta.dirname,
        '#layers/theming/types': `${import.meta.dirname}/app/types`,
    },
    // Shadow/duration tokens live in core (core/app/assets/css/tokens/elevation-motion.css).
    css: ['#layers/theming/app/assets/css/theme.css'],
    colorMode: {
        dataValue: 'theme-mode',
        storageKey: 'theme-mode',
    },
    appConfig: {
        ui: {
            colors: resolveUiColors('blue'),
        },
    },
    compatibilityDate: '2026-01-30',
    typescript: {
        typeCheck: false,
        strict: true,
    },
});
