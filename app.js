(() => {
'use strict';

const D = window.SHAUNVERSE_DATA;
const app = document.getElementById('app');
const VERSION = '0.2.0';
const KEYS = {
  custom: 'sv_custom_v2',
  audible: 'sv_audible_imports_v2',
  personal: 'sv_personal_v2',
  recs: 'sv_rec_status_v2',
  movieMeta: 'sv_movie_meta_v2'
};

const S = { tab:'home', q:'', bookFilter:'All', movieGenre:'All', recSub:'All', recView:'Active' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const load = (k, fallback) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; } catch { return fallback; } };
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const normalize = s => String(s||'').toLowerCase().replace(/11[\/-]22[\/-]63/g,'11 22 63').replace(/[^a-z0-9]+/g,' ').trim();
const entityKey = x => `${x.type||'book'}:${x.id || normalize(x.title)}`;
const personal = () => load(KEYS.personal, {});
const recState = () => load(KEYS.recs, {});
const movieMeta = () => load(KEYS.movieMeta, {});
const customBooks = () => load(KEYS.custom, []);
const audibleImports = () => load(KEYS.audible, []);
const allBooks = () => {
  const map = new Map(D.books.map(b => [String(b.id), b]));
  audibleImports().forEach(b => map.set(String(b.id), b));
  customBooks().forEach(b => map.set(String(b.id), b));
  return [...map.values()];
};
const pFor = x => personal()[entityKey(x)] || {};
const displayRating = x => pFor(x).rating ?? x.rating ?? null;
const displayFinished = x => pFor(x).status === 'Finished' ? true : (pFor(x).status === 'Reading / Listening' ? false : !!x.finished);

function initials(t){ return esc((t||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()); }
function bookCover(x){ return x.cover ? `<img loading="lazy" src="${esc(x.cover)}" alt="" onerror="this.remove()">` : initials(x.title); }
function matches(x){
  const q=S.q.trim().toLowerCase(); if(!q) return true;
  return [x.title,x.subtitle,x.author,x.narrator,x.series,x.genres,x.director,x.genre,x.collection,x.subgenre].some(v=>String(v||'').toLowerCase().includes(q));
}

function recSubgenre(r){
  const text = `${r.genre||''} ${r.why||''} ${r.title||''}`.toLowerCase();
  if(/immortal|longevity|deep time|centur|millennia|repeated lives/.test(text)) return 'Immortality & Longevity';
  if(/time travel|timeline|chronology|future|past|temporal|repeating/.test(text)) return 'Time Travel';
  if(/archaeolog|ruins|ancient alien|vanished|corpse.*moon/.test(text)) return 'Cosmic Archaeology';
  if(/first contact|alien|nonhuman|civilization|neutron star/.test(text)) return 'Aliens & First Contact';
  if(/ai|artificial|consciousness|digital|upload|backed-up|robot/.test(text)) return 'AI & Consciousness';
  if(/apocalyp|collapse|survival|dystop|extinction/.test(text)) return 'Apocalypse & Collapse';
  if(/biotech|genetic|hidden|vampire|supernatural|horror/.test(text)) return 'Biotech & Hidden Societies';
  if(/hard.sf|engineering|asteroid|space opera|galactic|solar system/.test(text)) return 'Space Opera & Hard SF';
  return r.genre || 'Other';
}
function recKey(r){ return normalize(`${r.title}|${r.author}`); }
function recStatus(r){ const st=recState()[recKey(r)]?.status; if(st) return st; if(r.finished) return 'Finished'; if(r.owned) return 'Owned'; return 'Recommended'; }
function recIsActive(r){ return !['Finished','DNF'].includes(recStatus(r)); }

function shell(content){
  app.innerHTML = `<header class="top">
    <div class="brand" id="brandEgg"><img src="icon-192.png" alt=""><div><h1>SHAUNVERSE</h1><div class="tag">YOUR UNIVERSE. ORGANIZED.</div></div></div>
    <input class="search" placeholder="Search your universe…" value="${esc(S.q)}">
  </header>
  <main class="content">${content}</main>
  <nav class="nav">${[['home','⌂','Home'],['books','🎧','Books'],['movies','🎬','Movies'],['recs','✦','For You'],['add','＋','Add']].map(([t,i,l])=>`<button data-tab="${t}" class="${S.tab===t?'active':''}"><i>${i}</i>${l}</button>`).join('')}</nav>`;
  document.querySelector('.search').oninput=e=>{ S.q=e.target.value; renderBody(); };
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;S.q='';render();});
  bindItems(); bindEgg();
}

