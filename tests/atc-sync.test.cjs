const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  applyCalendar,
  applyPlayerTotals,
  applyRoster,
  applyStandings,
  collectMatchData,
  parseClubCalendar,
  parseClubPlayers,
  parseStandings,
  parseVenue,
  parseZwaluwMatchPlayers,
  syncFromAtc,
  syncStandingsPage
} = require('../scripts/atc-score.cjs');

const matchHtml = `
<h1>11/09/2026 - Zenakalm - De Zwaluw <span class="score">11 - 7</span></h1>
<h2>Zenakalm</h2>
<div class="wedstrijd-couples-wrap">
  <div class="wedstrijd-couples-wrap__couple__couple__player__name">T. Putman</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__results">4 / 6</div>
</div>
<h2>De Zwaluw</h2>
<div class="wedstrijd-couples-wrap">
  <div class="wedstrijd-couples-wrap__couple__couple__player__name">P. Godefroy</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__results">2 / 6</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__name">G. Jacobs</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__results">2 / 6</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__name">K. Lesaffre</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__results">5 / 6</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__name">Reserve</div>
  <div class="wedstrijd-couples-wrap__couple__couple__player__results">0 / 0</div>
</div>
<div class="matches"></div>
<div class="lokaal-teaser"><h3>Cj&#039;s</h3><ul><li class="address">Alfons Schneiderlaan 237, 2100 Deurne</li></ul></div>
`;

const clubHtml = `
<h3>Spelers</h3>
<table><tbody>
<tr><td>1A</td><td><div class="player-name"><a href="https://www.atc-tafelvoetbal.be/players/554">K. Lesaffre</a></div></td><td>De Zwaluw</td><td>A5391</td><td>2P</td></tr>
<tr><td>1A</td><td><div class="player-name"><a href="https://www.atc-tafelvoetbal.be/players/1">N. Speler</a></div></td><td>De Zwaluw</td><td>A9999</td><td>1P</td></tr>
</tbody></table>
<h3>Wedstrijden</h3>
<table><tbody>
<tr><td>11/09/2026</td><td>Beker Beker van ATC</td><td>Zenakalm</td><td>De Zwaluw</td><td><a href="https://www.atc-tafelvoetbal.be/wedstrijden/2985">11 - 7</a></td></tr>
<tr><td>18/09/2026</td><td>Competitie 1A</td><td>NXT</td><td>De Zwaluw</td><td><a href="https://www.atc-tafelvoetbal.be/wedstrijden/3008">Detail</a></td></tr>
<tr><td>09/10/2026</td><td>Beker Beker van ATC</td><td>De Zwaluw</td><td>Nieuwe Ploeg</td><td><a href="https://www.atc-tafelvoetbal.be/wedstrijden/3999">Detail</a></td></tr>
<tr><td>30/10/2026</td><td>Beker</td><td></td><td></td><td></td></tr>
<tr><td>18/09/2026</td><td>Competitie 1A</td><td>Roadhouse</td><td>Peeke Binne</td><td><a href="https://www.atc-tafelvoetbal.be/wedstrijden/3005">Detail</a></td></tr>
</tbody></table>
`;

const standingsHtml = `
<table>
<thead><tr><th>#</th><th>Teams</th><th>Pt.</th><th>Gesp.</th><th>W</th><th>G</th><th>V</th><th>Sets</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="https://www.atc-tafelvoetbal.be/clubs/198">BP Ratten</a></td><td class="hidden-lg">2</td><td>1</td><td>1</td><td>0</td><td>0</td><td>11</td><td>2</td><td></td></tr>
<tr><td>6</td><td><a href="https://www.atc-tafelvoetbal.be/clubs/186">De Zwaluw</a></td><td class="hidden-lg">0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>7</td><td>0</td><td></td></tr>
</tbody>
</table>
`;

test('leest alleen De Zwaluw-spelers en hun punten van het wedstrijdblad', () => {
  const players = parseZwaluwMatchPlayers(matchHtml);
  assert.deepEqual(players, [
    { name: 'P. Godefroy', points: 2 },
    { name: 'G. Jacobs', points: 2 },
    { name: 'K. Lesaffre', points: 5 }
  ]);
});

test('leest zaal en adres van het wedstrijdblad', () => {
  assert.deepEqual(parseVenue(matchHtml), {
    venue: "Cj's",
    address: 'Alfons Schneiderlaan 237, 2100 Deurne'
  });
});

test('leest de Zwaluw-kalender en negeert wedstrijden van andere ploegen', () => {
  const calendar = parseClubCalendar(clubHtml);
  assert.equal(calendar.fixtures.length, 3);
  assert.deepEqual(calendar.fixtures.map((row) => row.away), ['De Zwaluw', 'De Zwaluw', 'Nieuwe Ploeg']);
  assert.deepEqual(calendar.fixtures[0].score, { home: 11, away: 7 });
  assert.equal(calendar.other.length, 1);
  assert.equal(calendar.other[0].date, '2026-10-30');
  assert.ok(!calendar.fixtures.some((row) => row.url.includes('/3005')));
});

test('leest de 1A-stand van ATC', () => {
  const rows = parseStandings(standingsHtml);
  assert.equal(rows[0].team, 'BP Ratten');
  assert.equal(rows[0].played, 1);
  assert.equal(rows[0].points, 2);
  assert.equal(rows[1].team, 'De Zwaluw');
  assert.equal(rows[1].lost, 1);
});

