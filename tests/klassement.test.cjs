const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));

function gamesPlayed(player) {
  const n = Number(player.games);
  return Number.isFinite(n) && n >= 0 ? n : player.played ? 1 : 0;
}

function pin(player) {
  return player.member === 'A7826' ? 2 : player.member === 'A5390' ? 1 : 0;
}

function rankedByPoints() {
  return [...data.players].sort((a, b) => {
    const byPin = pin(a) - pin(b);
    if (byPin) return byPin;
    const byPoints = (Number(b.points) || 0) - (Number(a.points) || 0);
    if (byPoints) return byPoints;
    const byPlayed = Number(b.played) - Number(a.played);
    if (byPlayed) return byPlayed;
    return String(a.display || a.name).localeCompare(String(b.display || b.name), 'nl');
  });
}

function rankedByAttendance() {
  return [...data.players].sort((a, b) => {
    const byPin = pin(a) - pin(b);
    if (byPin) return byPin;
    const byGames = gamesPlayed(b) - gamesPlayed(a);
    if (byGames) return byGames;
    return String(a.display || a.name).localeCompare(String(b.display || b.name), 'nl');
  });
}

function render() {
  const fixtures = { innerHTML: '', querySelector() { return null; }, querySelectorAll() { return []; } };
  const document = {
    querySelector(sel) {
      if (sel === '#fixtures') return fixtures;
      if (sel === '#result-count') return { textContent: '' };
      return { addEventListener() {}, append() {}, innerHTML: '', textContent: '', setAttribute() {}, classList: { toggle() {}, add() {}, remove() {} }, querySelector() { return { innerHTML: '' }; } };
    },
    querySelectorAll() { return []; },
    documentElement: { classList: { toggle() {} } },
    createElement() { return { className: '', addEventListener() {}, setAttribute() {}, textContent: '' }; },
    addEventListener() {}
  };
  vm.runInNewContext(source.replace(/if\('serviceWorker'[\s\S]*$/, ''), {
    document,
    matchMedia() { return { matches: true, addEventListener() {} }; },
    navigator: {},
    location: { hash: '' },
    window: { addEventListener() {}, scrollTo() {} },
    history: { scrollRestoration: 'auto' },
    IntersectionObserver: function () { this.observe = () => {}; },
    Intl,
    Date,
    Number,
    String,
    encodeURIComponent,
    Boolean
  });
  return fixtures.innerHTML;
}

test('klassement ranks players by ATC points and crowns the joint leaders', () => {
  const html = render();
  const panel = html.slice(html.indexOf('id="klassement"'), html.indexOf('id="aanwezigheid"'));
  const ranked = rankedByPoints();
  const topPoints = Math.max(0, ...ranked.map((player) => Number(player.points) || 0));
  const leaders = ranked.filter((player) => (Number(player.points) || 0) === topPoints && topPoints > 0 && !pin(player));
  assert.equal((panel.match(/klassement-row is-lead/g) || []).length, leaders.length);
  for (const leader of leaders) {
    assert.match(panel, new RegExp(String(leader.display || leader.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    if (leader.crown) assert.match(panel, new RegExp(path.basename(leader.crown).replace(/\./g, '\\.')));
  }
  const first = ranked[0];
  const last = ranked[ranked.length - 1];
  assert.ok(panel.indexOf(first.display || first.name) < panel.indexOf(last.display || last.name));
  assert.match(panel, new RegExp(`${gamesPlayed(first)} wedstrijd`));
  assert.equal(last.member, 'A7826');
});

test('players who have not played yet sit below everyone who already has a match', () => {
  const html = render();
  const panel = html.slice(html.indexOf('id="klassement"'), html.indexOf('id="aanwezigheid"'));
  const played = rankedByPoints().filter((player) => player.played && !pin(player));
  const unplayed = rankedByPoints().filter((player) => !player.played && !pin(player));
  if (!played.length || !unplayed.length) return;
  const lastPlayed = Math.max(...played.map((player) => panel.indexOf(player.display || player.name)));
  const firstUnplayed = Math.min(...unplayed.map((player) => panel.indexOf(player.display || player.name)));
  assert.ok(lastPlayed > 0 && firstUnplayed > 0);
  assert.ok(lastPlayed < firstUnplayed);
  const dirk = panel.lastIndexOf('D. De Bie');
  assert.ok(dirk > firstUnplayed);
});

test('player points match data.json from ATC sync', () => {
  const byMember = Object.fromEntries(data.players.map((player) => [player.member, player.points]));
  for (const player of data.players) {
    assert.equal(byMember[player.member], player.points);
  }
  assert.ok(data.fixtures.some((fixture) => fixture.score));
});

test('aanwezigheid ranks by match attendance and crowns joint leaders', () => {
  const html = render();
  assert.match(html, /id="tab-aanwezigheid"/);
  assert.match(html, /id="aanwezigheid"[^>]*hidden/);
  const panel = html.slice(html.indexOf('id="aanwezigheid"'));
  const ranked = rankedByAttendance();
  const top = Math.max(0, ...ranked.map(gamesPlayed));
  const leaders = ranked.filter((player) => gamesPlayed(player) === top && top > 0 && !pin(player));
  assert.equal((panel.match(/klassement-row is-lead/g) || []).length, leaders.length);
  assert.match(panel, new RegExp(`${top} <small>aanw</small>`));
  assert.match(panel, /0 <small>aanw<\/small>/);
  for (const leader of leaders) {
    if (leader.crown) assert.match(panel, new RegExp(path.basename(leader.crown).replace(/\./g, '\\.')));
  }
  const dirk = panel.lastIndexOf('D. De Bie');
  const first = panel.indexOf(ranked[0].display || ranked[0].name);
  assert.ok(first > 0 && dirk > first);
  assert.equal(ranked[ranked.length - 1].member, 'A7826');
});
