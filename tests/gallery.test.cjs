const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function setup() {
  const element = () => ({
    handlers: {}, hidden: false, complete: true, naturalWidth: 1254,
    classList: { values: new Set(), add(v) { this.values.add(v); }, remove(v) { this.values.delete(v); } },
    addEventListener(type, fn) { this.handlers[type] = fn; },
    focus() { this.focused = true; },
    fire(type, args = {}) { return this.handlers[type]?.({ preventDefault() { this.prevented = true; }, ...args }); }
  });
  const selectors = ['.viewer-image','.viewer-close','.viewer-fullscreen','.viewer-stage','.viewer-picture','.viewer-error','.viewer-original','#portrait-title','#portrait-details','.viewer-count','.viewer-prev','.viewer-next'];
  const nodes = Object.fromEntries(selectors.map(s => [s, element()]));
  const links = [...html.matchAll(/href="(assets\/players\/[^\"]+)" data-portrait="(\d+)" data-name="([^\"]+)" data-member="([^\"]+)" data-rank="([^\"]+)"/g)].map(m => Object.assign(element(), { href: m[1], dataset: { name: m[3], member: m[4], rank: m[5] } }));
  const viewer = Object.assign(element(), {
    querySelector(s) { return nodes[s]; },
    showModal() { this.open = true; },
    close() { this.open = false; this.fire('close'); }
  });
  const document = Object.assign(element(), {
    documentElement: element(), fullscreenEnabled: false,
    querySelectorAll() { return links; }, querySelector() { return viewer; }
  });
  vm.runInNewContext(fs.readFileSync(path.join(root, 'gallery.js'), 'utf8'), { document, Image: function() {} });
  return { nodes, links, viewer, document };
}

test('ten named portraits exist and each maps to a distinct team member', () => {
  const { links } = setup();
  assert.equal(links.length, 10);
  assert.equal(new Set(links.map(l => l.dataset.member)).size, 10);
  const players = JSON.parse(fs.readFileSync(path.join(root, 'data.json'))).players;
  for (const link of links) {
    assert.ok(fs.statSync(path.join(root, link.href)).size > 0);
    assert.equal(players.find(p => p.member === link.dataset.member).ranking, link.dataset.rank);
  }
  assert.match(html, /D\. De Bie/);
  assert.match(html, /Foto volgt/);
});
test('opening a portrait names the photo, opens the modal, and locks page scrolling', () => {
  const s = setup(); s.links[2].fire('click');
  assert.equal(s.viewer.open, true);
  assert.equal(s.nodes['#portrait-title'].textContent, 'Kristof Lesaffre');
  assert.equal(s.nodes['.viewer-image'].src, s.links[2].href);
  assert.equal(s.nodes['.viewer-count'].textContent, '03 / 10');
  assert.ok(s.document.documentElement.classList.values.has('portrait-is-open'));
  assert.equal(s.nodes['.viewer-close'].focused, true);
});
test('next and previous navigation wrap around the complete gallery', () => {
  const s = setup(); s.links[9].fire('click');
  s.nodes['.viewer-next'].fire('click');
  assert.equal(s.nodes['#portrait-title'].textContent, 'Peter De Bie');
  s.nodes['.viewer-prev'].fire('click');
  assert.equal(s.nodes['#portrait-title'].textContent, 'Dave Van Mol');
});
test('arrow keys, Home and End select the expected portraits', () => {
  const s = setup(); s.links[3].fire('click');
  s.viewer.fire('keydown', { key: 'ArrowRight' });
  assert.equal(s.nodes['#portrait-title'].textContent, 'Gregory Jacobs');
  s.viewer.fire('keydown', { key: 'Home' });
  assert.equal(s.nodes['.viewer-count'].textContent, '01 / 10');
  s.viewer.fire('keydown', { key: 'End' });
  assert.equal(s.nodes['.viewer-count'].textContent, '10 / 10');
});
test('Escape cancellation closes the modal, unlocks scrolling and restores focus', () => {
  const s = setup(); s.links[4].fire('click'); s.viewer.fire('cancel');
  assert.equal(s.viewer.open, false);
  assert.equal(s.links[4].focused, true);
  assert.ok(!s.document.documentElement.classList.values.has('portrait-is-open'));
});
test('horizontal touch swipes navigate; vertical gestures do not', () => {
  const s = setup(); s.links[0].fire('click'); const p = s.nodes['.viewer-picture'];
  p.fire('pointerdown', { isPrimary: true, pointerType: 'touch', pointerId: 1, clientX: 200, clientY: 100 });
  p.fire('pointerup', { pointerId: 1, clientX: 100, clientY: 110 });
  assert.equal(s.nodes['.viewer-count'].textContent, '02 / 10');
  p.fire('pointerdown', { isPrimary: true, pointerType: 'touch', pointerId: 2, clientX: 200, clientY: 100 });
  p.fire('pointerup', { pointerId: 2, clientX: 180, clientY: 220 });
  assert.equal(s.nodes['.viewer-count'].textContent, '02 / 10');
});
test('image failure shows a direct fallback and the next photo clears that error', () => {
  const s = setup(); s.links[0].fire('click'); s.nodes['.viewer-image'].fire('error');
  assert.equal(s.nodes['.viewer-error'].hidden, false);
  assert.equal(s.nodes['.viewer-original'].href, s.links[0].href);
  s.nodes['.viewer-next'].fire('click');
  assert.equal(s.nodes['.viewer-error'].hidden, true);
});
test('modified clicks keep the direct image link available', () => {
  const s = setup(); s.links[0].fire('click', { metaKey: true });
  assert.notEqual(s.viewer.open, true);
});