test('telt punten en gespeelde Zwaluw-matchen per speler', () => {
  const data = {
    players: [
      { name: 'K. Lesaffre', member: 'A5391', points: 0, played: false },
      { name: 'D. Loos', member: 'A7958', points: 9, played: true, games: 3 }
    ]
  };
  const next = applyPlayerTotals(data, { 'K. Lesaffre': { points: 5, games: 1 } });
  assert.equal(next.players[0].points, 5);
  assert.equal(next.players[0].games, 1);
  assert.equal(next.players[1].points, 0);
  assert.equal(next.players[1].played, false);
});

test('voegt een nieuwe bevestigde Zwaluw-beker toe en laat vreemde ploegen weg', () => {
  const data = {
    fixtures: [
      { date: '2026-09-11', type: 'beker', home: 'Zenakalm', away: 'De Zwaluw', score: null, url: 'https://www.atc-tafelvoetbal.be/wedstrijden/2985', venue: "Cj's", address: 'Alfons Schneiderlaan 237, 2100 Deurne' }
    ],
    other: []
  };
  const next = applyCalendar(data, parseClubCalendar(clubHtml));
  assert.equal(next.fixtures.length, 3);
  const neu = next.fixtures.find((row) => row.url.endsWith('/3999'));
  assert.equal(neu.home, 'De Zwaluw');
  assert.equal(neu.venue, 'Café De Zwaluw');
  assert.ok(!next.fixtures.some((row) => row.home === 'Roadhouse'));
});

test('werkt ranking bij en voegt een nieuwe Zwaluw-speler toe zonder foto', () => {
  const next = applyRoster({
    players: [{ name: 'K. Lesaffre', member: 'A5391', ranking: '3P', url: '', display: 'Kristof Lesaffre', photo: 'x.png' }]
  }, parseClubPlayers(clubHtml));
  assert.equal(next.players[0].ranking, '2P');
  assert.equal(next.players[0].display, 'Kristof Lesaffre');
  assert.equal(next.players[1].member, 'A9999');
  assert.equal(next.players[1].photo, '');
});

test('zet de reeksstand in de data', () => {
  const next = applyStandings({}, parseStandings(standingsHtml));
  assert.equal(next.standings.rows[1].team, 'De Zwaluw');
});

test('vraagt geen wedstrijdbladen van andere ploegen', async () => {
  const requested = [];
  await collectMatchData([
    { date: '2026-09-11', home: 'Zenakalm', away: 'De Zwaluw', url: 'https://www.atc-tafelvoetbal.be/wedstrijden/2985' },
    { date: '2026-09-11', home: 'Roadhouse', away: 'Peeke Binne', url: 'https://www.atc-tafelvoetbal.be/wedstrijden/3005' }
  ], {
    today: '2026-09-12',
    delayMs: 0,
    fetchImpl: async (url) => {
      requested.push(url);
      return { ok: true, text: async () => matchHtml };
    }
  });
  assert.deepEqual(requested, ['https://www.atc-tafelvoetbal.be/wedstrijden/2985']);
});

test('syncFromAtc haalt club, reeks en alleen Zwaluw-bladen op', async () => {
  const requested = [];
  const pages = {
    'https://www.atc-tafelvoetbal.be/clubs/186': clubHtml,
    'https://www.atc-tafelvoetbal.be/competition/35': standingsHtml,
    'https://www.atc-tafelvoetbal.be/wedstrijden/2985': matchHtml,
    'https://www.atc-tafelvoetbal.be/wedstrijden/3999': matchHtml.replace('Cj&#039;s', 'Café De Zwaluw').replace('Alfons Schneiderlaan 237, 2100 Deurne', 'Molenstraat 47, 2550 Kontich')
  };
  const { data } = await syncFromAtc({
    fixtures: [],
    players: [{ name: 'K. Lesaffre', member: 'A5391', ranking: '2P', display: 'Kristof', photo: '' }],
    other: []
  }, {
    today: '2026-09-12',
    delayMs: 0,
    fetchImpl: async (url) => {
      requested.push(url);
      return { ok: true, text: async () => pages[url] || '' };
    }
  });
  assert.ok(requested.includes('https://www.atc-tafelvoetbal.be/clubs/186'));
  assert.ok(requested.includes('https://www.atc-tafelvoetbal.be/competition/35'));
  assert.ok(requested.includes('https://www.atc-tafelvoetbal.be/wedstrijden/2985'));
  assert.ok(!requested.includes('https://www.atc-tafelvoetbal.be/wedstrijden/3005'));
  assert.deepEqual(data.fixtures[0].score, { home: 11, away: 7 });
  assert.equal(data.players.find((player) => player.name === 'K. Lesaffre').points, 5);
  assert.equal(data.standings.rows[0].team, 'BP Ratten');
});

test('schrijft de stand en de sync-zin in de HTML', () => {
  const html = `<p class="source-note">Stand op 11 september 2026.<br>Nog geen competitiewedstrijden gespeeld.<br>De volgorde volgt ATC; alle ploegen staan gelijk.</p><a class="text-link" href="https://www.atc-tafelvoetbal.be/competition/35"></a><table><caption class="sr-only">Stand ATC reeks 1A, 11 september 2026</caption><thead></thead><tbody><tr></tr></tbody></table>Gegevens overgenomen op 12 september 2026; deze site wordt niet automatisch gesynchroniseerd.`;
  const next = syncStandingsPage(html, parseStandings(standingsHtml), '2026-09-13');
  assert.match(next, /Stand op 13 september 2026/);
  assert.doesNotMatch(next, /Nog geen competitiewedstrijden gespeeld/);
  assert.match(next, /De Zwaluw <span>WIJ<\/span>/);
  assert.match(next, /synchroniseert wekelijks met ATC/);
});
