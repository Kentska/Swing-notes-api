const express = require('express');
// Importerar Express-biblioteket för att skapa en router.

const { signup, login } = require('../controllers/userController');
// Importerar funktionerna `signup` och `login` från `userController`.
// Dessa funktioner hanterar logiken för att skapa ett nytt användarkonto och logga in en användare.

const router = express.Router();
// Skapar en ny instans av en Express-router för att definiera API-rutter.

router.post('/signup', signup);
// Definierar en POST-route för att skapa ett nytt användarkonto.
// - URL: `/api/user/signup`
// - Controller: `signup` (hanterar skapandet av ett nytt användarkonto).

router.post('/login', login);
// Definierar en POST-route för att logga in en användare.
// - URL: `/api/user/login`
// - Controller: `login` (hanterar inloggning och generering av JWT-token).


module.exports = router;
// Exporterar routern så att den kan användas i andra delar av applikationen, t.ex. i `server.js`.