function bookCard(x){
  const rating=displayRating(x); const status=pFor(x).status || (displayFinished(x)?'Finished':x.format||'Book');
  return `<article class="item" data-id="${esc(x.id)}" data-kind="book"><div class="cover">${bookCover(x)}</div><div class="item-body"><h4>${esc(x.title)}</h4><div class="meta">${esc(x.author||'')}${x.series?'<br>'+esc(x.series):''}</div>${rating!=null?`<div class="rating">★ ${esc(rating)}/10</div>`:''}<span class="badge">${esc(status)}</span></div></article>`;
}
function movieCard(x){
  const k=normalize(x.title), meta=movieMeta()[k]||{}; const rating=displayRating({...x,type:'movie',id:k});
  return `<article class="item movie-item" data-id="${esc(k)}" data-kind="movie" data-movie-title="${esc(x.title)}"><div class="cover movie-cover">${meta.artwork?`<img loading="lazy" src="${esc(meta.artwork)}" alt="">`:`<div class="movie-placeholder">${initials(x.title)}</div>`}</div><div class="item-body"><h4>${esc(x.title)}</h4><div class="meta">${esc(x.director||'')}</div>${rating!=null?`<div class="rating">★ ${esc(rating)}/10</div>`:''}<span class="badge">${esc(x.genre||'Movie')}</span></div></article>`;
}

function home(){
  const books=allBooks();
  const recs=D.recommendations.filter(recIsActive).sort((a,b)=>(b.spock||0)-(a.spock||0)).slice(0,8);
  const recent=[...books].filter(matches).slice(-10).reverse();
  const movieShelf=D.movies.filter(m=>/sci-fi/i.test(m.genre)).slice(0,8);
  const finished=books.filter(displayFinished).length;
  return `<section class="hero"><h2>Welcome back, Shaun.</h2><div class="muted">All your worlds. One universe.</div><div class="stats"><div class="stat"><b>${books.length}</b><span>Books</span></div><div class="stat"><b>${D.movies.length}</b><span>Movies</span></div><div class="stat"><b>${D.recommendations.filter(recIsActive).length}</b><span>Active Recs</span></div><div class="stat"><b>${finished}</b><span>Finished Books</span></div></div></section>
  <section class="section"><div class="section-head"><h3>What should I listen to next?</h3><button class="pill" data-go="recs">See all</button></div><div class="cards">${recs.map(r=>recMini(r)).join('')}</div></section>
  <section class="section"><div class="section-head"><h3>Recent Audible</h3><button class="pill" data-go="books">Library</button></div><div class="grid">${recent.slice(0,6).map(bookCard).join('')}</div></section>
  <section class="section"><div class="section-head"><h3>Sci-Fi movie shelf</h3><button class="pill" data-go="movies">Movies</button></div><div class="grid">${movieShelf.slice(0,6).map(movieCard).join('')}</div></section>`;
}
function recMini(r){
  return `<div class="rec" data-rec="${esc(recKey(r))}"><div class="score">SPOCK ${r.spock}/10</div><h4>${esc(r.title)}</h4><div class="muted">${esc(r.author)}</div><p>${esc(r.why)}</p><div class="badge-row"><span class="badge">${esc(recSubgenre(r))}</span><span class="badge status">${esc(recStatus(r))}</span></div></div>`;
}

