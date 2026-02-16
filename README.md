# 🧩 Puzzle Tracker

A personal tracker for the puzzles you complete. Add puzzles from the gallery, see your stats on the home page, and browse your collection with flexible layout options.

## Features

- **Home** — Stats (puzzles completed, total pieces, days tracking, total spent) and a grid of finished puzzles
- **Gallery view** — Switch between 1, 2, or 4 columns; default is 2 on desktop and 1 on mobile
- **Lightbox** — Click any puzzle image to view it full size; navigate with arrows or keyboard
- **Puzzle data** — Edit `src/data/puzzles.js` to add or update puzzles (title, brand, pieces, rating, price, dates, image)

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173/puzzle-tracker/** in your browser.

## Build

```bash
npm run build
npm run preview   # preview production build locally
```

## Tech

- React 18 + Vite 5
- React Router 6
- Plain CSS (no UI framework)
