# 🎸 STAGESIDE — Concert Tour Tracker

Browse live concerts by tour date and city, powered by the Ticketmaster Discovery API.

---

## Setup (takes 2 minutes)

### 1. Install Node.js (if you don't have it)
Download from https://nodejs.org — get the LTS version

### 2. Start the server

**Mac / Linux:**
```bash
cd stageside
node server.js
```

**Windows:**
```
cd stageside
node server.js
```

### 3. Open the app
Visit **http://localhost:3000** in your browser

### 4. Enter your API key
Paste your Ticketmaster API key in the field at the top and click **Save Key**.

Your key is stored in a local `.env` file — it persists between restarts.

---

## Optional: Pre-load your API key

You can skip the in-app setup by creating a `.env` file in this folder:

```
TM_API_KEY=your_key_here
```

Or pass it as a startup argument (Mac/Linux):
```bash
bash start.sh YOUR_API_KEY_HERE
```

---

## Features

- **Search** any artist, band, tour name, or venue
- **Filter** by genre, country, and date range
- **3 View Modes**: List, Grid (with images), Tour (all dates grouped by artist)
- **Sort** by date, artist name, or relevance
- **Quick-click sidebar** with 24 popular artists
- Direct **Get Tickets** links to Ticketmaster
- Pagination through thousands of events

---

## API Info

- Uses the **Ticketmaster Discovery API v2**
- Free tier: **5,000 requests/day**
- Rate limit: 5 requests/second
- Get your key: https://developer-acct.ticketmaster.com
