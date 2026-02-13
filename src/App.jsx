import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Router basename="/puzzle-tracker">
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🧩 <span className="nav-logo-text">Puzzle Tracker</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">inici</Link>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
