const https = require('https');

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

  const qs = Object.entries({ ...req.query, apikey: API_KEY })
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const tmUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?${qs}`;

  https.get(tmUrl, (tmRes) => {
    let data = '';
    tmRes.on('data', chunk => data += chunk);
    tmRes.on('end', () => res.status(tmRes.statusCode).send(data));
  }).on('error', err => {
    res.status(500).json({ error: 'Failed to reach Ticketmaster: ' + err.message });
  });
};
