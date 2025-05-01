// Description: This is the main entry point for the Express application. It sets up the server, connects to the database, and defines the routes for notes and users. It also configures Swagger for API documentation.
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger/swagger');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));