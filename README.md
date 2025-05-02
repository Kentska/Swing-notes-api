# Swing-notes-api
Swing Notes API är ett RESTful API för att hantera anteckningar med funktioner för autentisering och auktorisering. API:t är byggt med Node.js, Express, och MongoDB samt inkluderar Swagger-dokumentation för enkel testning och integration.

Installation
1.Klona detta repository:
git clone <repository-url>

2.Navigera till projektmappen:
cd Swing-notes-api

3.Installera beroenden:
npm install

4.Skapa en .env-fil i projektroten och lägg till följande:
MONGO_URI=<din-mongodb-anslutningssträng>
JWT_SECRET=<din-hemliga-nyckel>
PORT=5000

5.Starta servern
npm start

API-struktur

Anteckningar

GET /api/notes: Hämta alla anteckningar för den inloggade användaren.
POST /api/notes: Skapa en ny anteckning.
PUT /api/notes/:id: Uppdatera en befintlig anteckning.
DELETE /api/notes/:id: Ta bort en anteckning.
GET /api/notes/search?query=<söksträng>: Sök efter anteckningar baserat på titel.

Användare

POST /api/user/signup: Skapa ett nytt användarkonto.
POST /api/user/login: Logga in en användare och generera en JWT-token.

Swagger-dokumentation

GET /api-docs: Visa API-dokumentation i Swagger UI.
Swagger UI är tillgänglig på: http://localhost:5000/api-docs




Projektstruktur

Swing-notes-api/
├── controllers/
│   ├── noteController.js    # Hanterar logik för anteckningar
│   ├── userController.js    # Hanterar logik för användare
├── middleware/
│   ├── auth.js              # Middleware för autentisering
│   ├── validateNote.js      # Validerar anteckningsdata
│   ├── validateUser.js      # Validerar användardata
├── models/
│   ├── Note.js              # Mongoose-modell för anteckningar
│   ├── User.js              # Mongoose-modell för användare
├── routes/
│   ├── noteRoutes.js        # Rutter för anteckningar
│   ├── userRoutes.js        # Rutter för användare
├── swagger/
│   ├── swagger.js           # Konfiguration för Swagger-dokumentation
├── config/
│   ├── db.js                # Databasanslutning
├── server.js                # Huvudfil för att starta servern



För att kontrollera CRUD i Swing Notes API använd dig av något av dessa program ex. (Postman, Yaak)


Skillnad på Bearer Token och x-auth-token.
Skillnaden ligger i hur token skickas i HTTP-förfågningar och hur den hanteras i backend.
x-auth-token.
Token skickas som en custom header med namnet x-auth-token.
Exempel:GET /api/notes HTTP/1.1
Host: localhost:5000
x-auth-token: <din JWT-token>.
