export default defineNuxtConfig({
    $meta: { name: 'scroll' },
    extends: ['../../core', '../../design-system/visual'],
    alias: {
        '#layers/scroll': import.meta.dirname,
        '#layers/scroll/types': `${import.meta.dirname}/app/types`,
    },
    modules: ['v-gsap-nuxt'],
    vgsap: {
        composable: true,
    },
    compatibilityDate: '2026-06-06',
    typescript: {
        typeCheck: false,
        strict: true,
    },
    build: {
        transpile: ['gsap'],
    },
    vite: {
        optimizeDeps: {
            include: ['locomotive-scroll'],
        },
    },
});
