const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('nav').classList.toggle('open',open);menu.setAttribute('aria-label',open?'Sluit menu':'Open menu')});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}));

const clubData={"checked":"2026-09-13","fixtures":[{"date":"2026-09-11","type":"beker","home":"Zenakalm","away":"De Zwaluw","score":{"home":11,"away":7},"url":"https://www.atc-tafelvoetbal.be/wedstrijden/2985","venue":"Cj's","address":"Alfons Schneiderlaan 237, 2100 Deurne"},{"date":"2026-09-18","type":"competitie","home":"NXT","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3008","venue":"Hanenberg","address":"Hodonk 63, 2470 Retie"},{"date":"2026-09-25","type":"competitie","home":"De Zwaluw","away":"BP Ratten","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3009","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2026-10-02","type":"competitie","home":"De Zwaluw","away":"Halverwegen","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3018","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2026-10-09","type":"beker","home":"De Zwaluw","away":"Zenakalm","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3557","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2026-10-16","type":"competitie","home":"Y&O","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3020","venue":"'t Klaverke","address":"Dorp 2, 2861 Sint-Katelijne-Waver"},{"date":"2026-10-23","type":"competitie","home":"De Zwaluw","away":"Peeke Binne","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3027","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2026-11-20","type":"competitie","home":"Paradijske ('t)","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3031","venue":"Paradijs","address":"Mechelbaan 725, 2580 Peulis (Putte)"},{"date":"2026-11-27","type":"competitie","home":"De Zwaluw","away":"Roadhouse","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3036","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2026-12-04","type":"competitie","home":"Foosforce","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3042","venue":"Ter Smisse","address":"Louis Van Regenmortellei 6, 2150 Borsbeek"},{"date":"2026-12-18","type":"competitie","home":"De Zwaluw","away":"Zenakalm","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3045","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-01-15","type":"competitie","home":"De Zwaluw","away":"NXT","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3053","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-01-22","type":"competitie","home":"BP Ratten","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3054","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-01-29","type":"competitie","home":"Halverwegen","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3063","venue":"Wranglers Roadhouse","address":"Liersesteenweg 17, 2221 Booischot"},{"date":"2027-02-19","type":"competitie","home":"De Zwaluw","away":"Y&O","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3065","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-02-26","type":"competitie","home":"Peeke Binne","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3072","venue":"Jake's Place","address":"Boskant 10, 2260 Westerlo"},{"date":"2027-03-19","type":"competitie","home":"De Zwaluw","away":"Paradijske ('t)","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3076","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-03-26","type":"competitie","home":"Roadhouse","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3081","venue":"Wranglers Roadhouse","address":"Liersesteenweg 17, 2221 Booischot"},{"date":"2027-04-16","type":"competitie","home":"De Zwaluw","away":"Foosforce","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3087","venue":"Café De Zwaluw","address":"Molenstraat 47, 2550 Kontich"},{"date":"2027-04-23","type":"competitie","home":"Zenakalm","away":"De Zwaluw","score":null,"url":"https://www.atc-tafelvoetbal.be/wedstrijden/3090","venue":"Cj's","address":"Alfons Schneiderlaan 237, 2100 Deurne"}],"players":[{"name":"P. De Bie","member":"A7827","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/201","display":"Peter De Bie","points":0,"photo":"assets/players/peter-de-bie.png","crown":"assets/players/peter-de-bie-kroon.png","played":true,"games":1},{"name":"T. Choi","member":"A4005","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/139","display":"Tseng-sing Choi","points":0,"photo":"assets/players/tseng-sing-choi.png","crown":"assets/players/tseng-sing-choi-kroon.png","played":true,"games":1},{"name":"K. Lesaffre","member":"A5391","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/554","display":"Kristof Lesaffre","points":5,"photo":"assets/players/kristof-lesaffre.png","crown":"assets/players/kristof-lesaffre-kroon.png","played":true,"games":1},{"name":"J. Peeters","member":"A4670","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/759","display":"Jeroen Peeters","points":5,"photo":"assets/players/jeroen-peeters.png","crown":"assets/players/jeroen-peeters-kroon.png","played":true,"games":1},{"name":"G. Jacobs","member":"A5414","ranking":"1P","url":"https://www.atc-tafelvoetbal.be/players/483","display":"Gregory Jacobs","points":2,"photo":"assets/players/gregory-jacobs.png","crown":"assets/players/gregory-jacobs-kroon.png","played":true,"games":1},{"name":"P. Godefroy","member":"A8102","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/403","display":"Paul Godefroy","points":2,"photo":"assets/players/paul-godefroy.png","crown":"assets/players/paul-godefroy-kroon.png","played":true,"games":1},{"name":"D. Loos","member":"A7958","ranking":"1P","url":"https://www.atc-tafelvoetbal.be/players/569","display":"David Loos","points":0,"photo":"assets/players/david-loos.png","crown":"assets/players/david-loos-kroon.png","played":false,"games":0},{"name":"D. De Bie","member":"A7826","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/200","display":"D. De Bie","points":0,"photo":"","crown":"","played":false,"games":0},{"name":"E. Staepelaere","member":"A5390","ranking":"3P","url":"https://www.atc-tafelvoetbal.be/players/937","display":"Eric Staepelaere","points":0,"photo":"assets/players/eric-staepelaere.png","crown":"","played":false,"games":0},{"name":"F. Verhenne","member":"A5392","ranking":"2P","url":"https://www.atc-tafelvoetbal.be/players/1608","display":"Fabian Verhenne","points":0,"photo":"assets/players/fabian-verhenne.png","crown":"assets/players/fabian-verhenne-kroon.png","played":false,"games":0},{"name":"D. Van Mol","member":"A4948","ranking":"3P","url":"https://www.atc-tafelvoetbal.be/players/1352","display":"Dave Van Mol","points":0,"photo":"assets/players/dave-van-mol.png","crown":"assets/players/dave-van-mol-kroon.png","played":false,"games":0}],"standings":{"rows":[{"rank":1,"team":"BP Ratten","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 4e"},{"rank":2,"team":"Roadhouse","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 5e"},{"rank":3,"team":"Foosforce","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 1e"},{"rank":4,"team":"Zenakalm","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"2A · 1e"},{"rank":5,"team":"NXT","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"Nieuw"},{"rank":6,"team":"De Zwaluw","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 8e"},{"rank":7,"team":"Halverwegen","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 6e"},{"rank":8,"team":"Y&O","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"1A · 7e"},{"rank":9,"team":"Peeke Binne","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"2A · 4e"},{"rank":10,"team":"Paradijske ('t)","points":0,"played":0,"won":0,"drawn":0,"lost":0,"sets":0,"previous":"2A · 2e"}]},"other":[{"date":"2026-09-04","type":"Andere"},{"date":"2026-10-30","type":"Beker"},{"date":"2026-11-06","type":"Inhaaldag"},{"date":"2026-11-13","type":"Beker"},{"date":"2026-12-11","type":"Beker"},{"date":"2026-12-25","type":"Inhaaldag"},{"date":"2027-01-01","type":"Inhaaldag"},{"date":"2027-01-08","type":"Beker"},{"date":"2027-02-05","type":"Inhaaldag"},{"date":"2027-02-12","type":"Inhaaldag"},{"date":"2027-02-27","type":"Kampioenschappen"},{"date":"2027-02-28","type":"Kampioenschappen"},{"date":"2027-03-05","type":"Beker"},{"date":"2027-03-06","type":"Kampioenschappen"},{"date":"2027-03-07","type":"Kampioenschappen"},{"date":"2027-03-12","type":"Beker"},{"date":"2027-03-13","type":"Kampioenschappen"},{"date":"2027-03-14","type":"Kampioenschappen"},{"date":"2027-04-02","type":"Inhaaldag"},{"date":"2027-04-09","type":"Inhaaldag"},{"date":"2027-04-30","type":"Beker"},{"date":"2027-05-07","type":"Beker"},{"date":"2027-05-14","type":"Beker"},{"date":"2027-05-21","type":"Beker"},{"date":"2027-05-28","type":"Beker"},{"date":"2027-06-04","type":"Beker","note":"Finales"}],"previousSeason":{"season":"2025–2026","source":"https://www.atc-tafelvoetbal.be/competition/22","teams":{"Foosforce":{"division":"1A","rank":1,"label":"1A · 1e","note":"Winnaar Playoff 1"},"Roadhouse":{"division":"1A","rank":5,"label":"1A · 5e","note":"Winnaar Playoff 2"},"Halverwegen":{"division":"1A","rank":6,"label":"1A · 6e","note":"2e in Playoff 2"},"Y&O":{"division":"1A","rank":7,"label":"1A · 7e","note":"3e in Playoff 2"},"De Zwaluw":{"division":"1A","rank":8,"label":"1A · 8e","note":"4e in Playoff 2"},"Zenakalm":{"division":"2A","rank":1,"label":"2A · 1e","note":"Kampioen 2A, gepromoveerd"},"Paradijske ('t)":{"division":"2A","rank":2,"label":"2A · 2e","note":"Gepromoveerd uit 2A"},"Peeke Binne":{"division":"2A","rank":4,"label":"2A · 4e","note":"Gepromoveerd uit 2A"},"NXT":{"division":null,"rank":null,"label":"Nieuw","note":"Geen ATC-clubarchief in 2025"},"BP Ratten":{"division":"1A","rank":4,"label":"1A · 4e","formerName":"BP Stars","note":"Als BP Stars · 4e in Playoff 1"}}}};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cupIcon='<svg class="cup-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 3h10v1.8h2.2c.4 0 .8.4.8.8v1.7a4.3 4.3 0 0 1-3.2 4.1A4.8 4.8 0 0 1 13 14.1V16h2.5v2H8.5v-2H11v-1.9a4.8 4.8 0 0 1-3.8-2.7A4.3 4.3 0 0 1 4 7.3V5.6c0-.4.3-.8.8-.8H7V3zm1.8 1.8v2.6A3 3 0 0 0 12 10.3a3 3 0 0 0 3.2-2.9V4.8H8.8zM5.8 6.6v.7a2.5 2.5 0 0 0 1.5 2.2A4 4 0 0 1 5.8 6.6zm12.4 0a4 4 0 0 1-1.5 2.9 2.5 2.5 0 0 0 1.5-2.2v-.7zM6 20h12v1.8H6z"/></svg>';
const pinIcon='<svg class="pin-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
function cupLabel(){return `${cupIcon}BEKER VAN ATC`}
function routeLabel(label){return `${pinIcon}${label}`}
const months=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
const monthNames=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function formatChecked(iso){const [year,month,day]=iso.split('-');return `${Number(day)} ${monthNames[Number(month)-1]} ${year}`}
function scoreOf(f){return f.score&&Number.isFinite(f.score.home)&&Number.isFinite(f.score.away)?f.score:null}
function scoreLabel(s){return `${s.home} – ${s.away}`}
function ourResult(f){const s=scoreOf(f);if(!s)return '';const ours=f.home==='De Zwaluw'?s.home:s.away;const theirs=f.home==='De Zwaluw'?s.away:s.home;return ours>theirs?'win':ours<theirs?'loss':'draw'}
function isHome(f){return f.home==='De Zwaluw'}
function isPast(f){return Boolean(scoreOf(f))||f.date<today}
function isNotice(f){return f.type==='inhaaldag'||f.type==='kampioenschappen'||f.type==='andere'}
function isMatch(f){return (f.type==='competitie'||f.type==='beker')&&f.home&&f.away}
function opponentOf(f){return f.home==='De Zwaluw'?f.away:f.home}
function previousSeasonInfo(team){const info=clubData.previousSeason&&clubData.previousSeason.teams&&clubData.previousSeason.teams[team];return info&&typeof info==='object'?info:null}
function previousSeasonLabel(team,{short=false}={}){const info=previousSeasonInfo(team);if(!info||!info.label)return '';if(short)return info.label;if(info.formerName)return `${info.label} · als ${info.formerName}`;return info.label}
function previousSeasonTitle(team){const info=previousSeasonInfo(team);if(!info)return 'Eindstand reguliere competitie seizoen 2025–2026';return info.note?`${info.note} (seizoen 2025–2026)`:`Eindstand seizoen 2025–2026: ${info.label}`}
function mapsUrl(f){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(f.address)}
const driveTowns={'2100':'Deurne','2150':'Borsbeek','2221':'Booischot','2260':'Westerlo','2470':'Retie','2550':'Kontich','2580':'Putte','2861':'Sint-Katelijne-Waver'};
const driveMinutes={'2100':25,'2150':25,'2221':35,'2260':50,'2470':60,'2550':15,'2580':15,'2861':15};
function postalOf(f){const m=String(f.address||'').match(/\b(\d{4})\b/);return m?m[1]:''}
function townOf(f){const code=postalOf(f);if(driveTowns[code])return driveTowns[code];const rest=String(f.address||'').match(/\d{4}\s+(.+)$/);return rest?rest[1].replace(/\s*\([^)]*\)\s*/g,'').trim():''}
function driveHint(f){if(isHome(f))return '';const town=townOf(f);const mins=driveMinutes[postalOf(f)];return town&&mins?`${town} · ±${mins} min`:''}
function driveFromMechelen(f){if(isHome(f))return '';const mins=driveMinutes[postalOf(f)];return mins?`±${mins} min vanuit Mechelen`:''}
function routeLink(f,label){return `<a class="route-link" href="${mapsUrl(f)}" target="_blank" rel="noopener" aria-label="Route naar ${escapeHTML(f.venue)}">${routeLabel(label)}</a>`}
function dateStamp(f){const [year,month,day]=f.date.split('-');return `<time class="fixture-date" datetime="${f.date}"><strong>${day}</strong><span>${months[Number(month)-1]} ${year}</span></time>`}
function calendarType(value){const type=String(value||'').toLowerCase();if(type==='beker')return 'beker';if(type==='inhaaldag')return 'inhaaldag';if(type==='kampioenschappen')return 'kampioenschappen';if(type==='competitie')return 'competitie';return 'andere'}
function calendarItems(){
 const matches=clubData.fixtures||[];
 const extras=(clubData.other||[]).filter(item=>{
  const type=calendarType(item.type);
  if(type==='beker'||type==='competitie')return !matches.some(f=>f.date===item.date&&f.type===type);
  return true;
 }).map(item=>{
  const type=calendarType(item.type);
  if(type==='beker')return {date:item.date,type:'beker',placeholder:true,note:item.note||''};
  return {date:item.date,type,note:item.note||''};
 });
 return [...matches,...extras].sort((a,b)=>a.date.localeCompare(b.date)||Number(isNotice(a))-Number(isNotice(b)));
}
function fixtureHTML(f,extraClass=''){const home=isHome(f);const past=isPast(f);const maps=mapsUrl(f);const score=scoreOf(f);const result=ourResult(f);const opponent=opponentOf(f);const prevShort=previousSeasonLabel(opponent,{short:true});const prevFull=previousSeasonLabel(opponent);const prevTitle=previousSeasonTitle(opponent);const middle=score?`<span class="score score-${result}">${scoreLabel(score)}</span>`:'<span class="vs">vs</span>';const status=score?`Volgens ATC-wedstrijdblad.`:`Nog geen uitslag bij controle op ${formatChecked(clubData.checked)}.`;const route=home?'':routeLink(f,'Route');const venueExtra=`<small>${score?scoreLabel(score):'22u'}</small>`;const drive=driveFromMechelen(f);const prevMeta=prevShort?`<span>·</span><span class="fixture-prev" title="${escapeHTML(prevTitle)}">VJ ${escapeHTML(prevShort)}</span>`:'';const facts=`<dl class="fixture-facts"><div><dt>Aanvang</dt><dd>22u</dd></div>${score?`<div><dt>Uitslag</dt><dd>${scoreLabel(score)}</dd></div>`:''}${prevFull?`<div><dt>Vorig seizoen</dt><dd title="${escapeHTML(prevTitle)}">${escapeHTML(prevFull)}</dd></div>`:''}${drive?`<div><dt>Rit</dt><dd class="drive-note">${escapeHTML(drive)}</dd></div>`:''}</dl>`;return `<details class="fixture${past?' past':''}${extraClass}"><summary>${dateStamp(f)}<div><div class="fixture-teams"><span class="${home?'ours':''}">${escapeHTML(f.home)}</span>${middle}<span class="${!home?'ours':''}">${escapeHTML(f.away)}</span></div><div class="fixture-meta"><span class="${f.type==='beker'?'cup-tag':'competition'}">${f.type==='beker'?cupLabel():'COMPETITIE · 1A'}</span><span>·</span><span>${home?'THUIS':'UIT'}</span>${prevMeta}${past?'<span class="played-tag">Gespeeld</span>':''}${route}</div></div><div class="venue">${escapeHTML(f.venue)}${venueExtra}</div><span class="fixture-toggle" aria-hidden="true">＋</span></summary><div class="fixture-detail"><div class="fixture-body"><div class="fixture-place"><p class="fixture-venue-name">${escapeHTML(f.venue)}</p><p class="fixture-address">${escapeHTML(f.address)}</p></div>${facts}<p class="fixture-status">${status}</p></div><div class="fixture-links">${home?'':`<a class="route-link" href="${maps}" target="_blank" rel="noopener">${routeLabel('Route')}</a>`}<a href="${f.url}" target="_blank" rel="noopener">Wedstrijdblad ATC ↗</a></div></div></details>`}
function placeholderHTML(f){const past=isPast(f);const finales=String(f.note||'').toLowerCase().includes('finale');const title=finales?'Finale':'Beker';const copy=finales?'Finale volgens de ATC-kalender. Tegenstander volgt zodra ATC die bekendmaakt.':'Tegenstander volgt. ATC heeft deze bekerdag nog niet ingevuld.';return `<div class="calendar-note is-beker${past?' past':''}">${dateStamp(f)}<div><p class="note-title">${cupIcon}${title}</p><p class="note-copy">${copy}</p></div></div>`}
function noticeHTML(f){const past=isPast(f);const copy=f.type==='inhaaldag'?{title:'Inhaaldag',text:'Geen wedstrijd. ATC houdt deze dag vrij voor inhaalwedstrijden.'}:f.type==='kampioenschappen'?{title:'Kampioenschappen',text:'Geen ploegwedstrijd van De Zwaluw.'}:{title:'Andere',text:'Geen ploegwedstrijd van De Zwaluw.'};return `<div class="calendar-note is-${f.type}${past?' past':''}">${dateStamp(f)}<div><p class="note-title">${copy.title}</p><p class="note-copy">${copy.text}</p></div></div>`}
function rowHTML(f,extraClass=''){if(isNotice(f))return noticeHTML(f);if(!isMatch(f))return placeholderHTML(f);return fixtureHTML(f,extraClass)}
function bindRouteLinks(root){root.querySelectorAll('.route-link').forEach(link=>{['click','pointerdown'].forEach(type=>link.addEventListener(type,event=>event.stopPropagation()))})}
function bindFixtureAccordion(root){root.querySelectorAll('details.fixture').forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;root.querySelectorAll('details.fixture[open]').forEach(other=>{if(other!==item)other.open=false})}))}
function panelHTML(list,empty,extra){const rows=list.length?list.map(f=>rowHTML(f,extra&&extra(f)||'')).join(''):`<p class="empty">${empty}</p>`;return `<div class="calendar-caption"><span>DATUM / WEDSTRIJD</span><span>LOCATIE</span></div>${rows}`}
function resultCountLabel(tab,n){
 if(tab==='upcoming')return n===1?'wedstrijd nog te spelen':'wedstrijden nog te spelen';
 if(tab==='played')return n===1?'gespeelde wedstrijd':'gespeelde wedstrijden';
 if(tab==='aanwezigheid')return n===1?'speler in de aanwezigheid':'spelers in de aanwezigheid';
 return 'spelers in het klassement';
}
function klassementPin(p){return p.member==='A7826'?2:p.member==='A5390'?1:0}
function gamesPlayed(p){const n=Number(p.games);return Number.isFinite(n)&&n>=0?n:p.played?1:0}
function gamesLabel(n){return n===1?'1 wedstrijd gespeeld':`${n} wedstrijden gespeeld`}
function attendanceLabel(n){return n===1?'1 aanwezigheid':`${n} aanwezigheden`}
function byName(a,b){return String(a.display||a.name).localeCompare(b.display||b.name,'nl')}
function rankedPlayers(){
 return [...clubData.players].sort((a,b)=>{
  const pin=klassementPin(a)-klassementPin(b);
  if(pin)return pin;
  const points=(Number(b.points)||0)-(Number(a.points)||0);
  if(points)return points;
  const played=Number(Boolean(b.played))-Number(Boolean(a.played));
  if(played)return played;
  return byName(a,b);
 });
}
function rankedByAttendance(){
 return [...clubData.players].sort((a,b)=>{
  const pin=klassementPin(a)-klassementPin(b);
  if(pin)return pin;
  const games=gamesPlayed(b)-gamesPlayed(a);
  if(games)return games;
  return byName(a,b);
 });
}
function playerRowHTML(p,{rank,lead,subtitle,score,unit}){
 const photo=lead&&p.crown?p.crown:p.photo;
 const name=escapeHTML(p.display||p.name);
 const image=photo?`<img class="klassement-photo" src="${photo}" width="160" height="160" alt="${name}"${lead?'':' loading="lazy"'}>`:`<span class="klassement-photo is-empty" aria-hidden="true">${escapeHTML((p.display||p.name).split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`;
 return `<li class="klassement-row${lead?' is-lead':''}"><span class="klassement-rank">${String(rank).padStart(2,'0')}</span>${image}<span class="klassement-player"><span class="klassement-name">${name}</span><span class="klassement-games">${subtitle}</span></span><span class="klassement-points">${score} <small>${unit}</small></span></li>`;
}
function klassementHTML(){
 const rows=rankedPlayers();
 const top=Math.max(0,...rows.map(p=>Number(p.points)||0));
 let lastKey=null,lastRank=0;
 return `<ol class="klassement">${rows.map((p,i)=>{
  const points=Number(p.points)||0;
  const key=klassementPin(p)+':'+points+':'+(p.played?1:0);
  const rank=key===lastKey?lastRank:i+1;
  lastKey=key;lastRank=rank;
  return playerRowHTML(p,{rank,lead:points===top&&top>0,subtitle:gamesLabel(gamesPlayed(p)),score:points,unit:'pt'});
 }).join('')}</ol>`;
}
function aanwezigheidHTML(){
 const rows=rankedByAttendance();
 const top=Math.max(0,...rows.map(gamesPlayed));
 let lastKey=null,lastRank=0;
 return `<ol class="klassement aanwezigheid">${rows.map((p,i)=>{
  const games=gamesPlayed(p);
  const key=klassementPin(p)+':'+games;
  const rank=key===lastKey?lastRank:i+1;
  lastKey=key;lastRank=rank;
  return playerRowHTML(p,{rank,lead:games===top&&top>0,subtitle:attendanceLabel(games),score:games,unit:'aanw'});
 }).join('')}</ol>`;
}
function selectCalendarTab(root,name){
 const tabs=[...root.querySelectorAll('[role="tab"]')];
 if(!tabs.length)return;
 tabs.forEach(tab=>{
  const on=tab.dataset.tab===name;
  tab.setAttribute('aria-selected',String(on));
  tab.tabIndex=on?0:-1;
  const panel=root.querySelector('#'+tab.getAttribute('aria-controls'));
  if(panel)panel.hidden=!on;
 });
 const active=tabs.find(tab=>tab.dataset.tab===name)||tabs[0];
 const n=Number(active.dataset.count||0);
 const count=document.querySelector('#result-count');
 if(count)count.textContent=`${n} ${resultCountLabel(active.dataset.tab,n)} · Seizoen 2026–2027`;
}
function bindCalendarTabs(root){
 const tabs=[...root.querySelectorAll('[role="tab"]')];
 tabs.forEach(tab=>{
  tab.addEventListener('click',()=>selectCalendarTab(root,tab.dataset.tab));
  tab.addEventListener('keydown',event=>{
   const keys={ArrowRight:1,ArrowLeft:-1,Home:'start',End:'end'};
   const move=keys[event.key];
   if(move==null)return;
   event.preventDefault();
   const next=move==='start'?tabs[0]:move==='end'?tabs[tabs.length-1]:tabs[(tabs.indexOf(tab)+move+tabs.length)%tabs.length];
   next.focus();
   selectCalendarTab(root,next.dataset.tab);
  });
 });
}
function renderFixtures(){
 const items=calendarItems();
 const past=items.filter(isPast);
 const upcoming=items.filter(f=>!isPast(f));
 const playableUpcoming=upcoming.filter(f=>!isNotice(f));
 const playablePast=past.filter(isMatch);
 const nextUp=playableUpcoming.find(isMatch);
 const root=document.querySelector('#fixtures');
 root.innerHTML=`<div class="calendar-tabs" role="tablist" aria-label="Wedstrijden, klassement en aanwezigheid"><button type="button" role="tab" id="tab-upcoming" data-tab="upcoming" data-count="${playableUpcoming.length}" aria-selected="true" aria-controls="panel-upcoming" tabindex="0">Nog te spelen <span>${playableUpcoming.length}</span></button><button type="button" role="tab" id="tab-played" data-tab="played" data-count="${playablePast.length}" aria-selected="false" aria-controls="panel-played" tabindex="-1">Gespeeld <span>${playablePast.length}</span></button><button type="button" role="tab" id="tab-klassement" data-tab="klassement" data-count="${clubData.players.length}" aria-selected="false" aria-controls="klassement" tabindex="-1">Klassement</button><button type="button" role="tab" id="tab-aanwezigheid" data-tab="aanwezigheid" data-count="${clubData.players.length}" aria-selected="false" aria-controls="aanwezigheid" tabindex="-1">Aanwezigheid</button></div><div id="panel-upcoming" class="calendar-panel" role="tabpanel" aria-labelledby="tab-upcoming">${panelHTML(upcoming,'Geen wedstrijden meer te spelen in deze kalender.',f=>f===nextUp?' next':'')}</div><div id="panel-played" class="calendar-panel" role="tabpanel" hidden aria-labelledby="tab-played">${panelHTML(past,'Nog geen gespeelde wedstrijden in deze kalender.')}</div><div id="klassement" class="calendar-panel" role="tabpanel" hidden aria-labelledby="tab-klassement">${klassementHTML()}</div><div id="aanwezigheid" class="calendar-panel" role="tabpanel" hidden aria-labelledby="tab-aanwezigheid">${aanwezigheidHTML()}</div>`;
 const count=document.querySelector('#result-count');
 if(count)count.textContent=`${playableUpcoming.length} ${resultCountLabel('upcoming',playableUpcoming.length)} · Seizoen 2026–2027`;
 const hash=typeof location!=='undefined'?location.hash:'';
 const start=hash==='#klassement'?'klassement':hash==='#aanwezigheid'?'aanwezigheid':'upcoming';
 selectCalendarTab(root,start);
 bindRouteLinks(root);
 bindFixtureAccordion(root);
 bindCalendarTabs(root);
}
renderFixtures();
function renderStandings(){
 const rows=clubData.standings&&clubData.standings.rows;
 const box=document.querySelector('.standings-section .table-area');
 const note=document.querySelector('.standings-section .source-note');
 if(!rows||!rows.length||!box)return;
 const date=formatChecked(clubData.checked);
 const played=rows.some(row=>Number(row.played)>0);
 if(note)note.innerHTML=`Stand op ${date}.<br>${played?'':'Nog geen competitiewedstrijden gespeeld.<br>'}De volgorde volgt ATC.<br>Grijs label = eindstand vorig seizoen (2025–2026).`;
 box.innerHTML=`<table><caption class="sr-only">Stand ATC reeks 1A, ${date}</caption><thead><tr><th scope="col">#</th><th scope="col">TEAM</th><th scope="col"><abbr title="Gespeeld">GS</abbr></th><th scope="col"><abbr title="Gewonnen">W</abbr></th><th scope="col"><abbr title="Gelijk">G</abbr></th><th scope="col"><abbr title="Verloren">V</abbr></th><th scope="col">SETS</th></tr></thead><tbody>${rows.map(row=>{const ours=row.team==='De Zwaluw';const prev=row.previous?` <span class="prev-season" title="Eindstand reguliere competitie seizoen 2025–2026">${escapeHTML(row.previous)}</span>`:'';return `<tr class="${ours?'our-team':''}"><td>${String(row.rank).padStart(2,'0')}</td><th scope="row">${ours?'De Zwaluw <span>WIJ</span>':escapeHTML(row.team)}${prev}</th><td>${Number(row.played)||0}</td><td>${Number(row.won)||0}</td><td>${Number(row.drawn)||0}</td><td>${Number(row.lost)||0}</td><td>${Number(row.sets)||0}</td></tr>`}).join('')}</tbody></table>`;
}
renderStandings();
window.addEventListener('hashchange',()=>{const root=document.querySelector('#fixtures');if(!root)return;if(location.hash==='#klassement')selectCalendarTab(root,'klassement');if(location.hash==='#aanwezigheid')selectCalendarTab(root,'aanwezigheid')});
document.querySelectorAll('.cup-match').forEach(card=>{const fixture=clubData.fixtures.find(f=>f.url===card.href);const score=fixture&&scoreOf(fixture);if(!score)return;const heading=card.querySelector('h3');if(heading)heading.innerHTML=`${escapeHTML(fixture.home)} <span class="cup-score score-${ourResult(fixture)}">${scoreLabel(score)}</span> ${escapeHTML(fixture.away)}`});
const next=clubData.fixtures.find(f=>!scoreOf(f)&&f.date>=today)||clubData.fixtures.find(f=>f.date>=today);
if(next){const [year,month,day]=next.date.split('-');const away=!isHome(next);const opponent=opponentOf(next);const prevFull=previousSeasonLabel(opponent);document.querySelector('.match-label p').innerHTML=(next.type==='beker'?cupLabel():'COMPETITIE · 1A')+' <span>'+(away?'UIT':'THUIS')+'</span>';document.querySelector('.next-teams').innerHTML=`${isHome(next)?'<strong>De Zwaluw</strong>':escapeHTML(next.home)} <span>vs</span> ${!isHome(next)?'<strong>De Zwaluw</strong>':escapeHTML(next.away)}`;const prevEl=document.querySelector('.next-prev-season');if(prevEl){if(prevFull){prevEl.hidden=false;prevEl.innerHTML=`Vorig seizoen: <strong>${escapeHTML(prevFull)}</strong>`;prevEl.title=previousSeasonTitle(opponent)}else{prevEl.hidden=true;prevEl.textContent='';prevEl.removeAttribute('title')}}document.querySelector('.next-date').innerHTML=`<strong>${day} ${months[Number(month)-1].toUpperCase()}</strong><span>Vrijdag · ${year}</span>`;const nextLink=document.querySelector('.next-match .round-link');if(away){const hint=driveHint(next);nextLink.href=mapsUrl(next);nextLink.classList.add('is-route');nextLink.innerHTML=`<span class="route-main">${routeLabel('Route')}</span>${hint?`<span class="route-drive">${escapeHTML(hint)} vanuit Mechelen</span>`:''}`;nextLink.setAttribute('aria-label',hint?`Route naar ${next.venue}, ${hint} vanuit Mechelen`:`Route naar ${next.venue}`)}else{nextLink.href=next.url;nextLink.classList.remove('is-route');nextLink.textContent='↗';nextLink.setAttribute('aria-label',`${next.home} tegen ${next.away} op ATC`)}}else{document.querySelector('.next-match').innerHTML='<div><p class="eyebrow">SEIZOEN 2026–2027</p><p>Geen latere bevestigde wedstrijd in deze kalender. <a class="text-link" href="https://www.atc-tafelvoetbal.be/clubs/186" target="_blank" rel="noopener">Bekijk ATC voor nieuwe data ↗</a></p></div>'}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let motionEnabled=!reduced.matches;
const motionButton=document.createElement('button');motionButton.className='motion-control';document.querySelector('footer').append(motionButton);
function motionState(){document.documentElement.classList.toggle('no-motion',!motionEnabled);motionButton.textContent=motionEnabled?'Beweging aan':'Beweging uit';motionButton.setAttribute('aria-label',motionEnabled?'Animaties uitschakelen':'Animaties inschakelen');motionButton.setAttribute('aria-pressed',String(motionEnabled))}motionState();motionButton.addEventListener('click',()=>{motionEnabled=!motionEnabled;motionState()});reduced.addEventListener('change',e=>{motionEnabled=!e.matches;motionState()});
const hero=document.querySelector('.hero'),bird=document.querySelector('.hero-art img');
hero.addEventListener('pointermove',e=>{if(!motionEnabled||e.pointerType!=='mouse')return;const rect=hero.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;bird.style.transform=`translate(${x*26}px,${y*22}px) rotate(${x*1.8}deg) scale(1.015)`});hero.addEventListener('pointerleave',()=>{bird.style.transform='none'});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(motionEnabled)entry.target.classList.add('reveal');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.section-title,.cup-intro,.cup-fixtures,.standings-intro,.team-heading,.home-name,.home-address').forEach(el=>observer.observe(el));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}});
if(typeof history!=='undefined'&&'scrollRestoration' in history)history.scrollRestoration='manual';
function startAtTop(){if(typeof location!=='undefined'&&location.hash)return;const top=()=>{if(window.scrollTo)window.scrollTo(0,0);if(document.documentElement)document.documentElement.scrollTop=0;if(document.body)document.body.scrollTop=0};top();if(typeof requestAnimationFrame==='function')requestAnimationFrame(top)}
startAtTop();
window.addEventListener('pageshow',startAtTop);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
