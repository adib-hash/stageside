const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Read API key from environment or config file
let API_KEY = process.env.TM_API_KEY || '';

// Try to load from config file
const configPath = path.join(__dirname, '.env');
if (fs.existsSync(configPath)) {
  const lines = fs.readFileSync(configPath, 'utf8').split('\n');
  for (const line of lines) {
    if (line.startsWith('TM_API_KEY=')) {
      API_KEY = line.split('=')[1].trim();
    }
  }
}

// ─── MAJOR ARTIST FILTER ────────────────────────────────────────────────────
// Patterns that strongly indicate tribute bands, cover acts, or non-major shows
const TRIBUTE_PATTERNS = [
  /\btribute\b/i,
  /\bcover(s)?\b/i,
  /\blegacy\b/i,
  /\bcelebration of\b/i,
  /\bthe music of\b/i,
  /\bhonoring\b/i,
  /\bperforms?\b.*\bof\b/i,          // "performs the music of"
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

// Words that suggest a major, real-touring act (boosts confidence)
const MAJOR_SIGNALS = [
  'world tour',
  'north american tour',
  'european tour',
  'arena tour',
  'stadium tour',
];

function isTributeBand(name, eventName) {
  const combined = `${name} ${eventName}`.toLowerCase();
  return TRIBUTE_PATTERNS.some(p => p.test(combined));
}

function hasMajorSignal(eventName) {
  const lower = eventName.toLowerCase();
  return MAJOR_SIGNALS.some(s => lower.includes(s));
}

function filterMajorArtists(events) {
  return events.filter(event => {
    const attractions = event._embedded?.attractions || [];
    const eventName = event.name || '';

    // Always keep if the event name contains a known major-tour signal
    if (hasMajorSignal(eventName)) return true;

    // If no attraction data, apply name-level filter only
    if (attractions.length === 0) {
      return !isTributeBand('', eventName);
    }

    const attraction = attractions[0];
    const artistName = attraction.name || '';

    // Drop if tribute/cover pattern matches
    if (isTributeBand(artistName, eventName)) return false;

    // Ticketmaster gives attractions a numeric popularity score (lower = more popular).
    // If present and very high (obscure), skip unless it's a direct keyword search result.
    // (Score isn't always present — only filter when it clearly signals obscurity.)

    return true;
  });
}
// ────────────────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Save API key endpoint
  if (pathname === '/api/save-key' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { apiKey } = JSON.parse(body);
        API_KEY = apiKey.trim();
        fs.writeFileSync(configPath, `TM_API_KEY=${API_KEY}\n`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // Get current API key status
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ hasKey: !!API_KEY, keyPreview: API_KEY ? API_KEY.substring(0, 6) + '...' : null }));
    return;
  }

  // Proxy to Ticketmaster API
  if (pathname === '/api/events' || pathname === '/api/attractions' || pathname === '/api/venues') {
    if (!API_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No API key configured. Please save your API key first.' }));
      return;
    }

    const resource = pathname.replace('/api/', '');
    const queryParams = { ...parsedUrl.query, apikey: API_KEY };

    // For events, enforce music segment to avoid non-music noise
    if (resource === 'events' && !queryParams.classificationId) {
      queryParams.segmentName = 'Music';
    }

    const queryString = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const tmUrl = `https://app.ticketmaster.com/discovery/v2/${resource}.json?${queryString}`;

    https.get(tmUrl, (tmRes) => {
      let data = '';
      tmRes.on('data', chunk => data += chunk);
      tmRes.on('end', () => {
        if (resource !== 'events') {
          res.writeHead(tmRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
          return;
        }

        try {
          const json = JSON.parse(data);
          if (json._embedded && json._embedded.events) {
            json._embedded.events = filterMajorArtists(json._embedded.events);
          }
          res.writeHead(tmRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(json));
        } catch (e) {
          res.writeHead(tmRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    }).on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to reach Ticketmaster API: ' + err.message }));
    });
    return;
  }

  // Serve static files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png' };
  const contentType = mimeTypes[ext] || 'text/plain';

  res.writeHead(200, { 'Content-Type': contentType });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`\n🎸 STAGESIDE is running!`);
  console.log(`   Open: http://localhost:${PORT}`);
  if (API_KEY) {
    console.log(`   API Key: ${API_KEY.substring(0, 6)}... (loaded)`);
  } else {
    console.log(`   API Key: Not set — enter it in the app`);
  }
  console.log(`\n   Press Ctrl+C to stop\n`);
});
