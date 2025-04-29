// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const noteController = require('../controllers/noteController');

// router.post('/', auth, noteController.createNote);
// router.get('/', auth, noteController.getNotes);

// module.exports = router;
const express = require('express');
const { getNotes, createNote, updateNote, deleteNote, searchNotes } = require('../controllers/noteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getNotes);
router.post('/', auth, createNote);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.get('/search', auth, searchNotes);

module.exports = router;