const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function setup() {
  const fixtures = { innerHTML: '', querySelectorAll() { return []; } };
  const resultCount = { textContent: '' };
  const nextLink = { href: '', classList: { add() {}, remove() {} }, setAttribute() {}, textContent: '' };
  const nextTeams = { innerHTML: '' };
  const nextDate = { innerHTML: '' };
  const matchLabel = { innerHTML: '' };
  const snapshot = { textContent: '' };
  const document = {
    querySelector(sel) {
      if (sel === '#fixtures') return fixtures;
      if (sel === '#result-count') return resultCount;
      if (sel === '.snapshot') return snapshot;
      if (sel === '.next-match .round-link') return nextLink;
      if (sel === '.next-teams') return nextTeams;
      if (sel === '.next-date') return nextDate;
      if (sel === '.match-label p') return matchLabel;
      if (sel === '.menu') return { getAttribute() { return 'false'; }, setAttribute() {}, addEventListener() {} };
      if (sel === 'nav') return { classList: { toggle() {}, remove() {} } };
      if (sel === '.next-match') return { innerHTML: '' };
      if (sel === 'footer') return { append() {} };
      if (sel === '.hero') return { addEventListener() {}, getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; } };
      if (sel === '.hero-art img') return { style: {} };
      return { addEventListener() {}, append() {}, innerHTML: '', textContent: '', setAttribute() {}, classList: { toggle() {}, add() {}, remove() {} }, querySelector() { return { innerHTML: '' }; } };
    },
    querySelectorAll(sel) {
      if (sel === '.filter') return [];
      if (sel === '.cup-match') return [];
      if (sel === 'nav a') return [];
      return [];
    },
    documentElement: { classList: { toggle() {} } },
    createElement() { return { className: '', addEventListener() {}, setAttribute() {}, textContent: '' }; },
    addEventListener() {}
  };
  const context = {
    document,
    matchMedia() { return { matches: true, addEventListener() {} }; },
    navigator: {},
    IntersectionObserver: function () { this.observe = () => {}; },
    Intl,
    Date,
    Number,
    String,
    encodeURIComponent,
    Boolean
  };
  vm.runInNewContext(source.replace(/if\('serviceWorker'[\s\S]*$/, ''), context);
  return { fixtures, resultCount, nextLink, context };
}

test('the calendar lists every cup and league match without a show-more control', () => {
  assert.doesNotMatch(html, /id="show-more"/);
  assert.match(html, />LOCATIE</);
  const { fixtures, resultCount } = setup();
  assert.match(fixtures.innerHTML, /Gespeeld/);
  assert.match(fixtures.innerHTML, /Nog te spelen/);
  assert.equal([...fixtures.innerHTML.matchAll(/<details class="fixture/g)].length, 20);
  assert.match(fixtures.innerHTML, /BEKER VAN ATC/);
  assert.match(fixtures.innerHTML, /COMPETITIE · 1A/);
  assert.match(resultCount.textContent, /20 wedstrijden/);
});

test('away matches open Google Maps from the overview; past matches are marked', () => {
  const { fixtures, nextLink } = setup();
  assert.match(fixtures.innerHTML, /class="fixture past"/);
  assert.match(fixtures.innerHTML, /Gespeeld/);
  assert.match(fixtures.innerHTML, /maps\/dir\/\?api=1&destination=/);
  assert.match(fixtures.innerHTML, /Route naar Hanenberg/);
  assert.doesNotMatch(fixtures.innerHTML, /Route openen/);
  assert.match(nextLink.href, /maps\/dir/);
  assert.equal(nextLink.textContent, 'Route');
});
