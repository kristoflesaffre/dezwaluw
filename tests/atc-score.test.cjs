const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  applyScores,
  collectScores,
  parseAtcScore,
  shouldFetchFixture,
  syncClubData
} = require('../scripts/atc-score.cjs');

const playedHtml = `
<h1>
  11/09/2026 - Zenakalm - De Zwaluw
  <span class="score">
    11 - 7
  </span>
</h1>
<table><tr><td>11 - 7</td></tr></table>
`;

test('leest de officiële ATC-uitslag uit de score-span in de titel', () => {
  assert.deepEqual(parseAtcScore(playedHtml), { home: 11, away: 7 });
});

test('negeert een lege score-span van een nog niet gespeelde wedstrijd', () => {
  assert.equal(parseAtcScore('<h1>NXT - De Zwaluw <span class="score">  </span></h1>'), null);
});

test('haalt alleen wedstrijden tot en met vandaag op', () => {
  assert.equal(shouldFetchFixture({ date: '2026-09-11', url: 'https://example.test/2985' }, '2026-09-12'), true);
  assert.equal(shouldFetchFixture({ date: '2026-09-18', url: 'https://example.test/3008' }, '2026-09-12'), false);
  assert.equal(shouldFetchFixture({ date: '2026-09-11' }, '2026-09-12'), false);
});

test('zet gevonden uitslagen op de juiste wedstrijd en werkt de controledatum bij', () => {
  const data = {
    checked: '2026-09-11',
    fixtures: [
      { date: '2026-09-11', home: 'Zenakalm', away: 'De Zwaluw', score: null, url: 'https://www.atc-tafelvoetbal.be/wedstrijden/2985' },
      { date: '2026-09-18', home: 'NXT', away: 'De Zwaluw', score: null, url: 'https://www.atc-tafelvoetbal.be/wedstrijden/3008' }
    ]
  };
  const next = applyScores(data, {
    'https://www.atc-tafelvoetbal.be/wedstrijden/2985': { home: 11, away: 7 }
  }, '2026-09-12');
  assert.equal(next.checked, '2026-09-12');
  assert.deepEqual(next.fixtures[0].score, { home: 11, away: 7 });
  assert.equal(next.fixtures[1].score, null);
});

test('houdt de ingebedde clubData in app.js gelijk aan data.json', () => {
  const data = { checked: '2026-09-12', fixtures: [] };
  const synced = syncClubData('const clubData={"checked":"2026-09-11"};\nconst x=1;', data);
  assert.equal(synced, `const clubData=${JSON.stringify(data)};\nconst x=1;`);
});

test('vraagt alleen voorbije ATC-wedstrijdbladen op', async () => {
  const requested = [];
  const scores = await collectScores([
    { date: '2026-09-11', url: 'https://www.atc-tafelvoetbal.be/wedstrijden/2985' },
    { date: '2026-09-18', url: 'https://www.atc-tafelvoetbal.be/wedstrijden/3008' }
  ], {
    today: '2026-09-12',
    delayMs: 0,
    fetchImpl: async (url) => {
      requested.push(url);
      return { ok: true, text: async () => playedHtml };
    }
  });
  assert.deepEqual(requested, ['https://www.atc-tafelvoetbal.be/wedstrijden/2985']);
  assert.deepEqual(scores['https://www.atc-tafelvoetbal.be/wedstrijden/2985'], { home: 11, away: 7 });
});
