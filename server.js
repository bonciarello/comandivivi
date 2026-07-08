/* ── ComandiVivi — Production Server ── */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4601;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let url = req.url;
  if (url === '/') url = '/index.html';

  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const contentType = MIME[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ComandiVivi è online su http://0.0.0.0:${PORT}/\n`);
});
