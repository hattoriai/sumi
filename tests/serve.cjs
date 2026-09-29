// Local verification of the built artifact; production hosting belongs to Pages.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('storybook-static');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, content) => {
    res.writeHead(error ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(error ? 'Not found' : content);
  });
}).listen(6006, '127.0.0.1');
