#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const PRODID = '-//De Zwaluw//Kalender 2026-2027//NL';
const CALNAME = 'De Zwaluw';

function lastSunday(year, monthIndex) {
  const date = new Date(Date.UTC(year, monthIndex + 1, 0));
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date;
}

function brusselsOffsetMinutes(date) {
  const [year, month, day] = date.split('-').map(Number);
  const utc = Date.UTC(year, month - 1, day, 12);
  const start = lastSunday(year, 2).getTime();
  const end = lastSunday(year, 9).getTime();
  return utc >= start && utc < end ? 120 : 60;
}

function utcStamp(date, hour, minute, offsetMinutes) {
  const [year, month, day] = date.split('-').map(Number);
  const utc = Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60 * 1000;
  const iso = new Date(utc).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return iso;
}

function nextDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return next.toISOString().slice(0, 10);
}

function escapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function foldLine(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(bytes.length, start + limit);
    while (end > start && (bytes[end] & 0xc0) === 0x80) end -= 1;
    if (end > start && bytes[end - 1] === 0x5c) end -= 1;
    if (end === start) end = Math.min(bytes.length, start + limit);
    parts.push(bytes.slice(start, end).toString('utf8'));
    start = end;
    limit = 74;
  }
  return parts.join('\r\n ');
}

function matchUid(fixture) {
  const id = String(fixture.url || '').match(/\/wedstrijden\/(\d+)/);
  return `zwaluw-${id ? id[1] : fixture.date}@dezwaluw-pi.vercel.app`;
}

function isMatch(fixture) {
  return (fixture.type === 'competitie' || fixture.type === 'beker') && fixture.home && fixture.away;
}

function summaryOf(fixture) {
  const side = fixture.home === 'De Zwaluw' ? 'thuis' : 'uit';
  const kind = fixture.type === 'beker' ? 'Beker' : 'Competitie 1A';
  return `${kind} · ${side} · ${fixture.home} vs ${fixture.away}`;
}

function descriptionOf(fixture) {
  const lines = [
    fixture.type === 'beker' ? 'Beker van ATC' : 'Competitie ATC reeks 1A',
    `Aanvang 22u · ${fixture.venue}`,
    fixture.address
  ];
  if (fixture.score && Number.isFinite(fixture.score.home) && Number.isFinite(fixture.score.away)) {
    lines.push(`Uitslag ${fixture.score.home}–${fixture.score.away}`);
  }
  if (fixture.url) lines.push(fixture.url);
  lines.push('Volgens de kalender van De Zwaluw. Controleer ATC bij wijzigingen.');
  return lines.join('\n');
}

function vevent(fixture, now) {
  const offsetStart = brusselsOffsetMinutes(fixture.date);
  const endDate = nextDate(fixture.date);
  const offsetEnd = brusselsOffsetMinutes(endDate);
  const lines = [
    'BEGIN:VEVENT',
    `UID:${matchUid(fixture)}`,
    `DTSTAMP:${now}`,
    `DTSTART:${utcStamp(fixture.date, 22, 0, offsetStart)}`,
    `DTEND:${utcStamp(endDate, 0, 0, offsetEnd)}`,
    `SUMMARY:${escapeText(summaryOf(fixture))}`,
    `LOCATION:${escapeText([fixture.venue, fixture.address].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${escapeText(descriptionOf(fixture))}`
  ];
  if (fixture.url) lines.push(`URL:${fixture.url}`);
  lines.push('END:VEVENT');
  return lines.map(foldLine).join('\r\n');
}

function buildIcs(data, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const events = (data.fixtures || []).filter(isMatch).map((fixture) => vevent(fixture, stamp));
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${CALNAME}`,
    'X-WR-TIMEZONE:Europe/Brussels',
    ...events,
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

function writeCalendar(root = path.join(__dirname, '..')) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'dist', 'data.json'), 'utf8'));
  const dest = path.join(root, 'dist', 'de-zwaluw.ics');
  fs.writeFileSync(dest, buildIcs(data));
  return dest;
}

if (require.main === module) writeCalendar();

module.exports = { buildIcs, writeCalendar, isMatch, brusselsOffsetMinutes, utcStamp };
