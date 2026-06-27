# Prompt — standardize all Lakes Linked county pages to one style

You are a careful front-end engineer. Bring **every HTML page** in this site to a single, consistent navigation/branding standard. Work on all county dashboards and their sub-pages, plus `index.html` and `michigan_map.html`. **Do not change any data, numbers, charts, or analysis text** — only navigation, labels, branding, byline, and the planning notice. Keep every file self-contained and keep all internal links **relative** (e.g. `href="clare.html"`).

## Files in scope
`index.html`, `michigan_map.html`, and for each county **isabella / clare / midland / gratiot**: `<county>.html`, `<county>_methods.html`, `<county>_roi.html`, plus `isabella_interventions.html`, `isabella_trends.html`, `clare_ai_solutions.html`, `methods_supplement.html`.

## 1. Brand name — one form everywhere
- Replace every occurrence of **"Lakes Linked Care"** with **"Lakes Linked"** (titles, `<meta>` og:title/description, header brand, footers, body). The brand is always **"Lakes Linked"** (no "Care").

## 2. Byline / affiliation — one form everywhere
- The author line must read exactly: **"Sergey Soshnikov, MD PhD · Assistant Professor, Public Health · Lakes Linked"**.
- Replace older variants such as "Public Health Researcher", "Public Health Researcher · Central Michigan University", "Public Health Division · …" with the line above.
- **Minimize "Central Michigan University":** remove any reference to the university affiliation (do **not** reintroduce it).
- **Keep** legitimate, unrelated names that happen to contain "Central Michigan": **"Central Michigan Service Area"** (an HRSA HPSA designation) and **"Central Michigan Correctional Facility"** (a real facility). These are NOT the university — leave them as-is.

## 3. County navigation — 4 counties on every page
- The "Counties:" nav group on every page must list, in this order, all four: **Isabella · Clare · Midland · Gratiot**, each linking to `<county>.html` (relative), using the existing SVG pin icon (`class="nico"`), identical markup.
- If a page is missing Gratiot (or any county), add it.

## 4. Active state — highlight the current page
- On each page, the nav link for the **current county** must carry `class="navlink active"` (and only that one is active). Example: on `clare.html`, `clare_methods.html`, `clare_roi.html`, etc., the **Clare** county link is `active`.
- In the secondary nav (Dashboard / Economic Impact / Interventions / Methods / Trends), the link for the **current sub-page** is also `active`. On the main `<county>.html` dashboard, mark the "Dashboard" item active (or the county itself if there is no Dashboard item).
- The `.navlink.active` style must be visibly highlighted (it already exists in CSS — ensure the class is applied, don't redefine it).

## 5. Sub-navigation labels — one wording everywhere
Use exactly these labels (and only show the ones that exist for that county):
- `<county>.html` → **Dashboard**
- `<county>_roi.html` → **Economic Impact**
- `<county>_interventions.html` / `clare_ai_solutions.html` → **Interventions**
- `<county>_methods.html` → **Methods**
- `<county>_trends.html` → **Trends**
- `index.html` → **Portal**

Do **not** rename the files themselves (that would break links) — only the visible link text. Use the SAME order everywhere: Portal · Dashboard · Economic Impact · Interventions · Methods · Trends.

## 6. index.html county cards — match the labels
- In each county card's secondary links, use **"Economic Impact"** (not "Economic"), **"Interventions"**, **"Methods"**, **"Trends"** — matching §5.

## 7. Planning notice — one standard banner
- Every county dashboard (`<county>.html`) must show the single standard notice, not a "✅ Observed data" variant:
  > ⚠ **Planning model — not a validated county burden estimate.** [one short county-specific data line] [→ Full methods & data quality notes (link to `<county>_methods.html`)]
- Use the amber `.notice` style (`background:#fffbeb; color:#92400e`) consistently. Replace any green "Observed data" banner with this.

## Constraints & verification
- Relative links only; do not introduce `https://lakeslinkedcare.github.io/...` absolute links.
- Do not alter DALY numbers, tables, charts, or methodology text.
- Single self-contained files; keep existing `<head>`, fonts, and scripts.
- After editing, verify for EVERY page: 4-county nav present; current county/sub-page marked `active`; consistent sub-nav labels; brand is "Lakes Linked" (no "Care"); byline is the standard line; **zero "Central Michigan University"**; planning banner standardized.
- Report a short table: file · counties-in-nav · active-correct · byline-correct · CMU-University-count (must be 0).
