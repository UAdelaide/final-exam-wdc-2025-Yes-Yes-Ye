const express = require('express');
const path = require('path');
require('dotenv').config();
// Added express-session
const session = require("express-session");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
// Add session middleware
app.use(session({
    // Generate session id
    secret: Math.random().toString(36).substring(2),
    
}));

// Export the app instead of listening here
module.exports = app;
