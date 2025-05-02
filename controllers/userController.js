const validateUser = require('../middleware/validateUser');
// Importerar `validateUser`, en middleware-funktion som används för att validera inkommande data
// (t.ex. användarnamn och lösenord) med hjälp av Joi. Detta säkerställer att endast korrekt formaterad
// data hanteras i applikationen.

const bcrypt = require('bcrypt');
// Importerar `bcrypt`, ett bibliotek som används för att hash:a lösenord och jämföra hashade lösenord.
// Detta används för att säkerställa att lösenord lagras säkert i databasen.

const jwt = require('jsonwebtoken');
// Importerar `jsonwebtoken`, ett bibliotek som används för att skapa och verifiera JWT-tokens.
// JWT-tokens används för autentisering och auktorisering i applikationen.

const User = require('../models/User');
// Importerar Mongoose-modellen `User` från filen `../models/User`.
// Modellen används för att interagera med "users"-kollektionen i databasen, t.ex. för att skapa,
// läsa och söka efter användare.

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Skapa ett nytt användarkonto
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Konto skapat
 *       400:
 *         description: Ogiltig begäran
 */
exports.signup = async (req, res) => {
    try {
		// Validera inkommande data
		// Använder validateUser (en Joi-valideringsfunktion) för att kontrollera att
        // användarnamn och lösenord uppfyller de krav som ställs (t.ex. längd och obligatoriska fält)
        const { error } = validateUser(req.body);
        if (error) {
			// Om valideringen misslyckas, returnera ett felmeddelande med statuskod 400 (Bad Request)
            return res.status(400).json({ msg: error.details[0].message });
        }
		// Destrukturera "username" och "password" från requestens body
	const { username, password } = req.body;

		// Kontrollera om användarnamnet redan finns i databasen
		let user = await User.findOne({ username });
        if (user) {
			// Om användarnamnet redan finns, returnera ett felmeddelande med statuskod 400 (Bad Request)
            return res.status(400).json({ msg: 'Username already exists' });
        }
		//Hasha lösenordet
		// Generera en salt med bcrypt
		const salt = await bcrypt.genSalt(10);
		// Hasha lösenordet med den genererade salten
		const hashedPassword = await bcrypt.hash(password, salt);

		// Skapa en ny användare med användarnamn och det hashade lösenordet
        user = new User({ username, password: hashedPassword});
		// Spara användaren i databasen
        await user.save();

		// Generera en JWT-token för den nya användaren
        const payload = { user: { id: user.id } }; // Inkludera användarens ID i tokenens payload
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Tokenen är giltig i 1 timme

		// Returnera tokenen som en JSON-respons med statuskod 201 (Created)
        res.status(201).json({ token });
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);

		// Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).json({msg:'Internal server error'});
    }
};

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Logga in en användare
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inloggning lyckades
 *       400:
 *         description: Ogiltiga inloggningsuppgifter
 */
exports.login = async (req, res) => {
	 // Destrukturera "username" och "password" från requestens body
    const { username, password } = req.body;

    try {
		// Hitta användaren i databasen baserat på användarnamnet
        const user = await User.findOne({ username });
		// Om användaren inte hittas, returnera ett felmeddelande med statuskod 400 (Bad Request)
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

		// Jämför det angivna lösenordet med det hashade lösenordet i databasen
        const isMatch = await bcrypt.compare(password, user.password);

		// Om lösenorden inte matchar, returnera ett felmeddelande med statuskod 400 (Bad Request)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

		// Skapa en payload för JWT-tokenen som innehåller användarens ID
        const payload = { user: { id: user.id } };
		// Generera en JWT-token med en hemlighet och en giltighetstid på 1 timme
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

		// Returnera tokenen som en JSON-respons
        res.json({ token });
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		 // Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).send('Server error');
    }
};