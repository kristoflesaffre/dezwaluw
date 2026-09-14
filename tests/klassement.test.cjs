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
  const panel = html.slice(html.indexOf('id="klassement"'), html.indexOf('id="aanwezigheid"'));
  const kristof = panel.indexOf('Kristof Lesaffre');
  const jeroen = panel.indexOf('Jeroen Peeters');
  const gregory = panel.indexOf('Gregory Jacobs');
  assert.ok(kristof > 0 && jeroen > 0);
  assert.ok(Math.min(kristof, jeroen) < gregory);
  assert.match(panel, /kristof-lesaffre-kroon\.png/);
  assert.match(panel, /jeroen-peeters-kroon\.png/);
  assert.doesNotMatch(panel, /gregory-jacobs-kroon\.png/);
  assert.match(panel, /gregory-jacobs\.png/);
  assert.equal((panel.match(/klassement-row is-lead/g) || []).length, 2);
  assert.match(panel, /Jeroen Peeters<\/span><span class="klassement-games">1 wedstrijd gespeeld<\/span>/);
  assert.match(panel, /Dave Van Mol<\/span><span class="klassement-games">0 wedstrijden gespeeld<\/span>/);
});

test('players who have not played yet sit below everyone who already has a match', () => {
  const html = render();
  const panel = html.slice(html.indexOf('id="klassement"'), html.indexOf('id="aanwezigheid"'));
  const peter = panel.indexOf('Peter De Bie');
  const tseng = panel.indexOf('Tseng-sing Choi');
  const dave = panel.indexOf('Dave Van Mol');
  const fabian = panel.indexOf('Fabian Verhenne');
  assert.ok(peter > 0 && tseng > 0);
  assert.ok(Math.max(peter, tseng) < Math.min(dave, fabian));
  const eric = panel.indexOf('Eric Staepelaere');
  const dirk = panel.lastIndexOf('D. De Bie');
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

test('aanwezigheid ranks by match attendance and crowns joint leaders', () => {
  const html = render();
  assert.match(html, /id="tab-aanwezigheid"/);
  assert.match(html, /id="aanwezigheid"[^>]*hidden/);
  const panel = html.slice(html.indexOf('id="aanwezigheid"'));
  assert.match(panel, /aanwezigheid/);
  assert.match(panel, /1 <small>aanw<\/small>/);
  assert.match(panel, /0 <small>aanw<\/small>/);
  assert.match(panel, /1 aanwezigheid/);
  assert.match(panel, /0 aanwezigheden/);
  // Six players attended the first match → six joint attendance leaders with crowns
  assert.equal((panel.match(/klassement-row is-lead/g) || []).length, 6);
  assert.match(panel, /kristof-lesaffre-kroon\.png/);
  assert.match(panel, /jeroen-peeters-kroon\.png/);
  assert.match(panel, /peter-de-bie-kroon\.png/);
  assert.match(panel, /paul-godefroy-kroon\.png/);
  assert.match(panel, /gregory-jacobs-kroon\.png/);
  assert.match(panel, /tseng-sing-choi-kroon\.png/);
  const dave = panel.indexOf('Dave Van Mol');
  const kristof = panel.indexOf('Kristof Lesaffre');
  const dirk = panel.lastIndexOf('D. De Bie');
  assert.ok(kristof > 0 && dave > 0);
  assert.ok(kristof < dave);
  assert.ok(dirk > dave);
  assert.ok(dirk === Math.max(
    panel.indexOf('Dave Van Mol'),
    panel.indexOf('David Loos'),
    panel.indexOf('Eric Staepelaere'),
    panel.indexOf('Fabian Verhenne'),
    dirk
  ));
});
