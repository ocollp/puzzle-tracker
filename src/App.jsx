import Home from './pages/Home'
import './App.css'

export default function App() {
  return <div className="app">
    <header className="navbar"><div className="nav-container">
      <a href="#" className="nav-logo">Puzzles</a>
      <a href="#collection" className="nav-link">La col·lecció <span>↗</span></a>
    </div></header>
    <main className="main-content"><Home /></main>
    <footer className="site-footer"><span>Puzzles</span><span>La nostra col·lecció de puzzles.</span></footer>
  </div>
}
