# De Zwaluw

Static club website for ATC 1A, season 2026–2027.

Data verified 2026-09-11 from:
- https://www.atc-tafelvoetbal.be/clubs/186
- https://www.atc-tafelvoetbal.be/competition/35
- https://www.atc-tafelvoetbal.be/calendar
- Each linked match detail page (venues).

Scores for played matches come from the official ATC match pages (`<span class="score">` on `/wedstrijden/{id}`). Run `node scripts/update-scores.cjs` after a match day. That script fetches only fixtures dated today or earlier, writes `dist/data.json`, and keeps the embedded `clubData` in `dist/app.js` in sync. Do not invent scores, kick-off times, or cup qualification from general cup dates.

No other automatic data synchronization. Player list and standings stay in `index.html` until they are updated from ATC separately.

Generated swallow and Belgian wooden foosball imagery. Local fonts: Barlow Condensed and Manrope.

Responsive calendar filters, expandable match details, full season, cup reservations, player links, standings, directions. CSS scroll parallax, pointer-responsive hero, entry animation, reduced-motion support and an animation toggle.

Plain static hosting: dist/index.html. No build step.

Installable as a PWA. The swallow logo is the app icon (`dist/manifest.webmanifest` plus `dist/assets/icon-*.png` and `apple-touch-icon.png`).

GitHub- en Vercel-project: zie [HOSTING.md](HOSTING.md). Niet een nieuwe repo of een nieuw Vercel-project aanmaken.

## Team portraits

Ten user-supplied portraits are stored in `dist/assets/players/` and linked to their ATC member IDs in the static gallery. D. De Bie remains listed without a photo. The gallery applies a cool monochrome treatment in CSS; the full-screen dialog displays each complete supplied photo in its original colours. Original Downloads files are untouched.

`gallery.js` handles modal navigation, keyboard controls, touch swipes, focus restoration, image error fallback and optional browser fullscreen. `gallery.css` includes mobile layouts and reduced-motion support. Run `node --test tests/gallery.test.cjs` for asset mapping and interaction logic checks. Native browser rendering is not covered by these tests.
