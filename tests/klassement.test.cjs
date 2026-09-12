const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));

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
  const kristof = html.indexOf('Kristof Lesaffre');
  const jeroen = html.indexOf('Jeroen Peeters');
  const gregory = html.indexOf('Gregory Jacobs');
  assert.ok(kristof > 0 && jeroen > 0);
  assert.ok(Math.min(kristof, jeroen) < gregory);
  assert.match(html, /kristof-lesaffre-kroon\.png/);
  assert.match(html, /jeroen-peeters-kroon\.png/);
  assert.doesNotMatch(html, /gregory-jacobs-kroon\.png/);
  assert.match(html, /gregory-jacobs\.png/);
  assert.equal((html.match(/klassement-row is-lead/g) || []).length, 2);
});

test('players who have not played yet sit below everyone who already has a match', () => {
  const html = render();
  const peter = html.indexOf('Peter De Bie');
  const tseng = html.indexOf('Tseng-sing Choi');
  const dave = html.indexOf('Dave Van Mol');
  const fabian = html.indexOf('Fabian Verhenne');
  assert.ok(peter > 0 && tseng > 0);
  assert.ok(Math.max(peter, tseng) < Math.min(dave, fabian));
  const eric = html.indexOf('Eric Staepelaere');
  const dirk = html.lastIndexOf('D. De Bie');
  const lastBeforeDirk = Math.max(eric, dave, fabian, peter);
  assert.ok(eric > fabian);
  assert.ok(dirk > eric);
  assert.ok(lastBeforeDirk < dirk);
});

test('player points follow the Zenakalm cup sheet', () => {
  const byMember = Object.fromEntries(data.players.map((p) => [p.member, p.points]));
  assert.equal(byMember.A5391, 5);
  assert.equal(byMember.A4670, 5);
  assert.equal(byMember.A5414, 2);
  assert.equal(byMember.A8102, 2);
  assert.equal(byMember.A7827, 0);
  assert.equal(byMember.A4005, 0);
});
