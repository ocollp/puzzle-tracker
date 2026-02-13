# 🧩 Puzzle Tracker

Personal tracker for the puzzles we complete. Add them from the gallery, see stats at home.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## If you push to GitHub – how to see it online

The app only runs on your machine until you put it on a host. Two simple free options:

1. **Vercel** (recommended)
   - Push the repo to GitHub.
   - Go to [vercel.com](https://vercel.com), sign in with GitHub, and import this repo.
   - Leave defaults and deploy. They’ll give you a URL like `puzzle-tracker-xxx.vercel.app`.

2. **Netlify**
   - Push the repo to GitHub.
   - Go to [netlify.com](https://netlify.com), “Add new site” → “Import from Git” → choose this repo.
   - Build command: `npm run build`. Publish directory: `dist`.
   - Deploy. You’ll get a URL like `something.netlify.app`.

**Note:** Data is saved in the browser (localStorage). So if you open the app from a new device or in another browser, you’ll start with no puzzles. The list is tied to that browser on that device.
