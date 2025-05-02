# Swing-notes-api
Koppla upp server. node server.js i terminalen.
Klicka på länken: http://localhost:5000/
Du hamnar direkt i swagger (Swing Notes API)
För att kontrollera CRUD i Swing Notes API använd dig av något av dessa program ex. (Postman, Yaak)


Skillnad på Bearer Token och x-auth-token.
Skillnaden ligger i hur token skickas i HTTP-förfågningar och hur den hanteras i backend.
x-auth-token.
Token skickas som en custom header med namnet x-auth-token.
Exempel:GET /api/notes HTTP/1.1
Host: localhost:5000
x-auth-token: <din JWT-token>.
