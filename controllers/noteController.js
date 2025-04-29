const Note = require('../models/Note');

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
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
 *                 description: Titeln på anteckningen
 *                 example: Min första anteckning
 *               content:
 *                 type: string
 *                 description: Innehållet i anteckningen
 *                 example: Detta är innehållet i anteckningen.
 *     responses:
 *       201:
 *         description: Anteckningen skapades framgångsrikt
 *       400:
 *         description: Ogiltig begäran
 */
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newNote = new Note({
            title,
            content,
            userId: req.user.id,
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
        const { id } = req.params;
        const { title, content } = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { title, content },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
        const { id } = req.params;

        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedNote) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        res.json({ msg: 'Note deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Sök efter anteckningar baserat på titel eller innehåll
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
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ msg: 'Query parameter is required' });
        }

        const notes = await Note.find({
            userId: req.user.id,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
        });

        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};