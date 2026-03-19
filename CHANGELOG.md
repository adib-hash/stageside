# Stageside Changelog

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
