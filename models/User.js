const mongoose = require('mongoose');
// Importerar Mongoose-biblioteket för att hantera MongoDB-databasen.

const UserSchema = new mongoose.Schema({
	// Definierar ett schema för användare (users) i databasen.

    username: { type: String, required: true, unique: true },
	// "username" är en sträng som är obligatorisk och måste vara unik.
    // Detta säkerställer att inga två användare kan ha samma användarnamn.

    password: { type: String, required: true },
	// "password" är en sträng som är obligatorisk.
    // Det förväntas vara ett hashat lösenord (inte i klartext) för säkerhet.

    createdAt: { type: Date, default: Date.now },
	// "createdAt" är ett datumfält som automatiskt sätts till det aktuella datumet när användaren skapas.
});

module.exports = mongoose.model('User', UserSchema);
// Exporterar modellen "User" baserat på "UserSchema".
// Detta gör att modellen kan användas för att interagera med "users"-kollektionen i databasen.