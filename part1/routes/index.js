var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dogs', function(req,res,next){
  // The try and catch block for handling potential errors as required
  try {
    // SQL Query with specified element names
    db.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
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

router.get('/api/walkrequests/open', function(req,res,next){
  // The try and catch block for handling potential errors as required
  try {
    // SQL Query with specified element names
    db.query(`
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
      `, function(error, rows) {
        res.json(rows);
      });
  } catch(error){
    // Sending a status error 404 and an errormessage
    res.status(404).send('Database does not exist or cannot be recognised!');
  }
});

router.get('/api/walkers/summary', function(req,res,next){
  try {
    db.query(`
      SELECT u.username AS walker_username, COUNT(wra.rating_id) AS total_ratings, AVG(wra.rating) AS average_rating, COUNT(wre.request_id) AS completed_walks
      FROM WalkRatings wra
      JOIN Users u WHERE wra.walker_id = u.user_id
      JOIN WalkRequests wrq WHERE wra.request_id = wrq.request_id
      WHERE wrq.status = 'completed'
      
      `
    );
  } catch(error){}
});

module.exports = router;
