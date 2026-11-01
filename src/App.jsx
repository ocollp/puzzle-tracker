import Home from './pages/Home'
import './App.css'

export default function App() {
  return <div className="app">
    <header className="navbar"><div className="nav-container">
      <a href="#" className="nav-logo">Puzzles</a>
      <a href="#collection" className="nav-puzzle" aria-label="Veure els puzzles" title="Veure els puzzles">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h5V5a3 3 0 0 1 6 0v2h5v5h1a3 3 0 0 1 0 6h-1v4h-5v-2a3 3 0 0 0-6 0v2H4v-5h2a3 3 0 0 0 0-6H4Z" />
        </svg>
      </a>
    </div></header>
    <main className="main-content"><Home /></main>
    <footer className="site-footer"><span>Puzzles</span></footer>
  </div>
}
