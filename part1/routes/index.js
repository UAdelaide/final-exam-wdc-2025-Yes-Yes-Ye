var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dogs', function(req,res,next){
  try {
    db.query(`
      SELECT name AS dog_name, size
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id`, function(error, rows) {
      res.json(rows);
    });
  } catch(error){
    res.status(404).send('Database does not exist or cannot be recognised!');
  }
});

router.get('/api/walkrequests/open', function(req,res,next){

});

router.get('/api/walkers/summary', function(req,res,next){

});

module.exports = router;
