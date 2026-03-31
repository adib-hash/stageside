# Stageside -- Concert Tour Tracker

Browse live concerts by tour date and city, powered by the Ticketmaster Discovery API. Deployed on Vercel.

**Current version: v2.4.4**

---

## Features

- **Search** any artist, band, tour name, or venue
- **Tour view** as the default (and primary) view, with Grid as an alternative
- **My Artists** -- star/save artists across views; dedicated Feed view fetches all saved artists in parallel
- **Smart Relevance Split** -- primary matches separated from tangential results
- **Add to Calendar** -- download .ics files for any event (iPhone Calendar, Google Calendar, Outlook)
- **Near Me** -- geolocation search using browser location; detected city shown in search bar
- **Browse by Location** -- US state tile grid with month slider; click a state to filter events
- **IG Post Generator** -- download a 1080x1080 PNG with artist tour dates, suitable for Instagram
- **Share button** -- native iOS share sheet, clipboard fallback on desktop
- **Dark / Light mode** -- toggle in header, persisted in localStorage
- **Country selector** -- flag emoji on mobile, full text on desktop
- **Default homepage** -- loads current-month New York City events on open
- **Compact mobile hero** -- collapses on scroll, re-expands when tapping the logo
- **Logo as home button** -- resets app to default state
- **iOS PWA support** -- apple-touch-icon, meta tags, double-tap zoom prevention
- **Custom date range** filter
- Direct **Get Tickets** links to Ticketmaster
- Pagination through thousands of events
- Version footer

---

## Setup

Stageside runs on Vercel with serverless API routes. There is no local Node.js server to start.

### Prerequisites

- A [Vercel](https://vercel.com) account (free tier)
- A Ticketmaster API key (see [API Info](#api-info) below)

### Deploy

1. Push the repo to GitHub
2. Import the repo in Vercel
3. In Vercel project settings, add the environment variable:
   ```
   TM_API_KEY=your_ticketmaster_api_key
   ```
4. Deploy. The app is live -- no further configuration needed.

The API key is injected server-side. Users never see or enter a key.

### Local development

```bash
npm i -g vercel
vercel dev
```

Set `TM_API_KEY` in a `.env` file in the project root for local runs.

---

## Project Structure

- `public/` -- static frontend (HTML, CSS, JS)
- `api/` -- Vercel serverless functions (`events`, `attractions`, `venues`)
- `vercel.json` -- routing and static file config

---

## API Info

- Uses the **Ticketmaster Discovery API v2**
- Free tier: **5,000 requests/day**
- Rate limit: 5 requests/second
- Get your key: https://developer-acct.ticketmaster.com
