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
  try{
    db.query(`
      `);
  } catch(error){}
});

router.get('/api/walkers/summary', function(req,res,next){

});

module.exports = router;
