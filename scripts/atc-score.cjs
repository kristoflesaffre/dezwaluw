const USER_AGENT = 'DeZwaluwClubSite/1.0 (score update; +https://github.com/kristoflesaffre/dezwaluw)';
const CLUB_URL = 'https://www.atc-tafelvoetbal.be/clubs/186';
const COMPETITION_URL = 'https://www.atc-tafelvoetbal.be/competition/35';
const TEAM = 'De Zwaluw';
const HOME_GROUND = {
  venue: 'Café De Zwaluw',
  address: 'Molenstraat 47, 2550 Kontich'
};

function todayInBrussels(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Brussels',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

function monthName(iso) {
  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  const [, month] = iso.split('-');
  return months[Number(month) - 1];
}

function formatDutchDate(iso) {
  const [year, , day] = iso.split('-');
  return `${Number(day)} ${monthName(iso)} ${year}`;
}

function decodeEntities(value) {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(html) {
  return decodeEntities(String(html).replace(/<[^>]+>/g, ' '));
}

function parseAtcScore(html) {
  const match = String(html).match(/<span class="score">\s*(\d+)\s*-\s*(\d+)\s*<\/span>/i);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function parseScoreText(text) {
  const match = String(text).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function scoresEqual(a, b) {
  return Boolean(a && b && a.home === b.home && a.away === b.away);
}

function isZwaluwFixture(fixture) {
  if (!fixture?.home && !fixture?.away) return Boolean(fixture?.url);
  return fixture.home === TEAM || fixture.away === TEAM;
}

function shouldFetchFixture(fixture, today = todayInBrussels()) {
  return Boolean(fixture?.url) && fixture.date <= today && isZwaluwFixture(fixture);
}

function applyScore(fixture, score) {
  if (!score) return { ...fixture };
  if (scoresEqual(fixture.score, score)) return fixture;
  return { ...fixture, score };
}

function applyScores(data, scoresByUrl, checked = todayInBrussels()) {
  return {
    ...data,
    checked,
    fixtures: data.fixtures.map((fixture) => applyScore(fixture, scoresByUrl[fixture.url]))
  };
}

function applyVenues(data, venuesByUrl) {
  if (!venuesByUrl || !Object.keys(venuesByUrl).length) return data;
  return {
    ...data,
    fixtures: data.fixtures.map((fixture) => {
      const venue = venuesByUrl[fixture.url];
      if (!venue) return fixture;
      if (fixture.venue && fixture.address) return fixture;
      return { ...fixture, venue: fixture.venue || venue.venue, address: fixture.address || venue.address };
    })
  };
}

function parseVenue(html) {
  const block = String(html).match(/<div class="lokaal-teaser">[\s\S]*?<h3>\s*([\s\S]*?)\s*<\/h3>[\s\S]*?<li class="address">\s*([\s\S]*?)\s*<\/li>/i);
  if (!block) return null;
  const venue = decodeEntities(block[1]);
  const address = decodeEntities(block[2]);
  if (!venue || !address) return null;
  return { venue, address };
}

function parseZwaluwMatchPlayers(html) {
  const section = String(html).match(/<h2>\s*De Zwaluw\s*<\/h2>([\s\S]*?)(?:<h2>|<div class="matches")/i);
  if (!section) return [];
  const players = [];
  const row = /player__name">\s*([\s\S]*?)\s*<\/div>[\s\S]*?player__results">\s*(\d+)\s*\/\s*(\d+)\s*<\/div>/gi;
  let match;
  while ((match = row.exec(section[1]))) {
    const name = decodeEntities(match[1]);
    const points = Number(match[2]);
    const legs = Number(match[3]);
    if (!name || legs <= 0) continue;
    players.push({ name, points });
  }
  return players;
}

function addPlayerTotals(totals, players) {
  for (const player of players) {
    const current = totals[player.name] || { points: 0, games: 0 };
    current.points += player.points;
    current.games += 1;
    totals[player.name] = current;
  }
  return totals;
}

function applyPlayerTotals(data, totals) {
  if (!totals || !Object.keys(totals).length) return data;
  return {
    ...data,
    players: data.players.map((player) => {
      const found = totals[player.name];
      const points = found ? found.points : 0;
      const games = found ? found.games : 0;
      return { ...player, points, games, played: games > 0 };
    })
  };
}

function parseIsoDate(text) {
  const match = String(text).match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function fixtureType(label) {
  const value = String(label).toLowerCase();
  if (value.includes('competitie')) return 'competitie';
  if (value.includes('beker')) return 'beker';
  if (value.includes('inhaaldag')) return 'inhaaldag';
  if (value.includes('kampioenschap')) return 'kampioenschappen';
  return 'andere';
}

function otherType(label) {
  const type = fixtureType(label);
  if (type === 'beker') return String(label).toLowerCase().includes('finale') ? 'Beker' : 'Beker';
  if (type === 'inhaaldag') return 'Inhaaldag';
  if (type === 'kampioenschappen') return 'Kampioenschappen';
  if (type === 'competitie') return 'Competitie';
  return 'Andere';
}

function parseClubCalendar(html) {
  const block = String(html).match(/<h3>\s*Wedstrijden\s*<\/h3>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i);
  if (!block) return { fixtures: [], other: [] };
  const fixtures = [];
  const other = [];
  for (const row of block[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cell[1]);
    if (cells.length < 5) continue;
    const date = parseIsoDate(stripTags(cells[0]));
    const rawType = stripTags(cells[1]);
    const home = stripTags(cells[2]);
    const away = stripTags(cells[3]);
    const scoreCell = cells[4];
    const urlMatch = String(scoreCell).match(/href="(https:\/\/www\.atc-tafelvoetbal\.be\/wedstrijden\/\d+)"/i);
    const url = urlMatch ? urlMatch[1] : '';
    const score = parseScoreText(stripTags(scoreCell));
    if (!date) continue;
    const isZwaluw = home === TEAM || away === TEAM;
    if (home && away && !isZwaluw) continue;
    if (isZwaluw && home && away && url) {
      fixtures.push({
        date,
        type: fixtureType(rawType),
        home,
        away,
        score,
        url
      });
      continue;
    }
    other.push({
      date,
      type: otherType(rawType),
      ...(String(rawType).toLowerCase().includes('finale') ? { note: 'Finales' } : {})
    });
  }
  return { fixtures, other };
}

function parseClubPlayers(html) {
  const block = String(html).match(/<h3>\s*Spelers\s*<\/h3>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i);
  if (!block) return [];
  const players = [];
  for (const row of block[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const href = row[1].match(/href="(https:\/\/www\.atc-tafelvoetbal\.be\/players\/\d+)"/i);
    const name = row[1].match(/<a[^>]*>\s*([\s\S]*?)\s*<\/a>/i);
    const member = row[1].match(/\b(A\d+)\b/);
    const ranking = row[1].match(/\b(\d+P)\b/);
    if (!href || !name || !member) continue;
    players.push({
      name: decodeEntities(name[1]),
      member: member[1],
      ranking: ranking ? ranking[1] : '',
      url: href[1]
    });
  }
  return players;
}

function parseStandings(html) {
  const block = String(html).match(/<th[^>]*>\s*Teams\s*<\/th>[\s\S]*?<\/thead>\s*<tbody>([\s\S]*?)<\/tbody>/i);
  if (!block) return [];
  const rows = [];
  for (const row of block[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1]));
    if (cells.length < 8) continue;
    const rank = Number(cells[0]);
    const team = cells[1];
    if (!rank || !team) continue;
    rows.push({
      rank,
      team,
      points: Number(cells[2]) || 0,
      played: Number(cells[3]) || 0,
      won: Number(cells[4]) || 0,
      drawn: Number(cells[5]) || 0,
      lost: Number(cells[6]) || 0,
      sets: Number(cells[7]) || 0
    });
  }
  return rows;
}

function venueFor(home, away, existing) {
  if (home === TEAM) return HOME_GROUND;
  const atOpponent = existing.find((fixture) => fixture.home === home && fixture.venue && fixture.address);
  if (atOpponent) return { venue: atOpponent.venue, address: atOpponent.address };
  return { venue: '', address: '' };
}

function mergeOther(existing, incoming) {
  return incoming.map((item) => {
    const previous = (existing || []).find((entry) => entry.date === item.date && String(entry.type).toLowerCase() === String(item.type).toLowerCase());
    if (previous?.note && !item.note) return { ...item, note: previous.note };
    return item;
  });
}

function mergeFixtures(existing, incoming) {
  const next = existing.map((fixture) => {
    const update = incoming.find((row) => row.url === fixture.url || (row.date === fixture.date && row.home === fixture.home && row.away === fixture.away));
    if (!update) return fixture;
    return {
      ...fixture,
      type: update.type || fixture.type,
      home: update.home,
      away: update.away,
      url: update.url || fixture.url,
      score: update.score || fixture.score
    };
  });
  for (const row of incoming) {
    const seen = next.some((fixture) => fixture.url === row.url || (fixture.date === row.date && fixture.home === row.home && fixture.away === row.away));
    if (seen) continue;
    const place = venueFor(row.home, row.away, existing);
    next.push({
      date: row.date,
      type: row.type,
      home: row.home,
      away: row.away,
      score: row.score,
      url: row.url,
      venue: place.venue,
      address: place.address
    });
  }
  next.sort((a, b) => a.date.localeCompare(b.date) || a.url.localeCompare(b.url));
  return next;
}

function applyRoster(data, roster) {
  if (!roster.length) return data;
  const players = data.players.map((player) => {
    const update = roster.find((entry) => entry.member === player.member);
    if (!update) return player;
    return {
      ...player,
      name: update.name || player.name,
      ranking: update.ranking || player.ranking,
      url: update.url || player.url
    };
  });
  for (const entry of roster) {
    if (players.some((player) => player.member === entry.member)) continue;
    players.push({
      name: entry.name,
      member: entry.member,
      ranking: entry.ranking,
      url: entry.url,
      display: entry.name,
      points: 0,
      photo: '',
      crown: '',
      played: false,
      games: 0
    });
  }
  return { ...data, players };
}

function applyCalendar(data, calendar) {
  return {
    ...data,
    fixtures: mergeFixtures(data.fixtures || [], calendar.fixtures || []),
    other: mergeOther(data.other || [], calendar.other || [])
  };
}

function previousLabelFor(team, data) {
  const catalog = data?.previousSeason?.teams?.[team];
  if (catalog && typeof catalog === 'object' && catalog.label) return catalog.label;
  if (typeof catalog === 'string') return catalog;
  const existing = (data?.standings?.rows || []).find((row) => row.team === team);
  return existing?.previous || '';
}

function applyStandings(data, rows) {
  if (!rows.length) return data;
  const enriched = rows.map((row) => {
    const previous = previousLabelFor(row.team, data) || row.previous || '';
    return previous ? { ...row, previous } : { ...row };
  });
  return { ...data, standings: { rows: enriched } };
}

function standingsRowsHtml(rows) {
  return rows.map((row) => {
    const ours = row.team === TEAM;
    const name = ours ? `${TEAM} <span>WIJ</span>` : escapePlain(row.team);
    const prev = row.previous
      ? ` <span class="prev-season" title="Eindstand reguliere competitie seizoen 2025–2026">${escapePlain(row.previous)}</span>`
      : '';
    return `<tr class="${ours ? 'our-team' : ''}"><td>${String(row.rank).padStart(2, '0')}</td><th scope="row">${name}${prev}</th><td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td><td>${row.sets}</td></tr>`;
  }).join('');
}

function escapePlain(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function syncStandingsPage(html, rows, checked) {
  if (!rows.length) return html;
  const date = formatDutchDate(checked);
  const played = rows.some((row) => Number(row.played) > 0);
  let next = html.replace(
    /(<p class="source-note">)Stand op [\s\S]*?(<\/p><a class="text-link" href="https:\/\/www\.atc-tafelvoetbal\.be\/competition\/35")/,
    `$1Stand op ${date}.<br>${played ? '' : 'Nog geen competitiewedstrijden gespeeld.<br>'}De volgorde volgt ATC.<br>Grijs label = eindstand vorig seizoen (2025–2026).$2`
  );
  next = next.replace(
    /(<caption class="sr-only">Stand ATC reeks 1A, )[^<]+(<\/caption>[\s\S]*?<tbody>)[\s\S]*?(<\/tbody>)/,
    `$1${date}$2${standingsRowsHtml(rows)}$3`
  );
  next = next.replace(
    /Gegevens overgenomen op [^.;]+; deze site wordt niet automatisch gesynchroniseerd\./,
    `Laatst automatisch gecontroleerd op ${date}. De site synchroniseert wekelijks met ATC.`
  );
  next = next.replace(
    /Laatst automatisch gecontroleerd op [^.<]+/,
    `Laatst automatisch gecontroleerd op ${date}`
  );
  return next;
}

function syncClubData(appSource, data) {
  if (!/const clubData=/.test(appSource)) {
    throw new Error('app.js mist de ingebedde clubData');
  }
  return appSource.replace(/const clubData=\{[\s\S]*?\};/, `const clubData=${JSON.stringify(data)};`);
}

async function fetchPage(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html' }
  });
  if (!response.ok) {
    throw new Error(`ATC gaf ${response.status} voor ${url}`);
  }
  return response.text();
}

const fetchMatchHtml = fetchPage;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectMatchData(fixtures, { today = todayInBrussels(), fetchImpl = fetch, delayMs = 800 } = {}) {
  const scoresByUrl = {};
  const venuesByUrl = {};
  const playerTotals = {};
  for (const fixture of fixtures) {
    const needsVenue = Boolean(fixture?.url) && (fixture.home === TEAM || fixture.away === TEAM) && (!fixture.venue || !fixture.address);
    if (!shouldFetchFixture(fixture, today) && !needsVenue) continue;
    const html = await fetchPage(fixture.url, fetchImpl);
    const score = parseAtcScore(html);
    if (score) scoresByUrl[fixture.url] = score;
    const venue = parseVenue(html);
    if (venue) venuesByUrl[fixture.url] = venue;
    addPlayerTotals(playerTotals, parseZwaluwMatchPlayers(html));
    if (delayMs) await sleep(delayMs);
  }
  return { scoresByUrl, venuesByUrl, playerTotals };
}

async function collectScores(fixtures, options) {
  const { scoresByUrl } = await collectMatchData(fixtures, options);
  return scoresByUrl;
}

async function syncFromAtc(data, { today = todayInBrussels(), fetchImpl = fetch, delayMs = 800 } = {}) {
  const clubHtml = await fetchPage(CLUB_URL, fetchImpl);
  if (delayMs) await sleep(delayMs);
  const competitionHtml = await fetchPage(COMPETITION_URL, fetchImpl);
  if (delayMs) await sleep(delayMs);
  let next = applyCalendar(data, parseClubCalendar(clubHtml));
  next = applyRoster(next, parseClubPlayers(clubHtml));
  next = applyStandings(next, parseStandings(competitionHtml));
  const matchData = await collectMatchData(next.fixtures, { today, fetchImpl, delayMs });
  next = applyScores(next, matchData.scoresByUrl, today);
  next = applyVenues(next, matchData.venuesByUrl);
  next = applyPlayerTotals(next, matchData.playerTotals);
  return { data: next, matchData };
}

module.exports = {
  CLUB_URL,
  COMPETITION_URL,
  HOME_GROUND,
  TEAM,
  USER_AGENT,
  addPlayerTotals,
  applyCalendar,
  applyPlayerTotals,
  isZwaluwFixture,
  applyRoster,
  applyScore,
  applyScores,
  applyStandings,
  previousLabelFor,
  applyVenues,
  collectMatchData,
  collectScores,
  fetchMatchHtml,
  formatDutchDate,
  parseAtcScore,
  parseClubCalendar,
  parseClubPlayers,
  parseStandings,
  parseVenue,
  parseZwaluwMatchPlayers,
  shouldFetchFixture,
  sleep,
  standingsRowsHtml,
  syncClubData,
  syncFromAtc,
  syncStandingsPage,
  todayInBrussels
};
