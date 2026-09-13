const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildIcs, brusselsOffsetMinutes, utcStamp } = require('../scripts/build-calendar.cjs');

const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'dist', 'data.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const ics = fs.readFileSync(path.join(root, 'dist', 'de-zwaluw.ics'), 'utf8');

test('the ICS file lists every confirmed De Zwaluw match from 22u to midnight', () => {
  const matches = data.fixtures.filter((f) => f.home && f.away);
  assert.equal(matches.length, 20);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, matches.length);
  assert.match(ics, /X-WR-CALNAME:De Zwaluw/);
  assert.match(ics, /X-WR-TIMEZONE:Europe\/Brussels/);
  assert.match(ics, /SUMMARY:Sjotter Zenakalm vs De Zwaluw/);
  assert.match(ics, /SUMMARY:Sjotter NXT vs De Zwaluw/);
  assert.match(ics, /SUMMARY:Sjotter De Zwaluw vs BP Ratten/);
  assert.match(ics, /LOCATION:Hanenberg\\, Hodonk 63\\, 2470 Retie/);
  assert.match(ics, /LOCATION:Café De Zwaluw\\, Molenstraat 47\\, 2550 Kontich/);
  assert.match(ics, /Uitslag 11–7/);
  assert.doesNotMatch(ics, /Inhaaldag/);
  assert.doesNotMatch(ics, /Kampioenschappen/);
  assert.doesNotMatch(ics, /\\\r?\n n/);
  assert.equal(brusselsOffsetMinutes('2026-09-18'), 120);
  assert.equal(brusselsOffsetMinutes('2027-01-15'), 60);
  assert.equal(utcStamp('2026-09-18', 22, 0, 120), '20260918T200000Z');
  assert.equal(utcStamp('2026-09-19', 0, 0, 120), '20260918T220000Z');
  assert.equal(utcStamp('2027-01-15', 22, 0, 60), '20270115T210000Z');
  const generated = buildIcs(data, new Date('2026-09-13T12:00:00Z'));
  assert.match(generated, /DTSTART:20260918T200000Z/);
  assert.match(generated, /DTEND:20260918T220000Z/);
  assert.match(generated, /DTSTART:20270115T210000Z/);
  assert.match(generated, /DTEND:20270115T230000Z/);
});

test('the calendar page offers the ICS file for Google Calendar', () => {
  assert.match(html, /class="button primary calendar-add"/);
  assert.match(html, /calendar\.google\.com\/calendar\/render\?cid=/);
  assert.match(html, /dezwaluw-pi\.vercel\.app%2Fde-zwaluw\.ics/);
  assert.match(html, /class="calendar-icon"/);
  assert.match(html, /Zet in Google Agenda/);
});
