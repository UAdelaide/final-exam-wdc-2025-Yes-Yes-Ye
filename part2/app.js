const express = require('express');
const path = require('path');
require('dotenv').config();
// Added express-session
const session = require("express-session");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Added session middleware
app.use(session({
    // Basic security measures
    secret: Math.random().toString(36),
    resave: false,
    saveUninitialized: false,
    // Make it so that the session cookie lasts for an hour
    cookie: {
        seure: 'auto',
        maxAge: 60*60*10000
    }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
