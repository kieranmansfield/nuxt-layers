# TODO

Planned future refactors, flagged 2026-08-31 after the layer tier reorg. None of these are
scoped yet — run brainstorming (architectural path likely) before starting any of them.

## Motion group

`layers/motion/` still has the `motion/motion` self-nested orchestrator layer (tier-parent
folder and its anchor layer share the name) — the same shape `core` and `content` were just
pulled out of. Left alone deliberately: motion has real siblings (`scroll`, `animations`,
`transitions`, `page-transitions`) so the tier folder itself still earns its keep; only the
`motion/motion` leaf reads oddly. Decide whether to rename the orchestrator layer or reshape the
tier.

## Layout system

Big refactor of the layout system (`layers/structure/layout/` — Grid/spacing/breakpoints,
HStack/VStack/ZStack/Spacer/AppContainer primitives). No scope defined yet.

## GSAP animations

Big refactor of how GSAP animations work (`layers/motion/scroll/`, `layers/motion/animations/`
— GSAP + Locomotive Scroll infrastructure, scroll-reactive components). No scope defined yet.
