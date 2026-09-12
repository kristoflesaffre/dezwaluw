const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));

test('the site installs as De Zwaluw with the swallow app icon', () => {
  assert.match(html, /rel="manifest" href="manifest.webmanifest"/);
  assert.match(html, /rel="apple-touch-icon" href="assets\/apple-touch-icon.png"/);
  assert.match(html, /assets\/icon-192.png/);
  assert.equal(manifest.short_name, 'De Zwaluw');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.background_color, '#071b2b');
  const srcs = manifest.icons.map((icon) => icon.src);
  assert.ok(srcs.includes('assets/icon-192.png'));
  assert.ok(srcs.includes('assets/icon-512.png'));
  assert.ok(srcs.includes('assets/icon-maskable-512.png'));
  for (const src of [...srcs, 'assets/apple-touch-icon.png']) {
    assert.ok(fs.statSync(path.join(root, src)).size > 0, src);
  }
  assert.match(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), /addEventListener\('fetch'/);
  assert.match(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), /serviceWorker\.register\('sw.js'\)/);
});
