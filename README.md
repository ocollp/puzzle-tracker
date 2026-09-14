# Puzzles

La nostra col·lecció personal de puzzles acabats: fotos, valoracions i el record de cada estona compartida.

## Posar-lo en marxa

```bash
npm install        # només la primera vegada
npm run dev
```

Obre [http://localhost:5173/puzzles/](http://localhost:5173/puzzles/) al navegador.

## Afegir o editar puzzles

Les dades viuen a [`src/data/puzzles.js`](src/data/puzzles.js). Per a cada puzzle pots canviar `title`, `brand`, `pieces`, `rating`, `price`, les dates i `image`. Els fitxers d'imatge van a `public/puzzles/`.

## Compilar una versió final

```bash
npm run build
npm run preview
```

La pàgina es publica sota la ruta `/puzzles/`.
