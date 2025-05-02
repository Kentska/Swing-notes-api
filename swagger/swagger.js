const swaggerJsdoc = require('swagger-jsdoc');
// Importerar `swagger-jsdoc`, ett bibliotek för att generera Swagger-specifikationer från JSDoc-kommentarer.

const swaggerUi = require('swagger-ui-express');
// Importerar `swagger-ui-express`, ett bibliotek för att visa Swagger-dokumentation i en webbläsare.

const options = {
    definition: {
        openapi: '3.0.0',
		// Anger att API-specifikationen följer OpenAPI 3.0.0-standarden.
        info: {
            title: 'Swing Notes API',
			// Titel för API:t som visas i Swagger-dokumentationen.

            version: '1.0.0',
			// Version av API:t.
            description: 'API för att hantera anteckningar med autentisering och auktorisering.',
			// En kort beskrivning av API:t.
        },
        servers: [
            {
                url: 'http://localhost:5000',
				// Bas-URL för API:t. Detta används för att testa API-endpoints i Swagger UI.
            },
        ],
    },
    apis: ['./controllers/*.js'],
	// Anger var Swagger ska leta efter JSDoc-kommentarer för att generera API-specifikationen.
    // I detta fall letar den i alla filer i `controllers`-mappen.
};

const swaggerSpec = swaggerJsdoc(options);
// Genererar Swagger-specifikationen baserat på de angivna alternativen.

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	// Definierar en route `/api-docs` där Swagger UI visas.
    // `swaggerUi.serve` hanterar statiska filer för Swagger UI.
    // `swaggerUi.setup(swaggerSpec)` visar den genererade Swagger-specifikationen i Swagger UI.
};

module.exports = setupSwagger;
// Exporterar funktionen `setupSwagger` så att den kan användas i andra delar av applikationen, t.ex. i `server.js`.