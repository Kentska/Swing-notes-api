const express = require('express');
// Importerar Express-biblioteket för att skapa en server.
const dotenv = require('dotenv');
// Importerar dotenv-biblioteket för att läsa miljövariabler från en `.env`-fil.

const connectDB = require('./config/db');
// Importerar en funktion för att ansluta till databasen.
const setupSwagger = require('./swagger/swagger');
// Importerar en funktion för att konfigurera Swagger-dokumentation.

dotenv.config();
// Laddar miljövariabler från `.env`-filen till `process.env`.
connectDB();
// Ansluter till databasen genom att anropa `connectDB`.

const app = express();
// Skapar en ny Express-applikation.

app.use(express.json());
// Middleware för att parsa inkommande JSON-data i request-body.

const noteRoutes = require('./routes/noteRoutes');
// Importerar rutter för att hantera anteckningar.

const userRoutes = require('./routes/userRoutes');
// Importerar rutter för att hantera användare.

app.use('/api/notes', noteRoutes);
// Kopplar alla rutter i `noteRoutes` till `/api/notes`.

app.use('/api/user', userRoutes);
// Kopplar alla rutter i `userRoutes` till `/api/user`.


setupSwagger(app);
// Konfigurerar Swagger-dokumentation och gör den tillgänglig på `/api-docs`.

app.get('/', (req, res) => {
    res.redirect('/api-docs');
	// Omdirigerar root-URL (`/`) till Swagger-dokumentationen på `/api-docs`.
});

const PORT = process.env.PORT || 5000;
// Hämtar portnumret från miljövariabeln `PORT` eller använder standardporten 5000.
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// Startar servern och lyssnar på den angivna porten.
// Loggar ett meddelande i konsolen när servern körs.