---
title: Marché — E-Commerce Rebuild
description: Rebuilding a fashion retailer's online presence from a sluggish monolith into something that actually feels good to shop on.
image: https://picsum.photos/seed/portfolio2/800/400
tags:
  - development
  - e-commerce
  - nuxt
client: Marché
year: 2026
url: https://example.com/marche
featured: false
colors:
  - name: Ink
    value: "#1A1A1A"
    usage: Primary
  - name: Paper
    value: "#FAFAF9"
    usage: Background
  - name: Signal Violet
    value: "#7C3AED"
    usage: Interactive elements
  - name: Stone
    value: "#A8A29E"
    usage: Supporting text
  - name: Confirmation
    value: "#16A34A"
    usage: Success states
typography:
  - name: Geist
    weights: ["400", "500", "700"]
    usage: Everything — UI, headings, body
  - name: Geist Mono
    weights: ["400"]
    usage: Prices, sizes, stock codes
---

# Marché — E-Commerce Rebuild

Marché is a mid-size fashion retailer with a loyal customer base and a website that was actively working against them. Their old platform was a Magento instance held together by plugins, prayers, and a developer who'd left two years ago. Pages took 6+ seconds to load. The mobile experience was genuinely hostile.

They didn't want a redesign for the sake of it. They wanted their online shop to feel as considered as their physical stores.

::figure{src="https://picsum.photos/seed/ecom-hero/1200/600" alt="Marché homepage on desktop and mobile showing clean product grid and editorial hero" caption="The new homepage — editorial at the top, product-forward everywhere else"}
::

## The old site

Worth understanding what we were replacing. The existing site had:
- 6.2s average page load
- A checkout flow spread across 5 pages with mandatory account creation
- Product images that were inconsistently sized, some with watermarks still visible
- A search that returned results alphabetically, not by relevance

It was doing about 1.4% conversion. The physical stores were running closer to 30%. Something was clearly broken.

## How we built it

Nuxt 4 with SSR, a headless CMS for editorial content, and Stripe for payments. Nothing exotic — the magic was in the details.

::figure{src="https://picsum.photos/seed/ecom-arch/1000/500" alt="Simplified architecture diagram showing the stack" caption="The stack — deliberately boring choices that let us focus on the experience layer"}
::

A few decisions that mattered:

- **Search is instant.** Algolia, pre-configured with synonyms and weighted by sell-through rate. Typing "blue dress" shows you dresses that actually sell, not every SKU with blue in the name.
- **Filtering doesn't reload.** URL params update reactively. You can share a filtered view and the other person sees exactly what you see.
- **Guest checkout by default.** Account creation happens post-purchase, with a single click. Friction kills conversion; we killed friction.
- **Images are uniform.** We wrote a Nuxt server route that normalises product images to consistent aspect ratios on upload. No more visual chaos in the grid.

::figure{src="https://picsum.photos/seed/ecom-pdp/800/500" alt="Product detail page with size picker, stock indicator, and editorial photography" caption="Product page — size picker shows real-time stock, no 'add to cart then find out' nonsense"}
::

::figure{src="https://picsum.photos/seed/ecom-search/800/400" alt="Search results appearing as user types, with category facets on the left" caption="Search results update as you type — weighted by what people actually buy, not alphabetical order"}
::

## Checkout

The old checkout was a five-page obstacle course. The new one is a single page with three collapsible sections. Address autocomplete, saved cards for returning customers, and real-time shipping estimates that don't require you to fill in your postcode first (we geolocate from IP for the initial estimate).

::figure{src="https://picsum.photos/seed/ecom-checkout/800/500" alt="Single-page checkout with address, payment, and order summary visible at once" caption="The whole checkout on one screen — no page loads, no surprises, no 'where did my cart go?'"}
::

## Results

After 8 weeks live:

- **Page load**: 6.2s → 1.1s (LCP)
- **Conversion rate**: 1.4% → 3.8%
- **Cart abandonment**: down 41%
- **Mobile revenue share**: 38% → 57%

The numbers are good, but honestly the best feedback was a customer email that said "I actually enjoy browsing your site now." That's the bar.

::figure{src="https://picsum.photos/seed/ecom-metrics/1000/400" alt="Before and after Core Web Vitals comparison" caption="Core Web Vitals — green across the board, for the first time in the site's history"}
::
