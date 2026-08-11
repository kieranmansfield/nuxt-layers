Yes. Based on the package.json you shared, I’d treat this as a small project automation system, rather than simply adding more npm scripts.

The goal I’d aim for is:

Every Nuxt project has the same predictable developer commands, while the Nuxt layers repo owns the more sophisticated automation that keeps those projects healthy and up to date.

1. First: define the command architecture

Your current scripts already cover most of the raw operations. I would reorganise them into five conceptual groups:

Development
├── dev
├── preview
└── kill
Build
├── build
├── generate
├── analyze
├── build:analyze
├── content:build
└── rebuild
Quality
├── lint
├── lint:js
├── lint:style
├── lint:types
├── typecheck
├── format
├── format:check
├── fix
├── check
└── validate
Dependencies
├── deps:check
├── deps:update
├── deps:update:latest
└── framework:update
Maintenance
├── clean
├── reset
├── clean:cache
├── browserlist
├── doctor
└── info
Tooling
├── vscode:sync
└── lint:sync

Then the important commands become:

pnpm dev
pnpm check
pnpm fix
pnpm validate
pnpm framework:update
pnpm deps:update
pnpm doctor

Those are the commands I’d expect you to actually use regularly.

⸻

2. Clean up the existing package.json first

Before building new automation, I’d remove some ambiguity.

Current

"format": "... --write .",
"format:fix": "... --write ."

Make only one the fixing operation:

"format": "prettier ... --write .",
"format:check": "prettier ... --check ."

Likewise, make lint non-mutating.

Currently:

"lint:js": "eslint --fix"

I’d change that to:

"lint:js": "eslint ."

and let:

"lint:fix": "eslint . --fix"

be the mutation command.

That gives you a very important rule:

check commands should never modify the project.

⸻

3. Introduce check

This should become your canonical “is this code okay?” command.

I’d make:

"check": "pnpm run lint && pnpm run typecheck && pnpm run format:check"

Potentially include lint:types if you decide that vue-tsc provides something valuable that nuxt typecheck doesn’t.

The distinction should be:

check
  ├── ESLint
  ├── Stylelint
  ├── TypeScript
  └── Prettier
validate
  └── check
      +
      production build

So:

pnpm check

means:

Is my source code valid?

while:

pnpm validate

means:

Is this project actually ready to ship?

⸻

4. Make fix the opposite of check

Your existing:

"fix": "pnpm run format:fix && pnpm run lint:fix"

is already close.

I’d extend it to:

pnpm fix
    │
    ├── Prettier
    ├── ESLint
    └── Stylelint

Then the workflow becomes beautifully simple:

pnpm fix
pnpm check

That’s something I’d use constantly.

⸻

5. Redefine validate

I’d change your current:

"validate": "pnpm run lint:all && pnpm run typecheck"

to something more meaningful:

"validate": "pnpm run check && pnpm run build"

Now you have:

fix       → modify things to make them better
check     → source-level validation
validate  → source validation + production build

That’s a very clean contract.

⸻

6. Separate clean, reset, and cache maintenance

Your current:

"clean": "rm -rf ./node_modules pnpm-lock.yaml .nuxt .output .data && pnpm store prune && pnpm install"

is too destructive for something called clean.

I’d split it:

{
  "clean": "nuxt cleanup",
  "reset": "node scripts/reset.mjs",
  "clean:cache": "pnpm store prune"
}

Where reset deliberately does the nuclear option:

remove node_modules
remove .nuxt
remove .output
remove .data
remove lockfile (if intentionally desired)
install again

I would not normally delete pnpm-lock.yaml as part of a standard reset. Make that a deliberate reset:lockfile if you actually need it.

⸻

7. Move OS-specific/complex commands into scripts/

Create:

scripts/
├── kill.mjs
├── reset.mjs
├── doctor.mjs
├── info.mjs
├── framework-update.mjs
└── release.mjs

Don’t create Node scripts just because you can, though.

The rule I’d use:

Simple command → package.json. Complex workflow → Node script.

So this:

"build": "nuxt build"

stays in package.json.

But this:

clean cache
update 8 packages
reinstall
regenerate
typecheck
build
handle errors

belongs in:

scripts/framework-update.mjs

⸻

8. Build framework:update as the first major automation

This is the one I think is most valuable for your setup.

Instead of:

"deps:update:nuxt": "pnpm run cleancache && pnpm run nuxtupdate && ncu -u @nuxt/ui && pnpm install && pnpm run cleanup"

you’ll have:

"framework:update": "node scripts/framework-update.mjs"

The script should understand the concept of a Nuxt framework stack.

Initially:

const frameworkPackages = [
  "nuxt",
  "@nuxt/ui",
  "@nuxt/content",
  "@nuxt/image",
  "@nuxt/fonts",
  "vue",
  "vue-router",
  "tailwindcss"
]

