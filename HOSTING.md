# Hosting — De Zwaluw

Gebruik **alleen** deze GitHub-repo en dit Vercel-project voor deploys. Maak geen nieuwe repo of nieuw Vercel-project aan.

## GitHub

- Repo: https://github.com/kristoflesaffre/dezwaluw
- Remote: `https://github.com/kristoflesaffre/dezwaluw.git`
- Owner: `kristoflesaffre`
- Default branch: `main`

Push naar `main` is de normale manier om te publiceren.

**Altijd publiceren.** Na elke sitewijziging: committen, naar `origin/main` pushen, en controleren dat Vercel de productie-deploy start. Niet vragen of het naar GitHub of Vercel mag; de eigenaar wil dat steeds.

## Vercel

- Team: `lesaffrekristof-4863s-projects` (`lesaffrekristof-4863's projects`)
- Team-ID: `team_j7Yc4GJ9yM31YPHGRaqGV9mK`
- Projectnaam: `dezwaluw`
- Dashboard: https://vercel.com/lesaffrekristof-4863s-projects/dezwaluw
- Productie-URL: https://dezwaluw-pi.vercel.app
- Team-alias: https://dezwaluw-lesaffrekristof-4863s-projects.vercel.app

Het project is gekoppeld aan de GitHub-repo hierboven. Een push naar `main` triggert automatisch een productie-deploy.

Statische site: Vercel serveert `dist/` (`vercel.json` → `outputDirectory: "dist"`). Geen buildstap, geen framework.

CLI (al gelinkt lokaal):

```bash
vercel deploy --prod --scope lesaffrekristof-4863s-projects
```

## Niet publiceren via

- **ChatGPT Sites** — oude host. Koppeling staat in `.openai/hosting.json` (`project_id`: `appgprj_6aa4336274c08191949a443593cdd130`). Cursor/andere IDE's kunnen daar niet deployen; alleen ChatGPT (chatgpt.com/sites).
- **v0-chat** — https://v0.app/lesaffrekristof-4863s-projects/chat/dezwaluw-wTp0KQzxUvr zit op hetzelfde Vercel-team, maar is geen publicatiekanaal. De live site is het Vercel-project `dezwaluw`.

## Lokale bron

- Map: `~/Downloads/de-zwaluw`
- Publieke files: `dist/index.html` en de rest van `dist/`
- PWA-icoon: de zwaluw in `dist/assets/icon-192.png`, `icon-512.png` en `apple-touch-icon.png`
- Uitslagen: `node scripts/update-scores.cjs` leest ATC-wedstrijdbladen (`/wedstrijden/{id}`) en schrijft scores naar `dist/data.json` + `dist/app.js`
