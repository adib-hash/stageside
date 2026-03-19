# Stageside Changelog

## v2.3.0 — 2026-03-19

### Changed
- **Removed Genre filter** — was non-functional; removed from toolbar to reduce clutter
- **Default homepage** — now loads current-month New York City events (was generic US music feed)
- **Tour pill mobile UX** — replaced single tappable pill with a three-button footer bar (Cal / Share / Tickets) so actions are clearly separated and accidental navigation is prevented
- **Country selector on mobile** — shows flag emoji only (compact, ~52px); full text shown on desktop
- **Search bar on mobile** — no longer wraps; stays on one row with expanded input and compact flag selector
- **DC added to state map** — Washington DC now appears in the Browse by Location grid
- **"Data via Ticketmaster"** — attribution line added under hero title
- **Improved iOS home screen icon** — new apple-touch-icon.svg with accent bar and bold S

## v2.2.0 — 2026-03-19

### Added
- **Dark / Light mode toggle** — Sun/moon icon in header. Persisted in localStorage. Light mode uses dark olive green accent (`#4a7c00`) on cream background.
- **Logo as home button** — Tapping the STAGESIDE logo resets the app to default state (clears search, filters, returns to tour view).
- **Share button** — Share icon on every tour pill, list card, and grid card. Opens native iOS share sheet; falls back to clipboard copy on desktop.
- **Near Me city display** — After granting location access, the search bar now shows the detected city/state name using BigDataCloud's free reverse geocode API.
- **iOS PWA icon** — Added `apple-touch-icon.svg` and PWA meta tags (`apple-mobile-web-app-capable`, etc.) for home screen installation.

### Changed
- **Hero scroll behavior** — Hero only expands back when scrollY reaches exactly 0 (fully at top). No more snap-back mid-scroll.
- **Pagination scroll** — Clicking Next/Prev scrolls to first result (top of main area), not to the very top of the page.
- **Calendar buttons on mobile** — `.pill-cal` and `.cal-btn` are now always visible on mobile (no hover required). Tap targets increased.
- **Date chips** — Removed preset "This Weekend", "This Month", "Next 3 Mo" chips. Only "Custom Dates" remains.
- **Search placeholder** — Updated to "Search artist, city, venue or tour..."
- **Country selector** — Removed emoji flag sequences; clean text-only options.
- **Hero eyebrow** — Replaced ▶ Unicode arrow with an inline SVG polygon.
- **IG post button** — Updated to a download icon (arrow pointing down into tray). Tooltip updated to "Download Instagram post".
- **State box icons** — Replaced emoji (🔍, ⚠, ★) with inline SVGs.
- **Double-tap zoom** — `html { touch-action: manipulation }` prevents iOS double-tap zoom across the entire app.
- **Overscroll** — `body { overscroll-behavior-y: contain }` prevents pull-to-refresh interference.
- **Hero compact transition** — Eyebrow and title now fade out with `opacity` transition instead of `display:none` snap.
- **Touch targets** — All interactive elements get `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`. View buttons, chips, search-go, and near-btn have enforced minimum tap sizes on mobile.
- **Removed dead CSS** — Removed `.key-input { width: 160px }` from mobile query (API key input was removed in v2.1).

## v2.1.0 — 2026-03-19

### Changed
- **Vercel deployment**: Converted Node.js HTTP server to Vercel serverless functions. API routes (`/api/events`, `/api/attractions`, `/api/venues`) are now in `api/` and run as serverless functions on Vercel.
- **API key removed from UI**: Ticketmaster API key is now injected server-side via the `TM_API_KEY` environment variable. Users no longer see a key input field — the app loads immediately on open.
- Added `vercel.json` to serve `public/` as the static output directory.

## v2.0.0 — 2026-03-19

### Added
- **My Artists** — Star icon on every artist in Tour, List, and Grid views. Starred artists persist in `localStorage` across sessions. Sidebar shows a "My Artists" section at the top with count badge. Sidebar quick-search list now has star toggles on each artist.
- **Feed View** — New heart-icon view button. Fetches all saved artists in parallel and renders them as a merged, date-sorted tour view. Shows artist + show count header. Falls back gracefully when no artists are saved or no shows found.
- **Add to Calendar** — Calendar icon on every tour pill and list card. Generates and downloads a `.ics` file compatible with iPhone Calendar, Google Calendar, and Outlook. Includes event name, venue, location, time, and Ticketmaster link.
- **Near Me** — Location pin button in the search bar. Taps into browser geolocation API and searches Ticketmaster within 50 miles using `latlong` + `radius` parameters. Active state fills the pin icon. Gracefully handles permission denial.
- **Date Chips** — Replaced raw date inputs in toolbar with quick-select chips: This Weekend / This Month / Next 3 Months / Custom. "Custom" reveals the existing date inputs inline. Chips can be toggled off to reset.
- **Compact Mobile Hero** — On mobile, the hero section collapses to just the search bar when the user scrolls down 50px, reclaiming screen space for results. Expands again on scroll-up.

### Changed
- Toolbar view buttons replaced with SVG icons (list, grid, tour, feed)
- Sidebar artist list restructured with flex layout to accommodate star buttons

## v1.2.0 — 2026-03-19

### Changed
- Tour view is now the default view for search results (was List)

## v1.1.0 — 2026-03-19

### Added
- **Smart Relevance Split** — Artist keyword searches now separate results into primary matches (attraction name matches search term) and secondary matches ("Maybe what you're looking for...") shown at reduced opacity below a divider. Prevents irrelevant "Dance Night" style events from polluting top results.
- **Browse by Location Panel** — Collapsible panel between hero and toolbar with a US state tile grid map and month slider. Click any state to filter events to that state; move the month slider to constrain to a specific month. Both controls fire a search automatically. "Clear filters" resets to default.
- **IG Post Generator** — In Tour view, each artist group header shows a share icon. Clicking it generates and downloads a 1080×1080 PNG suitable for Instagram Stories or posts, containing the artist name, upcoming show dates, cities, and venues.

### Fixed
- Added `maximum-scale=1` to viewport meta to prevent iOS auto-zoom on input focus
- Updated all input/select font sizes to 16px minimum to prevent iOS zoom
- Replaced emoji in grid card date badge with plain text
- Replaced emoji usage in toast message with plain text

## v1.0.0 — 2026-03-17

### Initial release
- Ticketmaster API key save/restore via server
- Artist keyword search with country, genre, and date range filters
- List, Grid, and Tour view modes
- Sort by date, artist name, or relevance
- Sidebar quick-search for 24 popular artists
- Pagination support
- Dark theme with Bebas Neue + DM Sans typography