But importantly, it should inspect package.json and only operate on packages actually present.

That makes the automation reusable between:

* simple Nuxt sites
* Nuxt sites using Content
* Nuxt sites using UI
* your layers repository
* future projects with additional Nuxt modules

⸻

9. Make framework:update deliberately thorough

I’d design its lifecycle approximately like this:

pnpm framework:update
        │
        ▼
Check Git state
        │
        ▼
Detect framework packages
        │
        ▼
Remove generated Nuxt artefacts
        │
        ▼
Update framework dependencies
        │
        ▼
pnpm install
        │
        ▼
nuxt prepare
        │
        ▼
Typecheck
        │
        ▼
Build
        │
        ▼
Report result

The important thing is that this is not simply dependency updating.

It’s:

Update the framework and prove that the project can still be rebuilt.

⸻

10. Give the framework updater profiles

This is where I think your idea becomes really powerful.

Eventually:

pnpm framework:update

could mean normal Nuxt ecosystem updating.

But:

pnpm framework:update:nuxt
pnpm framework:update:ui
pnpm framework:update:tailwind

could target particular ecosystems.

Or, more elegantly:

pnpm framework:update --nuxt
pnpm framework:update --ui
pnpm framework:update --tailwind
pnpm framework:update --all

You don’t necessarily need to build all of that initially.

I’d start with:

pnpm framework:update

and make it update the whole known framework stack.

⸻

11. Then build dependency automation

Your current:

"update": "ncu -i",
"deps:update": "ncu -u && pnpm install",
"deps:check": "ncu --format group"

can become:

deps:check
    ↓
Show available updates
deps:update
    ↓
Update within declared ranges
deps:update:latest
    ↓
Explicitly jump to latest versions

I’d keep npm-check-updates here because it’s useful for deliberately discovering/upgrading versions beyond the ranges currently declared in package.json.

⸻

12. Add a proper release/versioning system to the layers repo

This is separate from dependency updates.

I’d have:

pnpm version:patch
pnpm version:minor
pnpm version:major

and eventually:

pnpm release:patch
pnpm release:minor
pnpm release:major

The difference:

Version

Only changes the version.

Release

Does something closer to:

check Git state
     ↓
update dependencies if appropriate
     ↓
check
     ↓
build layers
     ↓
test layers
     ↓
bump version
     ↓
commit
     ↓
tag

I’d make this a layers-repo-specific system, rather than putting it into every website.

⸻

13. Build a doctor command

This would be extremely useful for both your boilerplate and layers repo.

pnpm doctor

It should check:

Runtime

Node version
pnpm version
package manager

Framework

Nuxt
Vue
Nuxt UI
Tailwind

Project

package.json
lockfile
Nuxt config
TypeScript
ESLint
Prettier
Stylelint

Environment

required environment variables
.env files

Git

repository
branch
working tree

Output something like:

Nuxt Project Doctor
────────────────────────────
Runtime
✓ Node 24.16.0
✓ pnpm 11.8.0
Framework
✓ Nuxt
✓ Vue
✓ Nuxt UI
✓ Tailwind
Tooling
✓ ESLint
✓ Stylelint
✓ Prettier
✓ TypeScript
Project
✓ Nuxt configuration
✓ Lockfile
✓ Git repository
No problems found.

⸻

14. Add info

Different from doctor.

doctor asks:

Is something wrong?

info asks:

What exactly is this project running?

pnpm info

I’d include:

Project
Version
Node
pnpm
Nuxt
Vue
Nuxt UI
Tailwind
Browser targets
Git branch

This is particularly useful when debugging dependency issues.

⸻

15. Build the layers repo around the same contract

This is important.

Your layers repo should have the same basic commands:

pnpm dev
pnpm check
pnpm fix
pnpm validate
pnpm clean
pnpm reset
pnpm deps:check
pnpm deps:update
pnpm framework:update
pnpm doctor

Then add layer-specific commands:

pnpm layer:list
pnpm layer:create
pnpm layer:check
pnpm layer:build
pnpm layer:test

So every Nuxt project you’ve got has the same base interface.

⸻

16. Add layer discovery/build automation

Eventually the layers repo can inspect:

layers/
├── animations/
├── content/
├── design-system/
├── seo/
└── ...

and automatically discover them.

Then:

pnpm layer:list

could output:

Available Layers
✓ animations
✓ content
✓ design-system
✓ seo
✓ typography

And:

pnpm layer:check

could validate every layer.

That gives you the foundation for automated releases later.

⸻

17. Eventually make releases layer-aware

This is where I’d eventually take the system.

Imagine:

pnpm release

The tooling determines:

Changed:
  layers/design-system
  layers/typography

and can eventually determine whether you need:

patch
minor
major

or ask you.

For now, I’d keep versioning straightforward, but design the release tooling so it isn’t impossible to introduce this later.

⸻

18. Standardise the project template

