const Joi = require('joi');
// Importerar Joi-biblioteket, som används för att validera inkommande data.

const validateUser = (data) => {
	// Definierar en valideringsfunktion som tar emot data som argument.

    const schema = Joi.object({
		 // Skapar ett Joi-schema för att definiera reglerna för validering av en användare.

        username: Joi.string().min(3).max(30).required(),
		// Validerar att "username" är en sträng:
        // - Minst 3 tecken.
        // - Max 30 tecken.
        // - Fältet är obligatoriskt.

        password: Joi.string().min(6).required(),
		// Validerar att "password" är en sträng:
        // - Minst 6 tecken.
        // - Fältet är obligatoriskt.
    });

    return schema.validate(data);
	// Validerar den inkommande datan mot det definierade schemat.
    // Returnerar ett objekt som innehåller valideringsresultatet:
    // - Om valideringen lyckas: `{ value: ... }`.
    // - Om valideringen misslyckas: `{ error: ... }`.
};

module.exports = validateUser;
// Exporterar funktionen så att den kan användas i andra delar av applikationen.