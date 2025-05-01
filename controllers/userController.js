const validateUser = require('../middleware/validateUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

	const { username, password } = req.body;

		
		let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already exists' });
        }
		//Hasha lösenordet
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//Skapa en ny användare
        user = new User({ username, password: hashedPassword});
        await user.save();

		//Generera JWT-token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
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
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};