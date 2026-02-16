import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'

const GALLERY_STORAGE_KEY = 'puzzle-tracker-gallery-columns'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function GalleryViewIcons({ columns, setColumns }) {
  const options = [
    { value: 1, label: '1 per fila', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    )},
    { value: 2, label: '2 per fila', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="18" rx="2" />
        <rect x="13" y="3" width="8" height="18" rx="2" />
      </svg>
    )},
    { value: 4, label: '4 per fila', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="8" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" />
      </svg>
    )},
  ]
  return (
    <div className="gallery-view" role="group" aria-label="Vista de galeria">
      {options.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          className={`gallery-view-btn ${columns === value ? 'active' : ''}${value === 4 ? ' gallery-view-btn--desktop-only' : ''}`}
          onClick={() => {
            setColumns(value)
            try { localStorage.setItem(GALLERY_STORAGE_KEY, String(value)) } catch (_) {}
          }}
          title={label}
          aria-label={label}
          aria-pressed={columns === value}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

function App() {
  const [galleryColumns, setGalleryColumns] = useState(() => {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY)
      if (stored) {
        const v = parseInt(stored, 10)
        if ([1, 2, 4].includes(v)) return v
      }
      if (typeof window !== 'undefined' && window.innerWidth <= 768) return 1
      return 2
    } catch {
      return 2
    }
  })

  return (
    <Router basename="/puzzle-tracker">
      <ScrollToTop />
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0, 0)}>
              🧩 <span className="nav-logo-text">Puzzle Tracker</span>
            </Link>
            <div className="nav-links">
              <GalleryViewIcons columns={galleryColumns} setColumns={setGalleryColumns} />
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home galleryColumns={galleryColumns} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