function booksView(){
  const all=allBooks().filter(matches);
  const filters=['All','Unread','Finished','Audible','Physical','Kindle','Favorites'];
  let filtered=all;
  if(S.bookFilter==='Unread') filtered=all.filter(b=>!displayFinished(b));
  else if(S.bookFilter==='Finished') filtered=all.filter(displayFinished);
  else if(['Audible','Physical','Kindle'].includes(S.bookFilter)) filtered=all.filter(b=>b.format===S.bookFilter);
  else if(S.bookFilter==='Favorites') filtered=all.filter(b=>pFor(b).favorite);
  return `<div class="section-head"><h3>Books <span class="muted">${filtered.length}</span></h3></div><div class="toolbar">${filters.map(g=>`<button class="pill ${S.bookFilter===g?'selected':''}" data-bookfilter="${g}">${g}</button>`).join('')}</div><div class="grid">${filtered.slice(0,300).map(bookCard).join('')}</div>${filtered.length>300?'<div class="empty">Showing first 300 matches. Search to narrow the library.</div>':''}`;
}
function moviesView(){
  const genres=['All',...new Set(D.movies.map(m=>m.genre).filter(Boolean))];
  const all=D.movies.filter(matches);
  const filtered=S.movieGenre==='All'?all:all.filter(m=>m.genre===S.movieGenre);
  return `<div class="section-head"><h3>Movies <span class="muted">${filtered.length}</span></h3></div><div class="toolbar">${genres.map(g=>`<button class="pill ${S.movieGenre===g?'selected':''}" data-mgenre="${esc(g)}">${esc(g)}</button>`).join('')}</div><div class="grid movie-grid">${filtered.map(movieCard).join('')}</div>`;
}
function recsView(){
  let rs=D.recommendations.filter(matches);
  const subs=['All',...new Set(D.recommendations.map(recSubgenre))].sort();
  if(S.recSub!=='All') rs=rs.filter(r=>recSubgenre(r)===S.recSub);
  rs=rs.filter(r=>S.recView==='History'?!recIsActive(r):recIsActive(r));
  rs.sort((a,b)=>(b.spock||0)-(a.spock||0));
  return `<div class="section-head"><h3>For You <span class="muted">${rs.length}</span></h3><div class="seg"><button data-recview="Active" class="${S.recView==='Active'?'selected':''}">Active</button><button data-recview="History" class="${S.recView==='History'?'selected':''}">History</button></div></div>
  <div class="toolbar">${subs.map(g=>`<button class="pill ${S.recSub===g?'selected':''}" data-recsub="${esc(g)}">${esc(g)}</button>`).join('')}</div>
  <div class="reclist">${rs.map(r=>`<div class="rec rec-full" data-rec="${esc(recKey(r))}"><div class="score">SPOCK ${r.spock}/10</div><h4>${esc(r.title)}</h4><div class="muted">${esc(r.author)}</div><div class="badge-row"><span class="badge">${esc(recSubgenre(r))}</span><span class="badge status">${esc(recStatus(r))}</span></div><p>${esc(r.why)}</p></div>`).join('')}</div>`;
}
function addView(){
  return `<h3>Add & Update</h3>
  <div class="addbox"><h4>Update Audible Library</h4><div class="muted">Export your full Libation library as Excel (.xlsx) or CSV, then select it here. New titles are merged without touching your Shaun ratings or notes.</div><input id="audibleFile" type="file" accept=".xlsx,.xls,.csv"><button class="primary" id="audibleBtn">Import Libation export</button><div id="audibleResult"></div></div>
  <div class="addbox"><h4>ISBN lookup</h4><div class="muted">For old-fashioned physical books. 😏</div><label>ISBN-10 or ISBN-13</label><input id="isbn" inputmode="numeric" placeholder="978…"><button class="primary" id="isbnBtn">Look up book</button><div id="isbnResult"></div></div>
  <div class="addbox"><h4>Manual book</h4><label>Title</label><input id="mtitle"><label>Author</label><input id="mauthor"><label>Format</label><select id="mformat"><option>Physical</option><option>Kindle</option><option>Audible</option><option>Other</option></select><button class="primary" id="manualBtn">Add book</button></div>
  <div class="addbox compact"><h4>Shaunverse</h4><div class="muted">Version ${VERSION}<br>Your personal ratings, notes, favorites, and recommendation states are stored locally on this device.</div></div>`;
}

