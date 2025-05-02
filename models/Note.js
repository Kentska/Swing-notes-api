const mongoose = require('mongoose');
// Importerar Mongoose-biblioteket för att hantera MongoDB-databasen.

const NoteSchema = new mongoose.Schema({
	 // Definierar ett schema för anteckningar (notes) i databasen.

    title: { type: String, required: true, maxLength:50 },
	 // "title" är en sträng som är obligatorisk och får ha max 50 tecken.

    content: { type: String, required: true, maxLength:300 },
	// "content" är en sträng som är obligatorisk och får ha max 300 tecken.

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true, },
	 // "userId" är en referens till en användare (User) i databasen.
    // Det är ett ObjectId som används för att koppla anteckningen till en specifik användare.
    // Fältet är obligatoriskt.

    createdAt: { type: Date, default: Date.now },
	// "createdAt" är ett datumfält som automatiskt sätts till det aktuella datumet när anteckningen skapas.
	modifiedAt:{ type: Date, default: Date.now },
	// "modifiedAt" är ett datumfält som automatiskt sätts till det aktuella datumet när anteckningen skapas.
    // Detta fält uppdateras också vid ändringar (se middleware nedan).
});

NoteSchema.pre('save', function(next) {
	// Middleware som körs innan en anteckning sparas i databasen.
    // Uppdaterar "modifiedAt" till det aktuella datumet.
	this.modifiedAt = Date.now();
	next();
});

NoteSchema.pre('findOneAndUpdate', function (next) {
	// Middleware som körs innan en "findOneAndUpdate"-operation.
    // Uppdaterar "modifiedAt" till det aktuella datumet.
    this.set({ modifiedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Note', NoteSchema);
// Exporterar modellen "Note" baserat på "NoteSchema".
// Detta gör att modellen kan användas för att interagera med "notes"-kollektionen i databasen.