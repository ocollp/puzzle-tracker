import { useState, useEffect, useRef } from 'react'
import { availablePuzzles } from '../data/puzzles'
import './Home.css'

const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')

function getImageUrl(image) {
  return image ? baseUrl + (image.startsWith('/') ? image.slice(1) : image) : ''
}

function getTotalPiecesFromList(list) {
  return list.reduce((total, p) => total + (parseInt(p.pieces) || 0), 0)
}

function getDaysTrackingFromList(list) {
  if (list.length === 0) return 0
  const withDates = list.filter(p => p.startDate && p.endDate)
  if (withDates.length === 0) return 0
  const allDays = new Set()
  withDates.forEach(p => {
    const start = new Date(p.startDate)
    const end = new Date(p.endDate)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDays.add(d.toDateString())
    }
  })
  return allDays.size
}

function getTotalPriceFromList(list) {
  return list.reduce((total, p) => total + (parseFloat(p.price) || 0), 0)
}

function formatStatNumber(n) {
  if (n >= 1000) {
    const k = n / 1000
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1).replace('.', ',')}k`
  }
  return n.toLocaleString()
}

function Home({ galleryColumns = 2 }) {
  const puzzles = [...availablePuzzles].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date(0)
    const dateB = b.endDate ? new Date(b.endDate) : new Date(0)
    return dateB - dateA
  })
  const totalPieces = getTotalPiecesFromList(puzzles)
  const daysTracking = getDaysTrackingFromList(puzzles)
  const totalPrice = getTotalPriceFromList(puzzles)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const touchStartX = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft' && puzzles.length > 1) {
        setLightboxIndex((i) => (i <= 0 ? puzzles.length - 1 : i - 1))
      }
      if (e.key === 'ArrowRight' && puzzles.length > 1) {
        setLightboxIndex((i) => (i >= puzzles.length - 1 ? 0 : i + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, puzzles.length])

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = () => setLightboxIndex((i) => (i <= 0 ? puzzles.length - 1 : i - 1))
  const goNext = () => setLightboxIndex((i) => (i >= puzzles.length - 1 ? 0 : i + 1))

  const SWIPE_THRESHOLD = 50
  const handleLightboxTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleLightboxTouchEnd = (e) => {
    if (puzzles.length <= 1) return
    const endX = e.changedTouches[0].clientX
    const diff = touchStartX.current - endX
    if (diff > SWIPE_THRESHOLD) goNext()
    else if (diff < -SWIPE_THRESHOLD) goPrev()
  }

  return (
    <div className="home">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">🧩</div>
          <div className="stat-info">
            <h2>{puzzles.length}</h2>
            <p>{puzzles.length === 1 ? 'puzzle acabat' : 'puzzles acabats'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔢</div>
          <div className="stat-info">
            <h2>{formatStatNumber(totalPieces)}</h2>
            <p>peces en total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h2>{daysTracking}</h2>
            <p>
              {daysTracking === 1 ? 'dia fent puzzles' : 'dies fent puzzles'}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h2>{totalPrice > 0 ? `${totalPrice}€` : '–'}</h2>
            <p>gastats</p>
          </div>
        </div>
      </div>

      {puzzles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧩</div>
          <h2>encara no hi ha puzzles</h2>
          <p>Afegeix puzzles a <code>src/data/puzzles.js</code> per veure'ls aquí.</p>
        </div>
      ) : (
        <>
        {lightboxIndex !== null && (
          <div className="lightbox-overlay" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Imatge en gran">
            <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Tancar">×</button>
            {puzzles.length > 1 && (
              <>
                <button type="button" className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); goPrev() }} aria-label="Anterior">‹</button>
                <button type="button" className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); goNext() }} aria-label="Següent">›</button>
              </>
            )}
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleLightboxTouchStart}
              onTouchEnd={handleLightboxTouchEnd}
            >
              <img src={getImageUrl(puzzles[lightboxIndex].image)} alt={puzzles[lightboxIndex].title} className="lightbox-image" />
              <p className="lightbox-caption">{puzzles[lightboxIndex].title}</p>
            </div>
          </div>
        )}
        <div className={`puzzles-grid columns-${galleryColumns}`}>
          {puzzles.map((puzzle, index) => (
            <div key={puzzle.id} className="puzzle-card">
              <div
                className={`puzzle-image-container puzzle-image-clickable${puzzle.imagePosition === 'top' ? ' puzzle-image--top' : ''}`}
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index) } }}
                aria-label={`Veure ${puzzle.title} en gran`}
              >
                <img 
                  src={getImageUrl(puzzle.image)} 
                  alt={puzzle.title}
                  className="puzzle-image"
                />
                <span className="puzzle-image-hint">Veure en gran</span>
              </div>
              <div className="puzzle-info">
                <div className="puzzle-title-row">
                  <h3 className="puzzle-title">{puzzle.title}</h3>
                  {puzzle.price != null && (
                    <span className="puzzle-price-badge">{puzzle.price}€</span>
                  )}
                </div>
                <div className="puzzle-meta">
                  {puzzle.brand && <span className="puzzle-meta-brand">{puzzle.brand}</span>}
                  <span className="puzzle-meta-pieces">{puzzle.pieces} peces</span>
                </div>
                <div className="puzzle-stars" aria-label={`${puzzle.rating} de 5 estrelles`}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={
                        starIndex < (puzzle.rating || 0)
                          ? 'star star-filled'
                          : 'star'
                      }
                    >
                      {starIndex < (puzzle.rating || 0) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <div className="puzzle-date-row">
                  {puzzle.startDate && puzzle.endDate ? (() => {
                    const start = new Date(puzzle.startDate)
                    const end = new Date(puzzle.endDate)
                    const diffTime = Math.abs(end - start)
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                    const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`
                    return (
                      <span className="puzzle-date">
                        {diffDays === 1 ? '1 dia' : `${diffDays} dies`} ({fmt(start)} - {fmt(end)})
                      </span>
                    )
                  })() : (
                    <span className="puzzle-date">
                      {new Date(puzzle.date).toLocaleDateString('ca-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  )
}

export default Home
