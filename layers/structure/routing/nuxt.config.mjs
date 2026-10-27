import { resolve } from 'node:path';
export default defineNuxtConfig({
    $meta: { name: 'routing' },
    extends: ['../../core'],
    alias: {
        '#layers/routing': import.meta.dirname,
        '#layers/routing/types': `${import.meta.dirname}/app/types`,
    },
    compatibilityDate: '2026-01-30',
    typescript: {
        typeCheck: false,
        strict: true,
    },
    modules: [
        // Tag pages that don't live in the app's own pages dir. Compared against the app's pages
        // dir, not process.cwd(): an npm consumer's layer pages sit under <app>/node_modules, which
        // is inside cwd, so a cwd prefix check never tagged anything.
        (_options, nuxt) => {
            const appPagesDir = `${resolve(nuxt.options.srcDir, nuxt.options.dir.pages)}/`;
            nuxt.hook('pages:extend', (pages) => {
                const tag = (list) => {
                    for (const page of list) {
                        if (page.file && !page.file.startsWith(appPagesDir)) {
                            page.meta ??= {};
                            page.meta.__fromLayer = true;
                        }
                        if (page.children)
                            tag(page.children);
                    }
                };
                tag(pages);
            });
        },
    ],
});
