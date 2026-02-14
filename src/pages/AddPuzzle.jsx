import { useNavigate } from 'react-router-dom'
import { savePuzzle } from '../utils/storage'
import { availablePuzzles } from '../data/puzzles'
import './AddPuzzle.css'

const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
function getImageUrl(image) {
  return image ? baseUrl + (image.startsWith('/') ? image.slice(1) : image) : ''
}

function AddPuzzle() {
  const navigate = useNavigate()

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleAdd = (puzzle) => {
    savePuzzle({
      title: puzzle.title,
      brand: puzzle.brand,
      rating: puzzle.rating,
      pieces: puzzle.pieces,
      price: puzzle.price,
      image: puzzle.image,
      startDate: puzzle.startDate,
      endDate: puzzle.endDate
    })

    navigate('/')
  }

  return (
    <div className="add-puzzle">
      <div className="puzzles-gallery">
        {availablePuzzles.map((puzzle) => {
          const duration = calculateDuration(puzzle.startDate, puzzle.endDate)
          return (
            <div key={puzzle.id} className="gallery-puzzle-card">
              <div className="gallery-puzzle-image">
                <img src={getImageUrl(puzzle.image)} alt={puzzle.title} />
              </div>
              <div className="gallery-puzzle-info">
                <div className="gallery-puzzle-title-row">
                  <h3 className="gallery-puzzle-title">{puzzle.title}</h3>
                  <span className="gallery-puzzle-pieces-inline"> - {puzzle.pieces} pieces</span>
                </div>
                {puzzle.brand && (
                  <p className="gallery-puzzle-brand">{puzzle.brand}</p>
                )}
                <div className="gallery-puzzle-rating-duration">
                  <div className="stars-display">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={index < puzzle.rating ? 'star star-filled' : 'star'}
                      >
                        {index < puzzle.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  {duration && (
                    <span className="gallery-puzzle-duration-inline">
                      {duration === 1 ? '1 day' : `${duration} days`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAdd(puzzle)}
                  className="btn btn-primary gallery-add-btn"
                >
                  add puzzle
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AddPuzzle
