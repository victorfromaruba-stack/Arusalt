# AruSalt website — project memory

AruSalt is a small, real hand-harvested sea salt brand from Aruba. This project is a single-file HTML + Tailwind CDN website (no build step, no framework). Two products exist today, sold in-store only: Pure Caribbean Sea Salt ($29) and Caribbean Bath Salt ($49). We plan to add online ordering through Shopify.

## The team

This project has specialist subagents defined in `.claude/agents/`. Delegate to them rather than doing everything in the main session:

- `shopify-integrator` — Buy Button wiring, product schema, checkout/e-commerce structure
- `copy-auditor` — matches and reviews on-page text against the real Shopify store
- `design-system-guardian` — read-only review of new UI against the design tokens below
- `accessibility-auditor` — read-only accessibility review
- `seo-performance-auditor` — meta tags, schema.org, canonical URL, performance review
- `qa-validator` — final tag-balance + leftover-placeholder check before calling anything done

Claude Code will auto-delegate to these based on their `description` fields, or you can invoke one explicitly, e.g. "Use the qa-validator subagent to check the last change."

Standard flow for any non-trivial change: make the edit → relevant specialist reviews it (design-system-guardian / accessibility-auditor / seo-performance-auditor as applicable) → qa-validator runs last, before telling me it's done.

## Design system — don't drift from this without flagging it to me

- **Fonts:** Space Grotesk for headings (h1–h4), Inter for body text
- **Colors:** ocean blue `#0ea5e9` (primary, used broadly), coral `#ef6a72` (secondary accent — used sparingly, not as a default)
- **Signature motif:** a small rotated-square "diamond" shape echoing the crystal-lattice logo mark, reused as section dividers
- **Icons:** hand-drawn inline SVG (no image files), thin-stroke (~1.3 stroke-width on a 24×24 viewBox), plain dark (`text-gray-900`) — matching the real Shopify store's icon style, not the site's blue/coral accents
- **Section backgrounds:** alternate white and a pale ocean-tinted blue — never plain Tailwind gray

## Ground rules

- Keep the single-file HTML + Tailwind-CDN approach unless I explicitly ask to change it.
- No new image files unless I ask for one.
- Never fabricate business details, prices, store credentials, or a canonical domain — ask me instead.
- Canonical domain is confirmed: **arusalt.com**. CNAME, canonical tag, og:url, and schema.org URLs are all aligned on it; robots.txt/sitemap.xml also point at it. Don't reintroduce arusaltaruba.com without asking first.
- Run `qa-validator` after any HTML/CSS/JS change, before telling me something is done.

## Current priority order

1. Match copy site-wide to the real Shopify store — `copy-auditor` (I'll provide screenshots or the live URL)
2. Wire up Shopify Buy Button for both products — `shopify-integrator` (I'll provide the real embed snippets from Shopify admin)
3. Once Buy Button is live: remove hardcoded prices from the HTML, update the "AVAILABLE EXCLUSIVELY IN STORES" marquee copy since it'll no longer be accurate
4. Smaller open items: generic image filenames (`IMG_2243.webp`), no analytics wired in, no service worker despite PWA-style meta tags already present, parallax background not yet tested on a real older Android/iOS device. (Done: dead footer "Search" link removed, `sitemap.xml`/`robots.txt` added, History-section images fixed after several were found to be mismatched product photos instead of the real archival photography, product cards enriched with real copy from the live Shopify store.)
5. Known unused-but-not-deleted image files sitting in the repo root as cleanup candidates: `IMG_2167.webp`/`IMG_2168.webp` (were wrongly used in the History section, now superseded by `IMG_0589.jpg`/`IMG_0588.jpg`), `IMG_2242.jpeg` (was wrongly used for the "hand holding salt" image, now superseded by `salt-water-plemmirio-natural-reserve-x.jpeg`), several `ChatGPTImage...`/`IMG_21xx`/`IMG_22xx`/`IMG_23xx` files never referenced by index.html at all. Left in place rather than deleted since none are confirmed pure duplicates — ask before removing.
