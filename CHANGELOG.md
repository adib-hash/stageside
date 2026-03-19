# Stageside Changelog

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
