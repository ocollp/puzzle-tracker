import { useState, useEffect, useRef } from 'react'
import { availablePuzzles } from '../data/puzzles'
import './Home.css'
const imageUrl = image => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${image.replace(/^\//, '')}`
const number = n => n.toLocaleString('ca-ES')
const date = value => new Date(value + 'T12:00:00').toLocaleDateString('ca-ES', {day:'numeric',month:'short',year:'numeric'})
const duration = p => Math.round((Date.parse(p.endDate)-Date.parse(p.startDate))/86400000)+1
const all = [...availablePuzzles].sort((a,b)=> (b.endDate || '').localeCompare(a.endDate || ''))
const brands = [...new Set(all.map(p=>p.brand))].sort()
const pieceOptions = [...new Set(all.map(p=>p.pieces))].sort((a,b)=>a-b)
const trackedDays = new Set(all.flatMap(p => p.startDate && p.endDate ? Array.from({length:duration(p)},(_,i)=>Date.parse(p.startDate)+i*86400000):[])).size
function Stars({rating}) {return <span className="stars" aria-label={`${rating} de 5 estrelles`}>{Array.from({length:5},(_,i)=><span aria-hidden="true" key={i} className={i<rating?'filled':''}>★</span>)}</span>}
export default function Home() {
 const [query,setQuery]=useState(''),[brand,setBrand]=useState(''),[pieces,setPieces]=useState(''),[rating,setRating]=useState(''),[sort,setSort]=useState('recent')
 const [columns,setColumns]=useState(()=>{try{return localStorage.getItem('puzzle-layout')==='2'?2:3}catch{return 3}})
 const [selected,setSelected]=useState(null)
 const dialog=useRef(null), opener=useRef(null)
 const touchStart=useRef(null)
 const [dragX,setDragX]=useState(0)
 const cancelSwipe=()=>{touchStart.current=null;setDragX(0)}
 const onTouchStart=e=>{
   cancelSwipe()
   if(e.touches.length===1) touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY}
 }
 const onTouchMove=e=>{
   if(e.touches.length!==1){cancelSwipe();return}
   const start=touchStart.current
   if(!start)return
   const dx=e.touches[0].clientX-start.x,dy=e.touches[0].clientY-start.y
   if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){cancelSwipe();return}
   if(Math.abs(dx)>12&&filtered.length>1)setDragX(Math.max(-100,Math.min(100,dx)))
 }
 const onTouchEnd=e=>{
   const start=touchStart.current
   cancelSwipe()
   if(!start||e.touches.length||!e.changedTouches.length||filtered.length<2)return
   const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y
   if(Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(dx<0?1:-1)
 }
 const filtered=all.filter(p=>`${p.title} ${p.brand}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())&&(!brand||p.brand===brand)&&(!pieces||p.pieces===Number(pieces))&&(!rating||p.rating>=Number(rating))).sort((a,b)=>sort==='rating'?b.rating-a.rating:sort==='title'?a.title.localeCompare(b.title):sort==='oldest'?(a.endDate||'').localeCompare(b.endDate||''):(b.endDate||'').localeCompare(a.endDate||''))
 const active=!!(query||brand||pieces||rating)
 const reset=()=>{setQuery('');setBrand('');setPieces('');setRating('')}
 const navigate=step=>setSelected(p=>filtered[(filtered.findIndex(v=>v.id===p.id)+step+filtered.length)%filtered.length])
 useEffect(()=>{if(!selected)return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current.showModal();return()=>{document.body.style.overflow=prev;opener.current?.focus()}},[!!selected])
 const close=()=>{dialog.current?.close();setSelected(null)}
 return <>
  <section id="collection" className="collection">
  <div className="toolbar"><label className="search"><span aria-hidden="true">⌕</span><input aria-label="Cerca un puzzle" placeholder="Cerca un puzzle o una marca…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Esborra la cerca" onClick={()=>setQuery('')}>×</button>}</label><div className="filters"><select aria-label="Marca" value={brand} onChange={e=>setBrand(e.target.value)}><option value="">Totes les marques</option>{brands.map(b=><option key={b}>{b}</option>)}</select><select aria-label="Peces" value={pieces} onChange={e=>setPieces(e.target.value)}><option value="">Totes les peces</option>{pieceOptions.map(p=><option key={p} value={p}>{number(p)} peces</option>)}</select><select aria-label="Valoració" value={rating} onChange={e=>setRating(e.target.value)}><option value="">Valoració</option>{[5,4,3,2,1].map(r=><option key={r} value={r}>{r} ★ o més</option>)}</select></div></div>
  <div className="results-bar"><p aria-live="polite">{filtered.length} {filtered.length===1?'puzzle':'puzzles'}{active?(filtered.length===1?' trobat':' trobats'):''}{active&&<button className="clear" onClick={reset}>Neteja els filtres ×</button>}</p><div className="view-controls"><select aria-label="Ordena els puzzles" value={sort} onChange={e=>setSort(e.target.value)}><option value="recent">Més recents</option><option value="oldest">Més antics</option><option value="rating">Millor valorats</option><option value="title">Títol A–Z</option></select><div className="layout-controls" aria-label="Disposició">{[2,3].map(n=><button key={n} aria-label={`${n} columnes`} aria-pressed={columns===n} onClick={()=>{setColumns(n);try{localStorage.setItem('puzzle-layout',n)}catch{}}}><span className={`layout-icon layout-${n}`}>{Array.from({length:n},(_,i)=><i key={i}/>)}</span></button>)}</div></div></div>
  <div className={`puzzles-grid columns-${columns}`}>{filtered.map((p,i)=><button className="puzzle-card" key={p.id} onClick={e=>{opener.current=e.currentTarget;setSelected(p)}} aria-label={`Veure ${p.title}`}><div className="puzzle-image-container"><img loading="lazy" src={imageUrl(p.image)} alt={p.title} style={{objectPosition:p.imagePosition==='top'?'top':'center'}}/><span className="image-open" aria-hidden="true">↗</span></div><div className="puzzle-info"><p className="puzzle-brand">{p.brand}</p><h3>{p.title}</h3><div className="card-bottom"><Stars rating={p.rating}/><span>{p.endDate&&date(p.endDate)}</span></div></div></button>)}</div>
  {!filtered.length&&<div className="empty-state"><h3>Cap peça per aquí.</h3><p>Prova una altra cerca o ajusta els filtres.</p><button onClick={reset}>Mostra tots els puzzles</button></div>}
  </section>
  {selected&&<dialog ref={dialog} className="puzzle-dialog" aria-label={selected.title} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===dialog.current)close()}} onKeyDown={e=>{if(e.key==='ArrowRight')navigate(1);if(e.key==='ArrowLeft')navigate(-1)}}><button autoFocus className="dialog-close" aria-label="Tanca" onClick={close}>×</button><div className="dialog-image" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={cancelSwipe}><img draggable={false} style={{transform:`translateX(${dragX}px)`,transition:dragX?'none':'transform 180ms ease'}} src={imageUrl(selected.image)} alt={selected.title}/><span className="swipe-hint">← Llisca per canviar de foto →</span></div><div className="dialog-details"><p className="eyebrow">{selected.brand}</p><h2>{selected.title}</h2><Stars rating={selected.rating}/><dl><div><dt>Peces</dt><dd>{number(selected.pieces)}</dd></div><div><dt>Temps dedicat</dt><dd>{duration(selected)} dies</dd></div><div><dt>Preu</dt><dd>{selected.price} €</dd></div><div><dt>Completat</dt><dd>{date(selected.endDate)}</dd></div></dl><div className="dialog-navigation"><button disabled={filtered.length<2} onClick={()=>navigate(-1)}>← Anterior</button><span>{filtered.findIndex(p=>p.id===selected.id)+1} / {filtered.length}</span><button disabled={filtered.length<2} onClick={()=>navigate(1)}>Següent →</button></div></div></dialog>}
 </>
}
