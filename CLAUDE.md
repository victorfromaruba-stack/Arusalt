# AruSalt website — project memory

AruSalt is a small, real hand-harvested sea salt brand from Aruba. This project is a single-file HTML + Tailwind CDN website (no build step, no framework). Two products exist today, sold in-store only: Pure Caribbean Sea Salt ($29) and Caribbean Bath Salt ($49). We plan to add online ordering through Shopify.

## Content editing system (no-GitHub-access editors)

Some copy is editable without touching GitHub, via a small Decap CMS instance at `/admin`:
- `content/site.json` holds the editable fields (hero headline/subhead, announcement bar text, both products' description/price/net weight, the retailers list, newsletter blurb). Non-editable content stays hardcoded in `index.html` as before.
- A hydration script at the end of `index.html`'s `<script>` block fetches `content/site.json` on page load and patches it into elements tagged `id="cms-*"` (or `class="cms-marquee-line1/2"`), rebuilding `#cms-retailers-grid` entirely from the `retailers` array. If the fetch fails for any reason, the static HTML already in the page is the fallback — the page never breaks from this.
- `admin/config.yml` defines the Decap CMS field schema (must stay in sync with `content/site.json`'s shape, and with the `id`s in `index.html` that the hydration script reads).
- `admin/index.html` is the CMS login/editor page. It has its own separate CSP meta tag (more permissive than the main site's, since it needs to load the Decap CMS bundle from unpkg and Netlify Identity) and is excluded from search indexing (`robots.txt` + `noindex` meta).
- Backend is `git-gateway` + Netlify Identity — editors log in with an email/password Netlify Identity account (invited by the site owner), never a GitHub account. Netlify proxies the actual git commits using the owner's GitHub authorization, done once during setup.
- `publish_mode: editorial_workflow` — edits sit as drafts/in-review before anything merges to `main` and goes live, rather than publishing instantly. Deliberate given the owner's security priorities; can be simplified to `publish_mode: simple` later if the review step proves like unnecessary friction.
- When adding a new editable field: add it to `content/site.json`, add the matching field block to `admin/config.yml`, tag the target element in `index.html` with a `cms-*` id/class, and add the corresponding lookup in the hydration script.

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
- Resolved: the live Shopify store (arusaltaruba.com) shows both products as "Sold out" — this is intentional, not a discrepancy to fix. Products are in-store-only for now; the Shopify listings are deliberately kept in place (sold out) so online ordering can be switched on later without rebuilding the store. Keep "AVAILABLE EXCLUSIVELY IN STORES" / "Find a Retailer" copy as-is until priority #2 below actually goes live.
- Run `qa-validator` after any HTML/CSS/JS change, before telling me something is done.
- `index.html` has a Content-Security-Policy meta tag. If you add a new external resource (script, stylesheet, font, fetch target), update the CSP to allow it explicitly — don't loosen it to a wildcard, and don't add `unsafe-eval` to the main site's CSP (only `admin/index.html`, a separate document, has that, because the Decap CMS bundle needs it).
- GitHub Pages can't serve custom HTTP headers, so `X-Frame-Options`, `X-Content-Type-Options`, and CSP's `frame-ancestors` directive can't be set from this repo at all — that's a platform limitation, not something to keep re-flagging as an open bug.

## Current priority order

1. Match copy site-wide to the real Shopify store — `copy-auditor` (I'll provide screenshots or the live URL)
2. Wire up Shopify Buy Button for both products — `shopify-integrator` (I'll provide the real embed snippets from Shopify admin)
3. Once Buy Button is live: remove hardcoded prices from the HTML, update the "AVAILABLE EXCLUSIVELY IN STORES" marquee copy since it'll no longer be accurate
4. Smaller open items: generic image filenames (`IMG_2243.webp`), no analytics wired in, no service worker despite PWA-style meta tags already present, parallax background not yet tested on a real older Android/iOS device. (Done: dead footer "Search" link removed, `sitemap.xml`/`robots.txt` added, History-section images fixed after several were found to be mismatched product photos instead of the real archival photography, product cards enriched with real copy from the live Shopify store.)
5. Known unused-but-not-deleted image files sitting in the repo root as cleanup candidates: `IMG_2167.webp`/`IMG_2168.webp` (were wrongly used in the History section, now superseded by `IMG_0589.jpg`/`IMG_0588.jpg`), `IMG_2242.jpeg` (was wrongly used for the "hand holding salt" image, now superseded by `salt-water-plemmirio-natural-reserve-x.jpeg`), several `ChatGPTImage...`/`IMG_21xx`/`IMG_22xx`/`IMG_23xx` files never referenced by index.html at all. Left in place rather than deleted since none are confirmed pure duplicates — ask before removing.
6. Flagged, not changed: the ocean blue `#0ea5e9` used for link/CTA text on white (`.text-theme-blue`, `.nav-link.active`) measures ~2.8:1 contrast, below WCAG AA's 4.5:1 for normal text. This is the core brand color used broadly per the design system above, so I didn't unilaterally darken it — that's a brand call, not a bug-fix call. If you want it addressed, options are a slightly darker blue for small text specifically (keeping `#0ea5e9` for large elements/backgrounds, which only need 3:1) or accepting it as a deliberate brand choice.