function renderBody(){
  const c=S.tab==='home'?home():S.tab==='books'?booksView():S.tab==='movies'?moviesView():S.tab==='recs'?recsView():addView();
  shell(c); if(S.tab==='add') bindAdd(); if(S.tab==='movies'||S.tab==='home') hydrateVisibleMovies();
}
function render(){ renderBody(); }
function bindItems(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{S.tab=b.dataset.go;render();});
  document.querySelectorAll('[data-bookfilter]').forEach(b=>b.onclick=()=>{S.bookFilter=b.dataset.bookfilter;render();});
  document.querySelectorAll('[data-mgenre]').forEach(b=>b.onclick=()=>{S.movieGenre=b.dataset.mgenre;render();});
  document.querySelectorAll('[data-recsub]').forEach(b=>b.onclick=()=>{S.recSub=b.dataset.recsub;render();});
  document.querySelectorAll('[data-recview]').forEach(b=>b.onclick=()=>{S.recView=b.dataset.recview;render();});
  document.querySelectorAll('[data-id]').forEach(el=>el.onclick=()=>showDetail(el.dataset.kind,el.dataset.id));
  document.querySelectorAll('[data-rec]').forEach(el=>el.onclick=()=>showRecDetail(el.dataset.rec));
}

async function getMovieMeta(title){
  const key=normalize(title), cache=movieMeta(); if(cache[key]) return cache[key];
  try{
    const url=`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=movie&country=US&limit=12`;
    const r=await fetch(url); if(!r.ok) throw new Error('lookup'); const j=await r.json();
    const exact=j.results.find(x=>normalize(x.trackName)===key) || j.results.find(x=>normalize(x.trackName).includes(key)||key.includes(normalize(x.trackName))) || j.results[0];
    if(!exact) return {};
    const meta={
      artwork:(exact.artworkUrl100||'').replace(/100x100bb/,'600x600bb'),
      description:exact.longDescription||exact.shortDescription||'',
      year:exact.releaseDate?String(exact.releaseDate).slice(0,4):'',
      advisory:exact.contentAdvisoryRating||''
    };
    cache[key]=meta; save(KEYS.movieMeta,cache); return meta;
  }catch{return {};}
}
function hydrateVisibleMovies(){
  const els=[...document.querySelectorAll('[data-movie-title]')]; if(!els.length) return;
  const observer=new IntersectionObserver(entries=>entries.forEach(async e=>{
    if(!e.isIntersecting) return; observer.unobserve(e.target); const meta=await getMovieMeta(e.target.dataset.movieTitle);
    if(meta.artwork){ const c=e.target.querySelector('.movie-cover'); if(c) c.innerHTML=`<img loading="lazy" src="${esc(meta.artwork)}" alt="">`; }
  }),{rootMargin:'300px'});
  els.forEach(el=>observer.observe(el));
}

function showDetail(kind,id){
  let x;
  if(kind==='book') x=allBooks().find(b=>String(b.id)===String(id));
  else { x=D.movies.find(m=>normalize(m.title)===id); if(x) x={...x,type:'movie',id}; }
  if(!x) return;
  const key=entityKey(x), allp=personal(), p=allp[key]||{}, rating=p.rating ?? x.rating ?? '', status=p.status || (kind==='book'?(x.finished?'Finished':(x.owned?'Owned':'Want')):'Owned');
  const d=document.createElement('div'); d.className='detail';
  d.innerHTML=`<button class="close">×</button><div class="detail-cover" id="detailCover">${kind==='book'?bookCover(x):'<div class="movie-placeholder">'+initials(x.title)+'</div>'}</div><h2>${esc(x.title)}</h2><div id="movieDesc"></div>
    <div class="facts">${kind==='book'?`<b>Author:</b> ${esc(x.author)}<br><b>Narrator:</b> ${esc(x.narrator)}<br><b>Series:</b> ${esc(x.series)}<br><b>Format:</b> ${esc(x.format)}<br><b>Length:</b> ${esc(x.hours)} hours<br><b>Genres:</b> ${esc(x.genres)}`:`<b>Director:</b> ${esc(x.director)}<br><b>Runtime:</b> ${esc(x.runtime)}<br><b>Genre:</b> ${esc(x.genre)}<br><b>Collection:</b> ${esc(x.collection)}`}</div>
    <div class="personal-box"><h3>My Shaunverse</h3><label>Status</label><select id="pStatus">${['Want','Owned','Reading / Listening','Finished','DNF'].map(s=>`<option ${status===s?'selected':''}>${s}</option>`).join('')}</select><label>Shaun rating /10</label><input id="pRating" type="number" min="0" max="10" step="0.5" value="${esc(rating)}" placeholder="0–10"><label>Shaun's note</label><textarea id="pNote" rows="4" placeholder="Holy Shit!!">${esc(p.note||'')}</textarea><label class="check"><input id="pFav" type="checkbox" ${p.favorite?'checked':''}> Favorite</label><button class="primary" id="savePersonal">Save</button></div>`;
  document.body.appendChild(d); d.querySelector('.close').onclick=()=>d.remove();
  d.querySelector('#savePersonal').onclick=()=>{
    const ratingVal=d.querySelector('#pRating').value.trim(); allp[key]={...p,status:d.querySelector('#pStatus').value,rating:ratingVal===''?null:Number(ratingVal),note:d.querySelector('#pNote').value.trim(),favorite:d.querySelector('#pFav').checked}; save(KEYS.personal,allp); d.remove(); render();
  };
  if(kind==='movie') getMovieMeta(x.title).then(meta=>{
    if(!document.body.contains(d))return;
    if(meta.artwork) d.querySelector('#detailCover').innerHTML=`<img src="${esc(meta.artwork)}" alt="">`;
    if(meta.description) d.querySelector('#movieDesc').innerHTML=`<div class="synopsis">${esc(meta.description)}</div>`;
  });
}

