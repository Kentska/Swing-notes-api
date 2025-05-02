const Note = require('../models/Note');
// Importerar Mongoose-modellen `Note` från filen `../models/Note`.
// Modellen används för att interagera med "notes"-kollektionen i databasen.
// Den möjliggör CRUD-operationer (Create, Read, Update, Delete) för anteckningar.
const validateNote = require('../middleware/validateNote');
// Importerar valideringsfunktionen `validateNote` från filen `../middleware/validateNote`.
// Funktionen används för att validera inkommande data (t.ex. titel och innehåll) innan den sparas i databasen.
// Detta säkerställer att endast korrekt formaterad data hanteras av applikationen.

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Hämta alla anteckningar för den inloggade användaren
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: En lista med anteckningar
 *       401:
 *         description: Ej auktoriserad
 */
exports.getNotes = async (req, res) => {
    try {
		 // Hämta alla anteckningar från databasen som tillhör den inloggade användaren
        // Filtrera på userId som matchar req.user.id (hämtas från JWT-tokenen via auth-middleware)
        const notes = await Note.find({ userId: req.user.id });

		// Returnera anteckningarna som en JSON-array med statuskod 200 (OK)
        res.status(200).json(notes);
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		// Returnera ett felmeddelande med statuskod 500 (intern serverfel)
        res.status(500).json({msg:'Internal server error'});
    }
};
/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Skapa en ny anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titeln på anteckningen (max 50 tecken)
 *                 example: Min första anteckning
 *               content:
 *                 type: string
 *                 description: Innehållet i anteckningen (max 300 tecken)
 *                 example: Detta är innehållet i anteckningen.
 *     responses:
 *       201:
 *         description: Anteckningen skapades framgångsrikt
 *       400:
 *         description: Ogiltig begäran
 */
exports.createNote = async (req, res) => {
    try {
        // Validera inkommande data med Joi
		// Kontrollera att "title" och "content" uppfyller de krav som definieras i validateNote
        const { error } = validateNote(req.body);
        if (error) {
			// Om valideringen misslyckas, returnera ett felmeddelande med statuskod 400 (Bad Request)
            return res.status(400).json({ msg: error.details[0].message });
        }
		// Destrukturera "title" och "content" från requestens body
        const { title, content } = req.body;
		// Skapa en ny anteckning med de inkommande värdena och användarens ID
        const newNote = new Note({
            title, // Title på anteckningen
            content, // Innehållet i anteckningen
            userId: req.user.id, // Sätt userId från req.user.id (hämtas från JWT-token via auth-middleware)
        });
		// Spara den nya anteckningen i databasen
        const savedNote = await newNote.save();
		// Returnera den sparade anteckningen som en JSON-respons med statuskod 201 (Created)
        res.status(201).json(savedNote);
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		// Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).json({ msg: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Uppdatera en befintlig anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID för anteckningen som ska uppdateras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Ny titel för anteckningen
 *               content:
 *                 type: string
 *                 description: Nytt innehåll för anteckningen
 *     responses:
 *       200:
 *         description: Anteckningen uppdaterades framgångsrikt
 *       404:
 *         description: Anteckningen hittades inte
 *       500:
 *         description: Serverfel
 */
exports.updateNote = async (req, res) => {
    try {
		 // Hämta anteckningens ID från URL-parametrarna
        const { id } = req.params;
		// Hämta "title" och "content" från requestens body
        const { title, content } = req.body;
		// Kontrollera att både "title" och "content" finns i requesten
		if (!title || !content){
			// Om något av fälten saknas, returnera ett felmeddelande med statuskod 400 (Bad Request)
			return res.status(400).json({ msg: 'Title and content are required' });
		}
		 // Uppdatera anteckningen i databasen
        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: req.user.id }, // Filtrera på anteckningens ID och användarens ID
            { title, content }, // Uppdatera titel och innehåll
            { new: true } // Returnera den uppdaterade anteckningen
        );
		// Kontrollera om anteckningen hittades och uppdaterades
        if (!updatedNote) {
			// Om ingen anteckning hittades, returnera ett felmeddelande med statuskod 404 (Not Found)
            return res.status(404).json({ msg: 'Note not found' });
        }
		// Returnera den uppdaterade anteckningen som en JSON-respons med statuskod 200 (OK)
        res.status(200).json(updatedNote);
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		// Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).json({msg: 'Internal server error'});
    }
};

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Ta bort en anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID för anteckningen som ska tas bort
 *     responses:
 *       200:
 *         description: Anteckningen togs bort framgångsrikt
 *       404:
 *         description: Anteckningen hittades inte
 *       500:
 *         description: Serverfel
 */
exports.deleteNote = async (req, res) => {
    try {
		// Hämta anteckningens ID från URL-parametrarna
        const { id } = req.params;
		// Försök att hitta och ta bort anteckningen i databasen
        // Filtrera på anteckningens ID och användarens ID för att säkerställa att användaren äger anteckningen
        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
		// Kontrollera om anteckningen hittades och togs bort
        if (!deletedNote) {
			// Om ingen anteckning hittades, returnera ett felmeddelande med statuskod 404 (Not Found)
            return res.status(404).json({ msg: 'Note not found' });
        }
		// Om anteckningen togs bort framgångsrikt, returnera ett meddelande med statuskod 200 (OK)
        res.status(200).json({ msg: 'Note deleted successfully' });
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		// Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).json({msg:'Internal server error'});
    }
};

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Sök efter anteckningar baserat på titel
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Söksträng för att hitta anteckningar
 *     responses:
 *       200:
 *         description: En lista med matchande anteckningar
 *       400:
 *         description: Ogiltig begäran
 *       500:
 *         description: Serverfel
 */
exports.searchNotes = async (req, res) => {
    try {
		// Hämta söksträngen från query-parametern i URL:en
        const { query } = req.query;
		// Kontrollera att söksträngen finns
        if (!query) {
			// Om söksträngen saknas, returnera ett felmeddelande med statuskod 400 (Bad Request)
            return res.status(400).json({ msg: 'Query parameter is required' });
        }
		// Sök efter anteckningar i databasen
        const notes = await Note.find({
            userId: req.user.id, // Filtrera på användarens ID för att endast hämta den inloggade användarens anteckningar
                 title: { $regex: query, $options: 'i' }, // Sök i titel med regex (case-insensitive)
        });
		// Returnera de matchande anteckningarna som en JSON-array med statuskod 200 (OK)
        res.status(200).json(notes);
    } catch (err) {
		// Logga eventuella fel till serverkonsolen
        console.error(err.message);
		// Returnera ett felmeddelande med statuskod 500 (Internal Server Error)
        res.status(500).json({msg:'Internal server error'});
    }
};