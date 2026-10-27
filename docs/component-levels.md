# Component levels

Atomic design level for every UI component under `layers/**/app/components`. Folders stay by
domain (`Motion/`, `Layout/`); this table is the level record. `tests/vitest/component-levels.test.ts`
fails when a component is added without a row here, or a row points at a deleted file.

Dependencies point down: atom < molecule < organism < template < page. **behaviour** sits beside
atom: a slot wrapper that adds behaviour (motion, hover, error capture) and renders whatever it is
given, so it may wrap any level. `render/shader` pipeline nodes are a render graph, not UI, and are
left out.

| Level     | Meaning                                          |
| --------- | ------------------------------------------------ |
| atom      | One element or vendor primitive                  |
| behaviour | Slot wrapper adding behaviour, no markup opinion |
| molecule  | A few atoms doing one job                        |
| organism  | A standalone section                             |
| template  | Page-type skeleton: props and slots only         |
| page      | Binds route and data, fills one template         |

| Component                                                                  | Level     |
| -------------------------------------------------------------------------- | --------- |
| `layers/content/app/components/Blog/Article.vue`                           | organism  |
| `layers/content/app/components/Blog/ItemPage.vue`                          | page      |
| `layers/content/app/components/Blog/List.vue`                              | organism  |
| `layers/content/app/components/Blog/Page.vue`                              | page      |
| `layers/content/app/components/Gallery/Detail.vue`                         | organism  |
| `layers/content/app/components/Gallery/Grid.vue`                           | organism  |
| `layers/content/app/components/Gallery/ImageDetail.vue`                    | organism  |
| `layers/content/app/components/Gallery/ImagePage.vue`                      | page      |
| `layers/content/app/components/Gallery/Lightbox.vue`                       | organism  |
| `layers/content/app/components/Gallery/Page.vue`                           | page      |
| `layers/content/app/components/Gallery/SlugPage.vue`                       | page      |
| `layers/content/app/components/NuxtContent/Detail.vue`                     | template  |
| `layers/content/app/components/NuxtContent/IndexTemplate.vue`              | template  |
| `layers/content/app/components/NuxtContent/List.vue`                       | organism  |
| `layers/content/app/components/NuxtContent/Surround.vue`                   | molecule  |
| `layers/content/app/components/NuxtContent/Toc.vue`                        | molecule  |
| `layers/content/app/components/Portfolio/ColorPalette.vue`                 | organism  |
| `layers/content/app/components/Portfolio/Detail.vue`                       | organism  |
| `layers/content/app/components/Portfolio/ItemPage.vue`                     | page      |
| `layers/content/app/components/Portfolio/List.vue`                         | organism  |
| `layers/content/app/components/Portfolio/Page.vue`                         | page      |
| `layers/content/app/components/Portfolio/Typography.vue`                   | organism  |
| `layers/content/app/components/content/Figure.vue`                         | molecule  |
| `layers/core/app/components/AppContainer.vue`                              | atom      |
| `layers/core/app/components/DiagnosticsPage.vue`                           | organism  |
| `layers/core/app/components/Element.vue`                                   | atom      |
| `layers/core/app/components/ElementTw.vue`                                 | atom      |
| `layers/core/app/components/ErrorBoundary.vue`                             | behaviour |
| `layers/core/app/components/LoadingScreen.vue`                             | organism  |
| `layers/data/forms/app/components/Form/Contact.vue`                        | organism  |
| `layers/data/forms/app/components/Form/Field.vue`                          | molecule  |
| `layers/data/project-stats/app/components/ProjectStats/GithubCard.vue`     | organism  |
| `layers/data/project-stats/app/components/ProjectStats/ObsidianCard.vue`   | organism  |
| `layers/data/project-stats/app/components/ProjectStats/Stat.vue`           | molecule  |
| `layers/delivery/feeds/app/components/Feeds/Index.vue`                     | organism  |
| `layers/delivery/feeds/app/components/Feeds/RouteCard.vue`                 | molecule  |
| `layers/delivery/scripts/app/components/BaselineStatus.vue`                | atom      |
| `layers/design-system/theming/app/components/ThemePicker/AccentButton.vue` | atom      |
| `layers/design-system/theming/app/components/ThemePicker/Colors.vue`       | molecule  |
| `layers/design-system/theming/app/components/ThemePicker/Menu.vue`         | organism  |
| `layers/design-system/theming/app/components/ThemePicker/MenuButton.vue`   | atom      |
| `layers/design-system/typography/app/components/Typography/CodeBlock.vue`  | atom      |
| `layers/design-system/typography/app/components/Typography/Headline.vue`   | atom      |
| `layers/design-system/typography/app/components/Typography/QuoteBlock.vue` | molecule  |
| `layers/design-system/typography/app/components/Typography/RepeatText.vue` | atom      |
| `layers/design-system/typography/app/components/Typography/TextStroke.vue` | atom      |
| `layers/design-system/typography/app/components/Typography/index.vue`      | atom      |
| `layers/design-system/visual/app/components/Accent/Blob.vue`               | atom      |
| `layers/design-system/visual/app/components/Accent/Scene.vue`              | molecule  |
| `layers/design-system/visual/app/components/Base/Modal.vue`                | molecule  |
| `layers/design-system/visual/app/components/Gradient/Background.vue`       | atom      |
| `layers/design-system/visual/app/components/Gradient/Text.vue`             | atom      |
| `layers/design-system/visual/app/components/HoverDimGroup.vue`             | behaviour |
| `layers/design-system/visual/app/components/Media/Picture.vue`             | atom      |
| `layers/design-system/visual/app/components/Progress/Bar.vue`              | atom      |
| `layers/design-system/visual/app/components/Progress/Circular.vue`         | atom      |
| `layers/design-system/visual/app/components/Tint/Overlay.vue`              | atom      |
| `layers/motion/animations/app/components/Motion/CountUp.vue`               | atom      |
| `layers/motion/animations/app/components/Motion/Cursor.vue`                | atom      |
| `layers/motion/animations/app/components/Motion/Magnetic.vue`              | behaviour |
| `layers/motion/animations/app/components/Motion/Marquee.vue`               | behaviour |
| `layers/motion/animations/app/components/Motion/MarqueeText.vue`           | molecule  |
| `layers/motion/animations/app/components/Motion/Staggered.vue`             | behaviour |
| `layers/motion/animations/app/components/Motion/TextReveal.vue`            | atom      |
| `layers/motion/animations/app/components/Motion/Tilt.vue`                  | behaviour |
| `layers/motion/animations/app/components/Motion/VelocityEffect.vue`        | behaviour |
| `layers/motion/scroll/app/components/Motion/HorizontalScroll.vue`          | behaviour |
| `layers/motion/scroll/app/components/Motion/Parallax.vue`                  | behaviour |
| `layers/motion/scroll/app/components/Motion/PinnedSection.vue`             | behaviour |
| `layers/motion/scroll/app/components/Motion/ScrollLink.vue`                | atom      |
| `layers/motion/scroll/app/components/Motion/ScrollProgress.vue`            | atom      |
| `layers/motion/scroll/app/components/Motion/ScrollScene.vue`               | behaviour |
| `layers/motion/scroll/app/components/Motion/ScrollStats.vue`               | molecule  |
| `layers/motion/scroll/app/components/Motion/ScrollStep.vue`                | behaviour |
| `layers/motion/transitions/app/components/Motion/Transition.vue`           | behaviour |
| `layers/render/canvas/app/components/ShaderCanvas.vue`                     | atom      |
| `layers/structure/layout/app/components/HStack.vue`                        | atom      |
| `layers/structure/layout/app/components/Layout/Grid/Debug.vue`             | atom      |
| `layers/structure/layout/app/components/Layout/Grid/Item.vue`              | atom      |
| `layers/structure/layout/app/components/Layout/Main.vue`                   | template  |
| `layers/structure/layout/app/components/Layout/Page/Header.vue`            | organism  |
| `layers/structure/layout/app/components/Layout/Page/index.vue`             | template  |
| `layers/structure/layout/app/components/Layout/Section/Gallery.vue`        | organism  |
| `layers/structure/layout/app/components/Layout/Section/Hero.vue`           | organism  |
| `layers/structure/layout/app/components/Layout/Section/Split.vue`          | organism  |
| `layers/structure/layout/app/components/Layout/Section/index.vue`          | organism  |
| `layers/structure/layout/app/components/Spacer.vue`                        | atom      |
| `layers/structure/layout/app/components/VStack.vue`                        | atom      |
| `layers/structure/layout/app/components/ZStack.vue`                        | atom      |
| `layers/structure/navigation/app/components/Links/Group.vue`               | behaviour |
| `layers/structure/navigation/app/components/Links/Named.vue`               | atom      |
| `layers/structure/navigation/app/components/Mast/Footer.vue`               | organism  |
| `layers/structure/navigation/app/components/Mast/Header.vue`               | organism  |
| `layers/structure/navigation/app/components/Mast/Nav.vue`                  | organism  |
| `layers/structure/navigation/app/components/Mast/NavModal.vue`             | organism  |
| `layers/structure/navigation/app/components/Site/Logo.vue`                 | atom      |
| `layers/structure/navigation/app/components/Site/Subtitle.vue`             | atom      |
| `layers/structure/navigation/app/components/Site/Title.vue`                | atom      |
