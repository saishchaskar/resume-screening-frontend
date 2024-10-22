const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models'); // Ensure models/index.js exports the sequelize instance
const resumeRoutes = require('./routes/resumeRoutes'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/resumes', resumeRoutes); // Adjust the endpoint according to your routes

// Sync database and start server
const startServer = async () => {
    try {
        await sequelize.sync({ force: false }); // Use { force: true } only for development, will drop tables if they exist
        console.log('Database synchronized successfully!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