function showRecDetail(key){
  const r=D.recommendations.find(x=>recKey(x)===key); if(!r)return;
  const states=recState(), s=states[key]||{}, status=s.status||recStatus(r);
  const d=document.createElement('div'); d.className='detail';
  d.innerHTML=`<button class="close">×</button><div class="rec-hero"><div class="score">SPOCK ${r.spock}/10</div><h2>${esc(r.title)}</h2><div class="muted">${esc(r.author)} · ${esc(recSubgenre(r))}</div></div><div class="synopsis">${esc(r.why)}</div><div class="personal-box"><h3>Recommendation status</h3><label>Status</label><select id="rStatus">${['Recommended','Want','Owned','Reading / Listening','Finished','DNF'].map(v=>`<option ${status===v?'selected':''}>${v}</option>`).join('')}</select><label>Shaun rating /10</label><input id="rRating" type="number" min="0" max="10" step="0.5" value="${esc(s.rating??r.shaun??'')}"><label>Shaun's note</label><textarea id="rNote" rows="4" placeholder="What did you think?">${esc(s.note||'')}</textarea><button class="primary" id="saveRec">Save</button></div>`;
  document.body.appendChild(d); d.querySelector('.close').onclick=()=>d.remove(); d.querySelector('#saveRec').onclick=()=>{ const rv=d.querySelector('#rRating').value.trim(); states[key]={status:d.querySelector('#rStatus').value,rating:rv===''?null:Number(rv),note:d.querySelector('#rNote').value.trim()}; save(KEYS.recs,states); d.remove(); render(); };
}

function boolVal(v){ return v===true || String(v).toLowerCase()==='true' || String(v)==='1'; }
function libationRowToBook(row){
  const g=(...names)=>{for(const n of names){if(row[n]!==undefined&&row[n]!==null)return row[n];}return '';};
  const id=String(g('Audible Product Id','Product Id','ASIN')||'').trim(); const title=String(g('Title')||'').trim(); if(!id||!title)return null;
  const mins=Number(g('Length In Minutes')||0); const myRaw=g('My Rating: Overall'); const my=(myRaw===''||myRaw===null||myRaw===undefined)?null:Number(myRaw);
  const coverId=String(g('Cover Id Large','Cover Id')||'').trim();
  return {id,type:'book',title,subtitle:String(g('Subtitle')||''),author:String(g('Authors','Author')||''),narrator:String(g('Narrators','Narrator')||''),series:String(g('Series Names','Series')||''),seriesNo:String(g('Series Order','Series #')||''),hours:Math.round((mins/60)*100)/100,genres:String(g('Categories','Genres')||''),finished:boolVal(g('Is Finished?','Finished')),rating:(my!==null&&Number.isFinite(my))?Math.round(my*20)/10:null,community:(g('Community Rating: Overall')===''?null:Number(g('Community Rating: Overall'))||null),cover:coverId?`https://m.media-amazon.com/images/I/${coverId}.jpg`:'',format:'Audible',owned:true};
}
async function importAudible(file){
  if(!file) throw new Error('Choose a file first.');
  if(!window.XLSX) throw new Error('Spreadsheet importer did not load. Check your internet connection and try again.');
  const buf=await file.arrayBuffer(); const wb=XLSX.read(buf,{type:'array'}); const ws=wb.Sheets[wb.SheetNames[0]]; const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
  const parsed=rows.map(libationRowToBook).filter(Boolean); if(!parsed.length) throw new Error('I could not find Libation book rows in that file.');
  const base=new Set(D.books.map(b=>String(b.id))); const existing=audibleImports(); const map=new Map(existing.map(b=>[String(b.id),b])); let added=0,updated=0;
  parsed.forEach(b=>{ if(base.has(String(b.id))) return; if(map.has(String(b.id))) updated++; else added++; map.set(String(b.id),b); });
  save(KEYS.audible,[...map.values()]); return {added,updated,total:parsed.length,local:[...map.values()].length};
}

