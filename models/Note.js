const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength:50 },
    content: { type: String, required: true, maxLength:300 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true, },
    createdAt: { type: Date, default: Date.now },
	modifiedAt:{ type: Date, default: Date.now },
});

NoteSchema.pre('save', function(next) {
	this.modifiedAt = Date.now();
	next();
});

module.exports = mongoose.model('Note', NoteSchema);