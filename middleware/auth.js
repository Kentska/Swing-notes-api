const jwt = require('jsonwebtoken');
// Importerar jsonwebtoken-biblioteket för att hantera JWT-tokens.

const auth = (req, res, next) => {
	// Middleware-funktion som används för att verifiera JWT-token och autentisera användaren.

    const token = req.header('x-auth-token');
	// Hämtar token från requestens header med nyckeln 'x-auth-token'.
    // Om ingen token finns, returneras ett felmeddelande med statuskod 401 (Unauthorized).
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
		// Verifierar tokenen med hjälp av hemligheten som finns i miljövariabeln `JWT_SECRET`.
		 (process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Om verifieringen lyckas, läggs den dekrypterade användarinformationen till i `req.user`.
        req.user = decoded.user;

		// Går vidare till nästa middleware eller route-handler.
        next();
    } catch (err) {

		// Om verifieringen misslyckas (t.ex. om tokenen är ogiltig eller har gått ut),
        // returneras ett felmeddelande med statuskod 401 (Unauthorized).
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
// Exporterar middleware-funktionen så att den kan användas i andra delar av applikationen.