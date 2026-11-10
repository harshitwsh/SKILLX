/**
 * SKILLX - Optional Lightweight Local Server (server.js)
 * Zero external dependencies. Uses Node.js built-in 'http', 'fs', and 'path'.
 *
 * Run with: node server.js
 * Serves the application on: http://localhost:3000
 * Saves submitted forms and profiles directly to the data/ folder as JSON files.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      callback(null, JSON.parse(body));
    } catch (err) {
      callback(err);
    }
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: Save Application to data/applications.json
  if (req.url === '/api/save-application' && req.method === 'POST') {
    readJsonBody(req, (err, newApp) => {
      if (err) return sendJson(res, 400, { success: false, error: err.message });

      const filePath = path.join(DATA_DIR, 'applications.json');
      let apps = [];
      if (fs.existsSync(filePath)) {
        apps = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
      apps.unshift(newApp);
      fs.writeFileSync(filePath, JSON.stringify(apps, null, 2), 'utf-8');
      sendJson(res, 200, { success: true, message: 'Saved to data/applications.json', data: newApp });
    });
    return;
  }

  // API Route: Save User Profile to data/user_profile.json
  if (req.url === '/api/save-profile' && req.method === 'POST') {
    readJsonBody(req, (err, profileData) => {
      if (err) return sendJson(res, 400, { success: false, error: err.message });

      const filePath = path.join(DATA_DIR, 'user_profile.json');
      fs.writeFileSync(filePath, JSON.stringify(profileData, null, 2), 'utf-8');
      sendJson(res, 200, { success: true, message: 'Saved to data/user_profile.json', data: profileData });
    });
    return;
  }

  // API Route: Get Applications or Projects
  if (req.url === '/api/applications' && req.method === 'GET') {
    const filePath = path.join(DATA_DIR, 'applications.json');
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '[]';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  if (req.url === '/api/projects' && req.method === 'GET') {
    const filePath = path.join(DATA_DIR, 'projects.json');
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '[]';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // Static File Serving (prevent path traversal outside workspace)
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`SKILLX Server running at http://localhost:${PORT}`);
});
