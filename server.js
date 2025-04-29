// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use('/api/notes', require('./routes/notes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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