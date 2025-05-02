const Joi = require('joi');
// Importerar Joi-biblioteket, som används för att validera inkommande data.

const validateNote = (data) => {
	 // Definierar en valideringsfunktion som tar emot data som argument.

    const schema = Joi.object({
		 // Skapar ett Joi-schema för att definiera reglerna för validering av en anteckning.

        title: Joi.string().min(3).max(50).required(),
		 // Validerar att "title" är en sträng:
        // - Minst 3 tecken.
        // - Max 50 tecken.
        // - Fältet är obligatoriskt.


        content: Joi.string().min(5).max(300).required(),
		// Validerar att "content" är en sträng:
        // - Minst 5 tecken.
        // - Max 300 tecken.
        // - Fältet är obligatoriskt.
    });

    return schema.validate(data);
	// Validerar den inkommande datan mot det definierade schemat.
    // Returnerar ett objekt som innehåller valideringsresultatet:
    // - Om valideringen lyckas: `{ value: ... }`.
    // - Om valideringen misslyckas: `{ error: ... }`.
};

module.exports = validateNote;
// Exporterar funktionen så att den kan användas i andra delar av applikationen.