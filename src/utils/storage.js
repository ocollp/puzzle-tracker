const STORAGE_KEY = 'puzzle-tracker-data'

export const getPuzzles = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    return []
  }

  const parsed = JSON.parse(data)

  return parsed.map((p) => {
    if (p.rating) return p

    let ratingFromDifficulty = 3
    if (p.difficulty === 'Easy' || p.difficulty === 'Fácil') ratingFromDifficulty = 2
    if (p.difficulty === 'Medium' || p.difficulty === 'Medio') ratingFromDifficulty = 3
    if (p.difficulty === 'Hard' || p.difficulty === 'Difícil') ratingFromDifficulty = 4
    if (p.difficulty === 'Very Hard' || p.difficulty === 'Muy Difícil') ratingFromDifficulty = 5

    return { ...p, rating: ratingFromDifficulty }
  })
}

export const savePuzzle = (puzzle) => {
  const puzzles = getPuzzles()
  const newPuzzle = {
    ...puzzle,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    date: new Date().toISOString(),
  }
  puzzles.push(newPuzzle)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(puzzles))
  return newPuzzle
}

export const deletePuzzle = (id) => {
  const puzzles = getPuzzles()
  const filtered = puzzles.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export const getTotalPieces = () => {
  const puzzles = getPuzzles()
  return puzzles.reduce((total, puzzle) => total + (parseInt(puzzle.pieces) || 0), 0)
}

export const getDaysTracking = () => {
  const puzzles = getPuzzles()
  if (puzzles.length === 0) return 0

  const puzzlesWithDates = puzzles.filter(p => p.startDate && p.endDate)
  if (puzzlesWithDates.length > 0) {
    const allDays = new Set()
    puzzlesWithDates.forEach(p => {
      const start = new Date(p.startDate)
      const end = new Date(p.endDate)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        allDays.add(d.toDateString())
      }
    })
    return allDays.size
  }

  const dates = puzzles.map(p => new Date(p.date).toDateString())
  const uniqueDates = [...new Set(dates)]
  return uniqueDates.length
}
