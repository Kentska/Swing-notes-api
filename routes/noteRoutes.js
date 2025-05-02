
const express = require('express');
// Importerar Express-biblioteket för att skapa en router.

const { getNotes, createNote, updateNote, deleteNote, searchNotes } = require('../controllers/noteController');
// Importerar funktioner från `noteController` som hanterar olika anteckningsrelaterade operationer.

const auth = require('../middleware/auth');
// Importerar `auth`-middleware för att skydda rutterna och säkerställa att endast autentiserade användare kan använda dem.


const router = express.Router();
// Skapar en ny instans av en Express-router för att definiera API-rutter.



router.get('/', auth, getNotes);
// Definierar en GET-route för att hämta alla anteckningar för den inloggade användaren.
// - URL: `/api/notes/`
// - Middleware: `auth` (verifierar JWT-token).
// - Controller: `getNotes` (hämtar anteckningarna).

router.post('/', auth, createNote);
// Definierar en POST-route för att skapa en ny anteckning.
// - URL: `/api/notes/`
// - Middleware: `auth` (verifierar JWT-token).
// - Controller: `createNote` (skapar en ny anteckning).

router.put('/:id', auth, updateNote);
// Definierar en PUT-route för att uppdatera en befintlig anteckning.
// - URL: `/api/notes/:id` (kräver anteckningens ID som parameter).
// - Middleware: `auth` (verifierar JWT-token).
// - Controller: `updateNote` (uppdaterar anteckningen).

router.delete('/:id', auth, deleteNote);
// Definierar en DELETE-route för att ta bort en anteckning.
// - URL: `/api/notes/:id` (kräver anteckningens ID som parameter).
// - Middleware: `auth` (verifierar JWT-token).
// - Controller: `deleteNote` (tar bort anteckningen).

router.get('/search', auth, searchNotes);
// Definierar en GET-route för att söka efter anteckningar baserat på en söksträng.
// - URL: `/api/notes/search` (kräver en query-parameter, t.ex. `?query=title`).
// - Middleware: `auth` (verifierar JWT-token).
// - Controller: `searchNotes` (söker efter anteckningar).

module.exports = router;
// Exporterar routern så att den kan användas i andra delar av applikationen, t.ex. i `server.js`