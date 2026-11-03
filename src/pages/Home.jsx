import { useState, useEffect, useRef } from 'react'
import { availablePuzzles } from '../data/puzzles'
import './Home.css'
const imageUrl = image => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${image.replace(/^\//, '')}`
const date = value => new Date(value + 'T12:00:00').toLocaleDateString('ca-ES', {day:'numeric',month:'short',year:'numeric'})
const duration = p => Math.round((Date.parse(p.endDate)-Date.parse(p.startDate))/86400000)+1
const all = [...availablePuzzles].sort((a,b)=> (b.endDate || '').localeCompare(a.endDate || ''))
const brands = [...new Set(all.map(p=>p.brand))].sort()
const pieceOptions = [...new Set(all.map(p=>p.pieces))].sort((a,b)=>a-b)
const trackedDays = new Set(all.flatMap(p => p.startDate && p.endDate ? Array.from({length:duration(p)},(_,i)=>Date.parse(p.startDate)+i*86400000):[])).size
function Difficulty({rating}) {
 return <span className="difficulty" role="img" aria-label={`Dificultat: ${rating} de 5`}>{Array.from({length:5},(_,i)=><span key={i} aria-hidden="true" style={i>=rating?{filter:'grayscale(1)',opacity:0.35}:undefined}>🌶️</span>)}</span>
}
export default function Home() {
 const [sort,setSort]=useState('recent')
 const [isMobile,setIsMobile]=useState(()=>window.matchMedia('(max-width: 700px)').matches)
 useEffect(()=>{const media=window.matchMedia('(max-width: 700px)');const update=()=>setIsMobile(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
 const [columns,setColumns]=useState(()=>{try{const saved=Number(localStorage.getItem('puzzle-layout'));return [1,2,3].includes(saved)?saved:window.innerWidth<=700?1:3}catch{return 1}})
 const visibleColumns=isMobile?Math.min(columns,2):columns
 const [selected,setSelected]=useState(null)
 const dialog=useRef(null), opener=useRef(null)
 const touchStart=useRef(null)
 const [dragX,setDragX]=useState(0)
 const [sliding,setSliding]=useState(false)
 const [settling,setSettling]=useState(false)
 const [dragging,setDragging]=useState(false)
 const slideTimer=useRef(null), slideBusy=useRef(false), viewport=useRef(null)
 useEffect(()=>()=>clearTimeout(slideTimer.current),[])
 const cancelSwipe=()=>{touchStart.current=null;setDragging(false);setSettling(true);if(!slideBusy.current)setDragX(0)}
 const onTouchStart=e=>{
   if(slideBusy.current)return
   cancelSwipe();setSettling(false)
   if(e.touches.length===1) touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY}
 }
 const onTouchMove=e=>{
   if(e.touches.length!==1){cancelSwipe();return}
   const start=touchStart.current
   if(!start)return
   const dx=e.touches[0].clientX-start.x,dy=e.touches[0].clientY-start.y
   if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){cancelSwipe();return}
   if(Math.abs(dx)>12&&filtered.length>1){setDragging(true);setDragX(dx)}
 }
 const onTouchEnd=e=>{
   const start=touchStart.current
   touchStart.current=null;setDragging(false)
   if(!start||e.touches.length||!e.changedTouches.length||filtered.length<2){setDragX(0);return}
   const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y
   if(Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(dx<0?1:-1)
   else {setSettling(true);setDragX(0)}
 }
 const filtered=[...all].sort((a,b)=>sort==='rating'?b.rating-a.rating:sort==='title'?a.title.localeCompare(b.title):sort==='oldest'?(a.endDate||'').localeCompare(b.endDate||''):(b.endDate||'').localeCompare(a.endDate||''))
 const navigate=step=>{
   if(slideBusy.current||!selected||filtered.length<2)return
   const next=filtered[(filtered.findIndex(v=>v.id===selected.id)+step+filtered.length)%filtered.length]
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setSelected(next);setDragX(0);return}
   slideBusy.current=true;setSliding(true);setDragging(false)
   setDragX(-step*(viewport.current?.clientWidth||300))
   slideTimer.current=setTimeout(()=>{setSliding(false);setSettling(false);setSelected(next);setDragX(0);slideBusy.current=false},260)
 }
 const selectedIndex=selected?filtered.findIndex(p=>p.id===selected.id):-1
 const slides=selected?[-1,0,1].map(offset=>filtered[(selectedIndex+offset+filtered.length)%filtered.length]):[]
 useEffect(()=>{if(!selected)return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current.showModal();return()=>{document.body.style.overflow=prev;opener.current?.focus()}},[!!selected])
 const close=()=>{clearTimeout(slideTimer.current);slideBusy.current=false;setSliding(false);cancelSwipe();dialog.current?.close();setSelected(null)}
 return <>
  <section id="collection" className="collection">
  <div className="results-bar"><p aria-live="polite">{filtered.length} {filtered.length===1?'puzzle':'puzzles'}</p><div className="view-controls"><select aria-label="Ordena els puzzles" value={sort} onChange={e=>setSort(e.target.value)}><option value="recent">Més recents</option><option value="oldest">Més antics</option><option value="rating">Més difícils</option><option value="title">Títol A–Z</option></select><div className="layout-controls" aria-label="Disposició">{(isMobile?[1,2]:[1,2,3]).map(n=><button key={n} aria-label={`${n} ${n===1?'columna':'columnes'}`} aria-pressed={visibleColumns===n} onClick={()=>{setColumns(n);try{localStorage.setItem('puzzle-layout',n)}catch{}}}><span className={`layout-icon layout-${n}`}>{Array.from({length:n},(_,i)=><i key={i}/>)}</span></button>)}</div></div></div>
  <div className={`puzzles-grid columns-${visibleColumns}`}>{filtered.map((p,i)=><button className="puzzle-card" key={p.id} onClick={e=>{opener.current=e.currentTarget;setSelected(p)}} aria-label={`Veure ${p.title}`}><div className="puzzle-image-container"><img loading="lazy" src={imageUrl(p.image)} alt={p.title} style={{objectPosition:p.imagePosition==='top'?'top':'center'}}/><span className="image-open" aria-hidden="true">↗</span></div><div className="puzzle-info"><h3>{p.title}</h3>{p.brand && p.brand!=='Marca pendent' && <p className="puzzle-brand">{p.brand}</p>}<div className="puzzle-timing"><Difficulty rating={p.rating}/><div className="timing-summary"><span className="duration-badge">{duration(p)} {duration(p)===1?'dia':'dies'}</span><p className="timing-dates"><time dateTime={p.startDate}>{date(p.startDate)}</time><span aria-hidden="true"> – </span><time dateTime={p.endDate}>{date(p.endDate)}</time></p></div></div></div></button>)}</div>
  {!filtered.length&&<div className="empty-state"><h3>Cap peça per aquí.</h3><p>Encara no hi ha puzzles.</p></div>}
  </section>
  {selected&&<dialog ref={dialog} className="puzzle-dialog photo-viewer" aria-label={selected.title} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===dialog.current)close()}} onKeyDown={e=>{if(e.key==='ArrowRight')navigate(1);if(e.key==='ArrowLeft')navigate(-1)}}><button autoFocus className="dialog-close" aria-label="Tanca" onClick={close}>×</button><div ref={viewport} className="dialog-image swipe-viewport" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={cancelSwipe}><div className="swipe-track" style={{transform:`translate3d(calc(-100% + ${dragX}px),0,0)`,transition:dragging||(!sliding&&!settling)?'none':'transform 260ms cubic-bezier(.22,.61,.36,1)'}}>{slides.map((p,i)=><div className="swipe-slide" key={i} aria-hidden={i!==1}><img draggable={false} src={imageUrl(p.image)} alt={i===1?p.title:''}/></div>)}</div></div><div className="photo-caption"><button className="photo-arrow" aria-label="Foto anterior" disabled={filtered.length<2} onClick={()=>navigate(-1)}>←</button><h2 aria-live="polite">{selected.title}</h2><button className="photo-arrow" aria-label="Foto següent" disabled={filtered.length<2} onClick={()=>navigate(1)}>→</button></div></dialog>}
 </>
}
