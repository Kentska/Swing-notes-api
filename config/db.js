const mongoose = require('mongoose');
// Importerar Mongoose-biblioteket, som används för att ansluta till och hantera MongoDB-databasen.

const connectDB = async () => {
	// Definierar en asynkron funktion för att ansluta till databasen.

    try {
        await mongoose.connect(process.env.MONGO_URI, {
			// Använder `mongoose.connect` för att ansluta till MongoDB.
            // `process.env.MONGO_URI` är en miljövariabel som innehåller anslutningssträngen till databasen.

        });
        console.log('MongoDB connected...');
		// Loggar ett meddelande i konsolen om anslutningen lyckas.

    } catch (err) {
        console.error(err.message);
		// Loggar eventuella felmeddelanden till konsolen om anslutningen misslyckas.

        process.exit(1);
		// Avslutar processen med statuskod 1 (indikerar ett fel).
    }
};

module.exports = connectDB;
// Exporterar funktionen `connectDB` så att den kan användas i andra delar av applikationen, t.ex. i `server.js`.