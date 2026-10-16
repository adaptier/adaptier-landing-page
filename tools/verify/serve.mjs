import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
// Must mirror the cp list in .github/workflows/deploy.yml.
export const SERVED = ['index.html', 'styles.css', 'main.js', 'favicon.svg', 'demo/index.html'];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };

export function startServer() {
  const server = http.createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    // GitHub Pages answers a directory without its slash with a 301 to the slashed form.
    if (path === '/demo') { res.writeHead(301, { location: '/demo/' }).end(); return; }
    if (path.endsWith('/')) path += 'index.html';
    const rel = normalize(path).replace(/^\/+/, '');
    const allowed = SERVED.includes(rel) || /^images\/[\w@.-]+\.(webp|png)$/.test(rel);
    if (!allowed) { res.writeHead(404).end(); return; }
    try {
      const body = await readFile(join(ROOT, rel));
      res.writeHead(200, { 'content-type': TYPES[extname(rel)] ?? 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () =>
    r({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })));
}
