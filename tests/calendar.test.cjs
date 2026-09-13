const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function setup() {
  const fixtures = { innerHTML: '', querySelector() { return null; }, querySelectorAll() { return []; } };
  const resultCount = { textContent: '' };
  const nextLink = { href: '', classList: { add() {}, remove() {} }, setAttribute() {}, textContent: '', innerHTML: '' };
  const nextTeams = { innerHTML: '' };
  const nextDate = { innerHTML: '' };
  const matchLabel = { innerHTML: '' };
  const document = {
    querySelector(sel) {
      if (sel === '#fixtures') return fixtures;
      if (sel === '#result-count') return resultCount;
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
    location: { hash: '' },
    window: { addEventListener() {}, scrollTo() {} },
    history: { scrollRestoration: 'auto' },
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
  assert.doesNotMatch(html, /calendar-tools|Speelplaats|data-type="competitie"/);
  assert.doesNotMatch(html, /calendar-caption/);
  const { fixtures, resultCount } = setup();
  assert.match(fixtures.innerHTML, /role="tablist"/);
  assert.match(fixtures.innerHTML, /id="tab-upcoming"[^>]*aria-selected="true"/);
  assert.match(fixtures.innerHTML, /id="tab-played"[^>]*aria-selected="false"/);
  assert.match(fixtures.innerHTML, />LOCATIE</);
  assert.match(fixtures.innerHTML, /id="panel-played"[^>]*hidden/);
  assert.match(fixtures.innerHTML, /Nog te spelen/);
  assert.match(fixtures.innerHTML, /Gespeeld/);
  assert.match(fixtures.innerHTML, /id="tab-klassement"/);
  assert.match(fixtures.innerHTML, /id="klassement"[^>]*hidden/);
  assert.equal((fixtures.innerHTML.match(/<details class="fixture/g) || []).length, 20);
  assert.doesNotMatch(fixtures.innerHTML, /is-placeholder/);
  assert.equal((fixtures.innerHTML.match(/calendar-note is-beker/g) || []).length, 12);
  assert.equal((fixtures.innerHTML.match(/calendar-note is-inhaaldag/g) || []).length, 7);
  assert.equal((fixtures.innerHTML.match(/calendar-note is-kampioenschappen/g) || []).length, 6);
  assert.match(fixtures.innerHTML, /class="cup-icon"/);
  assert.match(fixtures.innerHTML, /BEKER VAN ATC/);
  assert.match(fixtures.innerHTML, /COMPETITIE · 1A/);
  assert.match(fixtures.innerHTML, /class="note-title">[\s\S]*?Beker<\/p>/);
  assert.match(fixtures.innerHTML, /Tegenstander volgt\. ATC heeft deze bekerdag nog niet ingevuld/);
  assert.match(fixtures.innerHTML, /Geen wedstrijd\. ATC houdt deze dag vrij voor inhaalwedstrijden/);
  assert.equal((fixtures.innerHTML.match(/class="cup-tag"/g) || []).length, 2);
  assert.match(resultCount.textContent, /nog te spelen/);
});

test('upcoming matches are the default tab and played matches sit on the second tab', () => {
  const { fixtures, resultCount } = setup();
  const upcoming = fixtures.innerHTML.indexOf('id="panel-upcoming"');
  const played = fixtures.innerHTML.indexOf('id="panel-played"');
  const nxt = fixtures.innerHTML.indexOf('NXT');
  const zenakalmScore = fixtures.innerHTML.indexOf('11 – 7');
  assert.ok(upcoming < played);
  assert.ok(nxt > upcoming && nxt < played);
  assert.ok(zenakalmScore > played);
  assert.match(resultCount.textContent, /31 wedstrijden nog te spelen/);
  const oct23 = fixtures.innerHTML.indexOf('2026-10-23');
  const oct30 = fixtures.innerHTML.indexOf('2026-10-30');
  const nov6 = fixtures.innerHTML.indexOf('2026-11-06');
  assert.ok(oct23 > 0 && oct30 > oct23 && nov6 > oct30);
});

test('away matches open Google Maps from the overview; past matches are marked', () => {
  const { fixtures, nextLink } = setup();
  assert.match(fixtures.innerHTML, /class="fixture past"/);
  assert.match(fixtures.innerHTML, /Gespeeld/);
  assert.match(fixtures.innerHTML, /maps\/dir\/\?api=1&destination=/);
  assert.match(fixtures.innerHTML, /Route naar Hanenberg/);
  assert.doesNotMatch(fixtures.innerHTML, /Route openen/);
  assert.match(nextLink.href, /maps\/dir/);
  assert.match(nextLink.innerHTML, /class="pin-icon"/);
  assert.match(nextLink.innerHTML, /Route/);
  assert.match(nextLink.innerHTML, /class="route-drive"/);
  assert.match(nextLink.innerHTML, /Retie · ±60 min vanuit Mechelen/);
  assert.match(fixtures.innerHTML, /class="drive-note"/);
  assert.match(fixtures.innerHTML, /Retie · ±60 min vanuit Mechelen/);
  assert.match(fixtures.innerHTML, /Putte · ±15 min vanuit Mechelen/);
  assert.equal((fixtures.innerHTML.match(/class="drive-note"/g) || []).length, 10);
  assert.match(fixtures.innerHTML, /class="pin-icon"/);
  assert.match(fixtures.innerHTML, /22u/);
  assert.doesNotMatch(fixtures.innerHTML, /Uur niet vermeld/);
});
