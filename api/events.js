const https = require('https');

// ─── TRIBUTE BAND FILTER ─────────────────────────────────────────────────────
const TRIBUTE_PATTERNS = [
  /\btribute\b/i,
  /\bcover(s)?\b/i,
  /\blegacy\b/i,
  /\bcelebration of\b/i,
  /\bthe music of\b/i,
  /\bhonoring\b/i,
  /\bperforms?\b.*\bof\b/i,
  /\binspired by\b/i,
  /\bsalute to\b/i,
  /\ba night of\b.*\bmusic\b/i,
  /\bsymphony.*plays\b/i,
  /\bjukebox\b/i,
  /\bkaraoke\b/i,
  /\bopen mic\b/i,
  /\bamateur\b/i,
  /\bbattle of the bands\b/i,
  /\bfantasy\b.*\bband\b/i,
  /\bimpersonat/i,
  /\blook[-\s]alike\b/i,
  /\bsound[-\s]alike\b/i,
  /\bunauthorized\b/i,
];

const MAJOR_SIGNALS = [
  'world tour', 'north american tour', 'european tour', 'arena tour', 'stadium tour',
];

function isTributeBand(name, eventName) {
  const combined = `${name} ${eventName}`.toLowerCase();
  return TRIBUTE_PATTERNS.some(p => p.test(combined));
}

function hasMajorSignal(eventName) {
  return MAJOR_SIGNALS.some(s => eventName.toLowerCase().includes(s));
}

function filterMajorArtists(events) {
  return events.filter(event => {
    const attractions = event._embedded?.attractions || [];
    const eventName = event.name || '';
    if (hasMajorSignal(eventName)) return true;
    if (attractions.length === 0) return !isTributeBand('', eventName);
    const artistName = attractions[0].name || '';
    if (isTributeBand(artistName, eventName)) return false;
    return true;
  });
}
// ─────────────────────────────────────────────────────────────────────────────

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const API_KEY = process.env.TM_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'API key not configured on server.' });
    return;
  }

  const queryParams = { ...req.query, apikey: API_KEY };
  if (!queryParams.classificationId) queryParams.segmentName = 'Music';

  const qs = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${qs}`;

  https.get(tmUrl, (tmRes) => {
    let data = '';
    tmRes.on('data', chunk => data += chunk);
    tmRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json._embedded?.events) {
          json._embedded.events = filterMajorArtists(json._embedded.events);
        }
        res.status(tmRes.statusCode).json(json);
      } catch (e) {
        res.status(tmRes.statusCode).send(data);
      }
    });
  }).on('error', err => {
    res.status(500).json({ error: 'Failed to reach Ticketmaster: ' + err.message });
  });
};