async function bindAdd(){
  document.getElementById('manualBtn').onclick=()=>{ const title=document.getElementById('mtitle').value.trim(); if(!title)return; const arr=customBooks(); arr.push({id:'custom-'+Date.now(),type:'book',title,author:document.getElementById('mauthor').value.trim(),format:document.getElementById('mformat').value,genres:'',finished:false,owned:true,cover:''}); save(KEYS.custom,arr); S.tab='books'; render(); };
  document.getElementById('isbnBtn').onclick=async()=>{ const isbn=document.getElementById('isbn').value.replace(/[^0-9Xx]/g,''); const box=document.getElementById('isbnResult'); box.innerHTML='<p class="muted">Searching…</p>'; try{ const r=await fetch('https://openlibrary.org/isbn/'+isbn+'.json'); if(!r.ok)throw 0; const b=await r.json(),authors=[]; for(const a of (b.authors||[]).slice(0,4)){try{const ar=await fetch('https://openlibrary.org'+a.key+'.json');const ad=await ar.json();authors.push(ad.name)}catch{}} const cover=b.covers?.[0]?`https://covers.openlibrary.org/b/id/${b.covers[0]}-L.jpg`:''; box.innerHTML=`<div class="rec"><h4>${esc(b.title)}</h4><div class="muted">${esc(authors.join(', '))}</div><button class="primary" id="addISBN">Add physical book</button></div>`; document.getElementById('addISBN').onclick=()=>{const arr=customBooks();arr.push({id:'isbn-'+isbn,type:'book',title:b.title,author:authors.join(', '),format:'Physical',genres:(b.subjects||[]).slice(0,8).join('; '),finished:false,owned:true,cover});save(KEYS.custom,arr);S.tab='books';render();}; }catch{box.innerHTML='<p class="muted">No match found. Use Manual Book below.</p>';} };
  document.getElementById('audibleBtn').onclick=async()=>{ const box=document.getElementById('audibleResult'); const file=document.getElementById('audibleFile').files[0]; box.innerHTML='<p class="muted">Reading your Libation export…</p>'; try{const result=await importAudible(file);box.innerHTML=`<div class="success"><b>Audible updated.</b><br>${result.added} new title${result.added===1?'':'s'} added, ${result.updated} previously imported title${result.updated===1?'':'s'} refreshed.<br><span class="muted">Your ratings and notes were left alone.</span></div>`;renderLaterCounts();}catch(e){box.innerHTML=`<div class="error">${esc(e.message||'Import failed.')}</div>`;} };
}
function renderLaterCounts(){ setTimeout(()=>{},0); }

function bindEgg(){
  const el=document.getElementById('brandEgg'); if(!el)return; let taps=0,timer;
  el.onclick=()=>{clearTimeout(timer);taps++;timer=setTimeout(()=>taps=0,1800);if(taps>=7){taps=0;const d=document.createElement('div');d.className='egg';d.innerHTML=`<div class="egg-inner"><div class="egg-star">✦</div><div class="egg-quote">“Dad, you're such a fucking nerd.”</div><div class="egg-by">— Ali, 2026 ❤️</div><button>As it should be.</button></div>`;document.body.appendChild(d);d.querySelector('button').onclick=()=>d.remove();}};
}

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
render();
})();
