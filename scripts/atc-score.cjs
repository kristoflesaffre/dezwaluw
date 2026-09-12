const USER_AGENT = 'DeZwaluwClubSite/1.0 (score update; +https://github.com/kristoflesaffre/dezwaluw)';

function todayInBrussels(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Brussels',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

function parseAtcScore(html) {
  const match = String(html).match(/<span class="score">\s*(\d+)\s*-\s*(\d+)\s*<\/span>/i);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function scoresEqual(a, b) {
  return Boolean(a && b && a.home === b.home && a.away === b.away);
}

function shouldFetchFixture(fixture, today = todayInBrussels()) {
  return Boolean(fixture?.url) && fixture.date <= today;
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

function syncClubData(appSource, data) {
  if (!/const clubData=/.test(appSource)) {
    throw new Error('app.js mist de ingebedde clubData');
  }
  return appSource.replace(/const clubData=\{[\s\S]*?\};/, `const clubData=${JSON.stringify(data)};`);
}

async function fetchMatchHtml(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html' }
  });
  if (!response.ok) {
    throw new Error(`ATC gaf ${response.status} voor ${url}`);
  }
  return response.text();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectScores(fixtures, { today = todayInBrussels(), fetchImpl = fetch, delayMs = 800 } = {}) {
  const scoresByUrl = {};
  for (const fixture of fixtures) {
    if (!shouldFetchFixture(fixture, today)) continue;
    const html = await fetchMatchHtml(fixture.url, fetchImpl);
    const score = parseAtcScore(html);
    if (score) scoresByUrl[fixture.url] = score;
    if (delayMs) await sleep(delayMs);
  }
  return scoresByUrl;
}

module.exports = {
  USER_AGENT,
  applyScore,
  applyScores,
  collectScores,
  fetchMatchHtml,
  parseAtcScore,
  shouldFetchFixture,
  sleep,
  syncClubData,
  todayInBrussels
};
