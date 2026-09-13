#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { syncClubData, syncFromAtc, syncStandingsPage, todayInBrussels } = require('./atc-score.cjs');
const { writeCalendar } = require('./build-calendar.cjs');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'dist', 'data.json');
const appPath = path.join(root, 'dist', 'app.js');
const htmlPath = path.join(root, 'dist', 'index.html');

async function main() {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const today = todayInBrussels();
  const { data: next, matchData } = await syncFromAtc(data, { today });
  fs.writeFileSync(dataPath, `${JSON.stringify(next, null, 2)}\n`);
  fs.writeFileSync(appPath, syncClubData(fs.readFileSync(appPath, 'utf8'), next));
  fs.writeFileSync(htmlPath, syncStandingsPage(fs.readFileSync(htmlPath, 'utf8'), next.standings?.rows || [], next.checked));
  writeCalendar(root);
  const updated = next.fixtures.filter((fixture) => matchData.scoresByUrl[fixture.url]);
  if (!updated.length) {
    console.log(`ATC bijgewerkt tot ${today}. Geen nieuwe uitslagen.`);
    return;
  }
  for (const fixture of updated) {
    const score = fixture.score;
    console.log(`${fixture.date} ${fixture.home} ${score.home}–${score.away} ${fixture.away}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