Once all of this works in your layers repo, I’d turn the automation contract itself into part of your Nuxt boilerplate.

Your boilerplate becomes something like:

nuxt-frontend-boilerplate/
├── .github/
├── .vscode/
├── assets/
├── components/
├── composables/
├── layouts/
├── pages/
├── public/
├── scripts/
│   ├── doctor.mjs
│   ├── framework-update.mjs
│   ├── info.mjs
│   └── reset.mjs
├── server/
├── app.vue
├── nuxt.config.ts
├── package.json
└── ...

And every project starts with the same automation.

⸻

19. The final package.json I’d be aiming toward

Not necessarily immediately, but as the end state:

{
  "scripts": {
    "dev": "nuxt dev",
    "preview": "nuxt preview",
    "kill": "node scripts/kill.mjs",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "analyze": "nuxt analyze",
    "build:analyze": "nuxt build --analyze",
    "content:build": "nuxt content build",
    "lint": "pnpm run lint:js && pnpm run lint:style",
    "lint:js": "eslint .",
    "lint:style": "stylelint \"**/*.{vue,scss,css}\"",
    "lint:types": "vue-tsc --noEmit --strict",
    "lint:fix": "node scripts/lint-fix.mjs",
    "format": "prettier --config prettier.config.cjs --ignore-path .prettierignore --write .",
    "format:check": "prettier --config prettier.config.cjs --ignore-path .prettierignore --check .",
    "typecheck": "nuxt typecheck",
    "check": "pnpm run lint && pnpm run typecheck && pnpm run format:check",
    "fix": "pnpm run format && pnpm run lint:fix",
    "validate": "pnpm run check && pnpm run build",
    "clean": "nuxt cleanup",
    "reset": "node scripts/reset.mjs",
    "clean:cache": "pnpm store prune",
    "deps:check": "ncu --format group",
    "deps:update": "ncu -u && pnpm install",
    "deps:update:latest": "pnpm update --latest",
    "framework:update": "node scripts/framework-update.mjs",
    "doctor": "node scripts/doctor.mjs",
    "info": "node scripts/info.mjs",
    "browserlist": "pnpm dlx update-browserslist-db@latest",
    "vscode:sync": "git fetch vscode-config && git checkout vscode-config/main -- .vscode/",
    "lint:sync": "git fetch tooling-config && git checkout tooling-config/main -- .editorconfig eslint.config.mjs prettier.config.cjs .prettierignore stylelint.config.mjs",
    "postinstall": "nuxt prepare"
  }
}

I wouldn’t blindly copy that yet — this is the target architecture, not necessarily the first implementation.

⸻

20. Implementation order

I’d build this in this order rather than trying to do everything simultaneously.

Phase 1 — Clean up

Refactor the existing package.json:

* remove duplicate format/format:fix
* make lint non-mutating
* separate clean from reset
* clean up dependency naming
* introduce check
* redefine validate

Phase 2 — Basic helpers

Create:

scripts/
├── kill.mjs
├── reset.mjs
├── doctor.mjs
└── info.mjs

Phase 3 — Framework updater

Build:

scripts/framework-update.mjs

This is the most important new piece.

Start with:

Nuxt
Nuxt UI
Vue
Vue Router
Tailwind
installed Nuxt modules

and make it:

detect → update → reinstall → prepare → typecheck → build

Phase 4 — Dependency system

Implement:

deps:check
deps:update
deps:update:latest

and ensure they don’t conflict with framework:update.

Phase 5 — Layers tooling

In the layers repo:

layer:list
layer:create
layer:check
layer:build
layer:test

Phase 6 — Versioning

Add:

version:patch
version:minor
version:major

Then build:

release:patch
release:minor
release:major

Phase 7 — Release automation

Eventually:

Git state
 ↓
dependency state
 ↓
framework compatibility
 ↓
layer validation
 ↓
build
 ↓
tests
 ↓
version
 ↓
commit
 ↓
tag
 ↓
publish

At that point your layers repository effectively has its own release system.

⸻

The key architectural principle

I think the most important thing is not to turn package.json into a giant collection of clever shell commands.

Use it as the public API:

pnpm check
pnpm fix
pnpm validate
pnpm deps:update
pnpm framework:update
pnpm doctor
pnpm release

Then put the intelligence behind those commands:

package.json
     │
     ├── simple commands ──────→ Nuxt / pnpm / ESLint
     │
     └── complex commands ─────→ scripts/*.mjs
                                  │
                                  ├── dependency management
                                  ├── framework updates
                                  ├── project diagnostics
                                  ├── layer management
                                  └── release management

That gives you something much more valuable than a large `package.json: a consistent automation layer for your entire Nuxt ecosystem.

And I think framework:update + the layers-repo release/versioning system should be the two centrepieces. The former keeps every Nuxt project rebuildable after major ecosystem updates; the latter gives your reusable layers a proper lifecycle from development → validation → version → release.
