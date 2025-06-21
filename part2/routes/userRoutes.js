const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  // Currently, my session data stores multiple values under the key user.
  // To properly send the user id, I added .user_id at the end of res.json();.
  res.json(req.session.user.user_id);
});

// POST login (dummy version)
// Changed email listings to username
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Added lines for Storing the login within the session
    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // The original code responds with a nested json for user: rows[0].
    // Changed it to role: rows[0].role. Since the only information needed to log in is role.
    res.json({ message: 'Login successful', role: rows[0].role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Created a new route for /api/users/logout.
// Destroys the session and sends a json with the success message.
// If the session could not be destroyed, the function will raise an error.
router.post('/logout', function(req,res){
  console.log("Logout function activated!");
  req.session.destroy(function(err){
    if (err){
      console.error("Error destroying session: ", err);
      return res.status(500).json({ loggedOut: false, message: "Could not log out properly..." });
    }
    console.log("Session destroyed properly!");
    return res.status(200).json({ loggedOut: true, message: "Successfully logged out!" });
  });
});

// Created a new route for /api/users/dognames
// Finds the dogs of the current user based on the session cookie.
// Slightly different formatting from what I've been writing so far since I'm referencing
// The other example routes above for db queries.
router.get('/dognames', async (req, res) => {
  console.log('Current User Info: ', req.session);
  const [rows] = await db.query(`
    SELECT d.name AS dog_name
    FROM Users u
    JOIN Dogs d ON u.user_id = d.owner_id
    WHERE u.user_id = ?
    `, [req.session.user.user_id]);
    console.log('Sent the dogs for ',req.session.user.username, '! The dog(s) are: ', rows);
    res.json(rows);
});

// Created a new route that is a copy of /api/dogs in part1, changed route to /doglist,
// and added the dogID to the query. Also changed the function to async.
router.get('/doglist', function(req,res,next){
  // The try and catch block for handling potential errors as required
  try {
    // SQL Query with specified element names
    db.query(`
      SELECT d.dog_id, d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
      `, function(error, rows) {
      res.json(rows);
    });
  } catch(error){
    // Sending a status error 404 and an errormessage
    res.status(404).send('Database does not exist or cannot be recognised!');
  }
});

module.exports = router;
